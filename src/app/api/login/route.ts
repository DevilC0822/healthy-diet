import User from '@/lib/db/models/user';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { decryptRsaPassword } from '@/app/api/utils';
import { signToken } from '@/utils';

connectToDatabase();

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const { username, password } = await request.json();
    if (!username || !password) {
      return ErrorResponse('用户名和密码不能为空');
    }
    const user = await User.findOne({ username });
    if (!user) {
      return ErrorResponse('账号不存在');
    }
    const rsaPassword = user.password;
    const originalPassword = decryptRsaPassword(rsaPassword);
    if (originalPassword !== password) {
      return ErrorResponse('密码错误');
    }
    const token = await signToken({ username: user.username, role: user.role });
    return SuccessResponse({
      token,
      username: user.username,
      role: user.role,
    });
  });
}
