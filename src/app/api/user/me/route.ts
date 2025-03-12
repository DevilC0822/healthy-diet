/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { jwtVerify } from 'jose';

connectToDatabase();

export async function GET(request: NextRequest) {
  return Execution(async () => {
    try {
      const token = request.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return ErrorResponse('未授权');
      }
      // 解密 token
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || ''));
      return SuccessResponse(payload);
    } catch (error) {
      // @ts-expect-error
      if (error.code === 'ERR_JWT_EXPIRED') {
        return ErrorResponse('Token 已过期，请重新登录', {
          code: 401,
        });
      }
      return ErrorResponse('Token 验证失败', {
        code: 401
      });
    }
  });
}