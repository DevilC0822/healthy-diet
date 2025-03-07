import Ingredients from '@/lib/db/models/ingredients';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import dayjs from 'dayjs';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';

connectToDatabase();

export async function GET(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || '';
    let inType: string | undefined = searchParams.get('inType') || '';
    const inSourceModel = searchParams.get('inSourceModel') || '';
    // const count = searchParams.get('count') || '';
    if (inType === 'all') {
      inType = undefined
    }
    // const [minCount, maxCount] = count ? count.split('-').map(Number) : [0, 1000000];
    const current = Number(searchParams.get('current')) || 1;
    const size = Number(searchParams.get('size')) || 10;
    // name 为空时，查询所有
    const query: { [key: string]: unknown } = {
      name: name ? { $regex: name, $options: 'i' } : undefined,
      inType,
      inSourceModel: inSourceModel ? { $regex: inSourceModel, $options: 'i' } : undefined,
      // count: { $gte: minCount, $lte: maxCount }
    };
    // 删除所有 undefined 的 key
    Object.keys(query).forEach((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });
    console.log(query);
    const ingredients = await Ingredients.find(query).skip((current - 1) * size).limit(size);
    const total = await Ingredients.countDocuments(query);
    return SuccessResponse({
      records: ingredients,
      total,
      current,
      size,
    });
  });
}

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const { name, description = '', count = 1 } = await request.json();
    if (!name) {
      return ErrorResponse('配料名称不能为空');
    }
    // 判断是否存在
    const ingredient = await Ingredients.findOne({ name });
    if (ingredient) {
      return ErrorResponse('配料已存在');
    }
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const ingredients = await Ingredients.create({ name, description, count, inType: '0', inSourceModel: '', createdAt: currentTime, updatedAt: currentTime });
    return SuccessResponse(ingredients);
  });
}

export async function PUT(request: NextRequest) {
  return Execution(async () => {
    const { _id, name, description = '', count = 0 } = await request.json();
    const ingredient = await Ingredients.findByIdAndUpdate(_id, { name, description, count }, { new: true });
    return SuccessResponse(ingredient);
  });
}

export async function DELETE(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get('id');
    if (!_id) {
      return ErrorResponse('id不能为空');
    }
    if (_id === 'all') {
      await Ingredients.deleteMany();
      return SuccessResponse({});
    }
    const ingredient = await Ingredients.findById(_id);
    if (!ingredient) {
      return ErrorResponse('配料不存在');
    }
    await Ingredients.findByIdAndDelete(_id);
    return SuccessResponse({});
  });
}