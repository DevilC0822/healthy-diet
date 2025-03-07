import { NextResponse } from 'next/server';

type ResponseOptions = {
  code?: number;
  success?: boolean;
  msg?: string;
}

export function SuccessResponse(data: unknown, { code = 200, success = true, msg = 'success' }: ResponseOptions = {}) {
  return NextResponse.json({
    code,
    success,
    data,
    msg,
  });
}

type ErrorResponseOptions = {
  code?: number;
  success?: boolean;
  data?: null;
}

export function ErrorResponse(msg: string, { code = 500, success = false, data = null }: ErrorResponseOptions = {}) {
  return NextResponse.json({
    code,
    success,
    data,
    msg,
  });
}

// type ExecutionResult = {
//   success: boolean;
//   data: object | null;
//   msg?: string;
//   code?: number;
// }

// 执行函数并返回结果
export async function Execution(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    console.log(error);
    return ErrorResponse(error instanceof Error ? error.message : '服务器错误');
  }
}