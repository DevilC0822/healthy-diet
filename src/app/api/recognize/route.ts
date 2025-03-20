import Ingredients from '@/lib/db/models/ingredients';
import Usage from '@/lib/db/models/usage';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import { getService } from '@/app/api/service';
import dayjs from 'dayjs';
import { models } from '@/config';

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

const prompt_for_CN = `
  You are a professional nutritionist. Now, you need to identify the ingredient list in the image and provide the name and a brief introduction for each ingredient (confirming whether it affects human health).
  Please complete the task according to the following steps:
  1. Identify the ingredient list in the image.
  2. For each identified ingredient, provide its name.
  3. Provide a brief introduction for each ingredient, explaining its impact on human health.
  4. determine whether the ingredient is harmful to human health, indicated by a boolean value (true indicates harmful, false indicates not harmful).
  5. Please return in Chinese using the string type.
  6. Please return the type of the ingredient in the string type.
  please using this JSON schema: 
  {
    isIncludeIngredientList: boolean,
    productName: string | 'unknown',
    ingredients: {
      name: string,
      description: string,
      isDangerous: boolean,
      type: string,
    }[],
  }
`;

const prompt_for_EN = `
  You are a professional nutritionist. Now, you need to identify the ingredient list in the image and provide the name and a brief introduction for each ingredient (confirming whether it affects human health).
  Please complete the task according to the following steps:
  1. Identify the ingredient list in the image.
  2. For each identified ingredient, provide its name.
  3. Provide a brief introduction for each ingredient, explaining its impact on human health.
  4. determine whether the ingredient is harmful to human health, indicated by a boolean value (true indicates harmful, false indicates not harmful).
  5. Please return in English using the string type.
  6. Please return the type of the ingredient in the string type.
  please using this JSON schema: 
  {
    isIncludeIngredientList: boolean,
    productName: string | 'unknown',
    ingredients: {
      name: string,
      description: string,
      isDangerous: boolean,
      type: string,
    }[],
  }
`;

// 接收一张图片 传入的是 formData 类型， file 字段为图片
export async function POST(request: NextRequest) {
  return Execution(async () => {
    const contentType = request.headers.get('content-type') || '';
    const lang = request.headers.get('lang') || 'zh_cn';
    const createBy = request.headers.get('CreateBy') || '匿名用户';
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
              text: lang === 'zh_cn' ? prompt_for_CN : prompt_for_EN,
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
    let result = JSON.parse(response!);
    // 针对于某些模型返回的并不是 JSON 对象而是一个数组
    if (Array.isArray(result)) {
      result = result[0];
    }
    if (!result.isIncludeIngredientList) {
      return ErrorResponse('图片中不包含配料表，如果确定图片中包含配料表，请切换模型重新上传');
    }
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await Usage.create({
      createBy,
      productName: result?.productName,
      usage: completion?.usage ?? {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0,
      },
      model,
      modelLabel,
      createdAt: currentTime,
    });
    const ingredients = result?.ingredients ?? [];
    for (const item of ingredients) {
      // 判断是否存在
      const ingredient = await Ingredients.findOne({ name: item.name });
      if (ingredient) {
        await Ingredients.updateOne({ _id: ingredient._id }, { $set: { 
          description: item.description,
          updatedAt: currentTime,
          inSourceModel: modelLabel,
          count: ingredient.count + 1,
          type: item.type,
          inType: '1',
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
        type: item.type,
      });
    }
    return SuccessResponse({
      ...result,
      usage: completion.usage,
    });
  });
}