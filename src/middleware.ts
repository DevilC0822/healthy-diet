import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse } from '@/utils';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET as string
);

// 需要验证 token 的接口
const NOT_INCLUDE: { [key: string]: string[] } = {
  '/api/user': ['get', 'put', 'delete'],
}

// 需要验证 token 角色为 admin 的接口
const ONLY_ADMIN_ALLOW: { [key: string]: string[] } = {
  '/api/user': ['put', 'delete'],
}

export default async function jwtMiddleware(request: NextRequest) {
  const method = request.method;
  const path = request.nextUrl.pathname;

  if (!NOT_INCLUDE[path]?.includes(method.toLowerCase())) {
    return NextResponse.next();
  }
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return ErrorResponse('无权限，请先登录');
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const exp = payload.exp as number;
    if (exp < Date.now() / 1000) {
      return ErrorResponse('Token 已过期');
    }
    const role = payload.role as string;
    if (ONLY_ADMIN_ALLOW[path]?.includes(method.toLowerCase()) && role !== 'admin') {
      return ErrorResponse('无权限');
    }
    return NextResponse.next();
  } catch {
    return ErrorResponse('无效的 Token');
  }
}

// 排除登录接口
export const config = {
  matcher: '/api/:path*',
};
