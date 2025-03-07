import User from '@/lib/db/models/user';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';

connectToDatabase();

// 获取用户 如果 name 为 all 时 返回所有用户，否则返回对应 name 用户
export async function GET(_request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (name === 'all') {
    return Execution(async () => {
      const users = await User.find();
      return SuccessResponse(users.map((user) => user.toJSON()));
    });
  }
  return Execution(async () => {
    const user = await User.findOne({ name: name });
    if (!user) {
      return ErrorResponse('用户不存在');
    }
    return SuccessResponse(user?.toJSON());
  });
}

// 删除用户 name 必填
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (name === 'all') {
    return Execution(async () => {
      await User.deleteMany();
      return SuccessResponse(null, { msg: '所有用户已删除' });
    });
  }
  return Execution(async () => {
    const user = await User.findOne({ name });
    if (!user) {
      return ErrorResponse('用户不存在');
    }
    await User.deleteOne({ name });
    return SuccessResponse(null, { msg: '用户删除成功' });
  });
}
