import Usage from '@/lib/db/models/usage';
import { SuccessResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const productName = searchParams.get('productName') || '';
    const model = searchParams.get('model') || '';
    const current = Number(searchParams.get('current')) || 1;
    const size = Number(searchParams.get('size')) || 10;
    const search: { [key: string]: unknown } = {
      productName: productName ? { $regex: productName, $options: 'i' } : undefined,
      model: model ? { $regex: model, $options: 'i' } : undefined,
    };
    // 删除所有 undefined 的 key
    Object.keys(search).forEach((key) => {
      if (search[key] === undefined) {
        delete search[key];
      }
    });
    const usage = await Usage.find(search).sort({ createdAt: -1 }).skip((current - 1) * size).limit(size);
    const total = await Usage.countDocuments(search);
    return SuccessResponse({
      records: usage,
      total,
      current,
      size,
    });
  });
}
