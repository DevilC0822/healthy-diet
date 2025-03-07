import Ingredients from '@/lib/db/models/ingredients';
import { SuccessResponse, ErrorResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getService } from '@/app/api/service';
import dayjs from 'dayjs';
import { models } from '@/config/index';

connectToDatabase();

const prompt = `
  你是一个专业的营养师，现在需要你识别图片中的配料表，并给出每一项配料的名称、简介(需要确认它是否会影响人体健康)。
  请以 直接返回 JSON 格式输出: 包含 商品名称(productName)以及每个配料(ingredients)的名称(name)、简介(description)、是否危害人体健康(isDangerous)。
  如果没有商品名称，productName 返回未知。
  如果图片中没有配料表，请返回 null。
`;

// 接收一张图片 传入的是 formData 类型， file 字段为图片
export async function POST(request: NextRequest) {
  return Execution(async () => {
    const contentType = request.headers.get('content-type') || '';
    const multipartFormDataRegex = /^multipart\/form-data;.*boundary.*$/;
    if (!multipartFormDataRegex.test(contentType)) {
      return ErrorResponse('请求格式错误：需要 multipart/form-data');
    }
    const formData = await request.formData();
    console.log(formData);

    const file = formData.get('file') as File;
    const model = formData.get('model') as string;
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
    console.log(base64_image?.length);
    
    const completion = await getService(service).chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64_image}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });
    const response = completion.choices[0].message.content;
    if (!response) {
      return ErrorResponse('识别失败');
    }
    const json = response.match(/```json\n([\s\S]*?)\n```/);
    if (!json) {
      return ErrorResponse('识别失败');
    }
    const result = JSON.parse(json[1]);
    const ingredients = result.ingredients;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    for (const item of ingredients) {
      // 判断是否存在
      const ingredient = await Ingredients.findOne({ name: item.name });
      if (ingredient) {
        await Ingredients.updateOne({ _id: ingredient._id }, { $set: { 
          description: item.description,
          updatedAt: currentTime,
          inSourceModel: model,
        } });
        continue;
      }
      await Ingredients.create({
        name: item.name,
        description: item.description,
        count: 1,
        inType: '1',
        inSourceModel: model,
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