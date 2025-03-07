import User from '@/lib/db/models/user';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import { connectToDatabase } from '@/lib/db';

connectToDatabase();

// 创建用户 name 必填且唯一 email 非必填
export async function POST(request: NextRequest) {
  return Execution(async () => {
    const { name, email } = await request.json();
    if (!name) {
      return ErrorResponse('用户名不能为空');
    }
    if (['all'].includes(name)) {
      return ErrorResponse('用户名不合法，请使用其他用户名');
    }
    // 判断用户是否存在
    const user = await User.findOne({ name });
    if (user) {
      return ErrorResponse('用户已存在');
    }
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const newUser = await User.create({ name, email, createdAt: currentTime, updatedAt: currentTime });
    return SuccessResponse(newUser, { msg: '用户创建成功' });
  });
}

// 更新用户 name 必填且唯一 email 非必填
export async function PUT(request: NextRequest) {
  return Execution(async () => {
    const { name, email } = await request.json();
    if (!name) {
      return ErrorResponse('用户名不能为空');
    }
    const user = await User.findOne({ name });
    if (!user) {
      return ErrorResponse('用户不存在');
    }
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const updatedUser = await User.updateOne({ name }, { email, updatedAt: currentTime });
    return SuccessResponse(updatedUser, { msg: '用户更新成功' });
  });
}

