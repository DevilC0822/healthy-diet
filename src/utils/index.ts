import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

type ResponseOptions = {
  code?: number;
  success?: boolean;
  message?: string;
}

export function SuccessResponse(data: unknown, { code = 200, success = true, message = 'success' }: ResponseOptions = {}) {
  return NextResponse.json({
    code,
    success,
    data,
    message,
  });
}

type ErrorResponseOptions = {
  code?: number;
  success?: boolean;
  data?: null;
}

export function ErrorResponse(message: string, { code = 200, success = false, data = null }: ErrorResponseOptions = {}) {
  return NextResponse.json({
    code,
    success,
    data,
    message,
  });
}

// 执行函数并返回结果
export async function Execution(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    console.log(error);
    return ErrorResponse(error instanceof Error ? error.message : '服务器错误');
  }
}

// 添加 token 请求头的 Fetch
export function myFetch(url: string, options: RequestInit = {}) {
  const token = window.localStorage.getItem('diet-token');
  if (token) {
    options.headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
  }
  return fetch(url, options);
}

// 生成 token
export async function signToken({ username, role }: { username: string, role: string }) {
  return await new SignJWT({ username, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));
}


// 判断是否是移动端设备 使用 navigator.userAgent 判断
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
