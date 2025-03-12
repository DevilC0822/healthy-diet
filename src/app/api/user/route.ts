import User from '@/lib/db/models/user';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import { connectToDatabase } from '@/lib/db';
import { decryptRsaPassword, encryptRsaPassword } from '@/app/api/utils';
import { signToken } from '@/utils';

connectToDatabase();

export async function GET(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || '';
    const role = searchParams.get('role') || '';
    const current = Number(searchParams.get('current')) || 1;
    const size = Number(searchParams.get('size')) || 10;
    // username 为空时，查询所有
    const query: { [key: string]: unknown } = {
      username: username ? { $regex: username, $options: 'i' } : undefined,
      role: role ? { $regex: role, $options: 'i' } : undefined,
    };
    // 删除所有 undefined 的 key
    Object.keys(query).forEach((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });
    const users = await User.find(query).skip((current - 1) * size).limit(size);
    const total = await User.countDocuments(query);
    return SuccessResponse({
      records: users,
      total,
      current,
      size,
    });
  });
}

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const { username, password, role = 'user' } = await request.json();
    if (!username) {
      return ErrorResponse('账号不能为空');
    }
    if (['all'].includes(username)) {
      return ErrorResponse('账号不合法，请使用其他账号');
    }
    const user = await User.findOne({ username });
    if (user) {
      return ErrorResponse('账号已存在');
    }
    // 将密码进行 rsa 加密
    const rsaPassword = encryptRsaPassword(password);
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const newUser = await User.create({ username, password: rsaPassword, role, createdAt: currentTime, updatedAt: currentTime });
    const token = await signToken({ username: newUser.username, role: newUser.role });
    return SuccessResponse({
      user: newUser,
      token,
    }, { message: '账号创建成功' });
  });
}

export async function PUT(request: NextRequest) {
  return Execution(async () => {
    const { username, oldPassword, newPassword, role = 'user' } = await request.json();
    if (!username) {
      return ErrorResponse('账号不能为空');
    }
    const user = await User.findOne({ username });
    if (!user) {
      return ErrorResponse('账号不存在');
    }
    if (oldPassword || newPassword) {
      const rsaOldPassword = decryptRsaPassword(oldPassword);
      if (rsaOldPassword !== user.password) {
        return ErrorResponse('原密码不正确，请重新输入');
      }
      const rsaNewPassword = encryptRsaPassword(newPassword);
      const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const updatedUser = await User.updateOne({ username }, { password: rsaNewPassword, role, updatedAt: currentTime });
      return SuccessResponse(updatedUser, { message: '账号更新成功' });
    }
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const updatedUser = await User.updateOne({ username }, { role, updatedAt: currentTime });
    return SuccessResponse(updatedUser, { message: '账号更新成功' });
  });
}

export async function DELETE(request: NextRequest) {
  return Execution(async () => {
    const { username } = await request.json();
    if (username === 'all') {
      await User.deleteMany();
      return SuccessResponse({ message: '所有账号删除成功' });
    }
    await User.deleteOne({ username });
    return SuccessResponse({ message: '账号删除成功' });
  });
}