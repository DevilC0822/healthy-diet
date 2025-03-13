import Ingredients from '@/lib/db/models/ingredients';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getService } from '@/app/api/service';
import dayjs from 'dayjs';
import { models } from '@/config/index';

const isJson = (str: string | null) => {
  if (!str) {
    return false;
  }
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

connectToDatabase();

const prompt_for_CN = `
  You are a professional nutritionist. Now, you need to identify the ingredient list in the image and provide the name and a brief introduction for each ingredient (confirming whether it affects human health).
  Please complete the task according to the following steps:
  1. Identify the ingredient list in the image.
  2. For each identified ingredient, provide its name.
  3. Provide a brief introduction for each ingredient, explaining its impact on human health.
  4. Based on the introduction, determine whether the ingredient is harmful to human health, indicated by a boolean value (true indicates harmful, false indicates not harmful).
  5. Please return in Chinese using the string type.
  please using this JSON schema: 
  {
    isIncludeIngredientList: boolean,
    productName: string | 'unknown',
    ingredients: {
      name: string,
      description: string,
      isDangerous: boolean,
    }[],
  }
`;

const prompt_for_EN = `
  You are a professional nutritionist. Now, you need to identify the ingredient list in the image and provide the name and a brief introduction for each ingredient (confirming whether it affects human health).
  Please complete the task according to the following steps:
  1. Identify the ingredient list in the image.
  2. For each identified ingredient, provide its name.
  3. Provide a brief introduction for each ingredient, explaining its impact on human health.
  4. Based on the introduction, determine whether the ingredient is harmful to human health, indicated by a boolean value (true indicates harmful, false indicates not harmful).
  please using this JSON schema: 
  {
    isIncludeIngredientList: boolean,
    productName: string | 'unknown',
    ingredients: {
      name: string,
      description: string,
      isDangerous: boolean,
    }[],
  }
`;

// 接收一张图片 传入的是 formData 类型， file 字段为图片
export async function POST(request: NextRequest) {
  return Execution(async () => {
    const contentType = request.headers.get('content-type') || '';
    const lang = request.headers.get('lang') || 'CN';
    const multipartFormDataRegex = /^multipart\/form-data;.*boundary.*$/;
    if (!multipartFormDataRegex.test(contentType)) {
      return ErrorResponse('请求格式错误：需要 multipart/form-data');
    }
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const model = formData.get('model') as string;
    const modelLabel = formData.get('modelLabel') as string;
    const service = models[model].service;
    if (!file) {
      return ErrorResponse('文件不能为空');
    }
    // 判断文件是否为图片
    if (!file.type.startsWith('image/')) {
      return ErrorResponse('文件类型错误，请上传图片');
    }
    // 判断文件大小
    if (file.size > models[model].limit.size) {
      return ErrorResponse(`文件大小超过${models[model].limit.size / 1024 / 1024}MB`);
    }
    // 判断文件是否为 png 或者 jpg
    if (!models[model].limit.type.includes(file.type)) {
      return ErrorResponse(`文件类型错误，请上传 ${models[model].limit.type.join('、')} 格式`);
    }
    const buffer = await file.arrayBuffer();
    const base64_image = Buffer.from(buffer).toString('base64');

    const completion = await getService(service).chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64_image}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: lang === 'CN' ? prompt_for_CN : prompt_for_EN,
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });
    const response = completion.choices[0].message.content;
    if (!isJson(response)) {
      return ErrorResponse('返回格式错误，请重新上传');
    }
    const result = JSON.parse(response!);
    if (!result.isIncludeIngredientList) {
      return ErrorResponse('图片中不包含配料表，如果确定图片中包含配料表，请切换模型重新上传');
    }
    const ingredients = result.ingredients;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    for (const item of ingredients) {
      // 判断是否存在
      const ingredient = await Ingredients.findOne({ name: item.name });
      if (ingredient) {
        await Ingredients.updateOne({ _id: ingredient._id }, { $set: { 
          description: item.description,
          updatedAt: currentTime,
          inSourceModel: modelLabel,
          count: ingredient.count + 1,
        } });
        continue;
      }
      await Ingredients.create({
        name: item.name,
        description: item.description,
        count: 1,
        inType: '1',
        inSourceModel: modelLabel,
        createdAt: currentTime,
        updatedAt: currentTime,
      });
    }
    return SuccessResponse({
      ...result,
      usage: completion.usage,
    });
  });
}