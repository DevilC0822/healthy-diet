import { models } from '@/config';
import { ErrorResponse, Execution, SuccessResponse } from '@/utils';
import { NextRequest } from 'next/server';
import { getService } from '@/app/api/service';
import dayjs from 'dayjs';
import Usage from '@/lib/db/models/usage';
import Ingredients from '@/lib/db/models/ingredients';
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

const getPrompt = (lang: string, name: string) => {
  if (lang === 'zh_cn') {
    return `
      You are a professional nutritionist. Users should provide the names of food ingredients. Based on the food ingredient names provided by the user, please provide the corresponding food ingredient name, detailed description, type, and whether it is harmful to the human body.
      first indicates is ${name}, Please return in Chinese using the string type and use the following JSON format to return the information:
      {
        isIngredient: boolean, // Return true if it can be used as a food ingredient, otherwise return false.
        name: string,
        description: string,
        type: string,
        isDangerous: boolean,
      }
    `;
  }
  return `
      You are a professional nutritionist. Users should provide the names of food ingredients. Based on the food ingredient names provided by the user, please provide the corresponding food ingredient name, detailed description, type, and whether it is harmful to the human body.
      first indicates is ${name}, Please use the following JSON format to return the information:
      {
        isIngredient: boolean, // Return true if it can be used as a food ingredient, otherwise return false.
        name: string,
        description: string,
        type: string,
        isDangerous: boolean,
      }
  `;
};


export async function POST(request: NextRequest) {
  return Execution(async () => {
    const { name, model, modelLabel } = await request.json();
    const lang = request.headers.get('lang') ?? 'zh_cn';
    const createBy = request.headers.get('CreateBy') ?? '匿名用户';
    const service = models[model].service;
    if (!service) {
      return ErrorResponse('模型不存在');
    }
    const completion = await getService(service).chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: getPrompt(lang, name),
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });
    const response = completion.choices[0].message.content;
    if (!isJson(response)) {
      return ErrorResponse('返回格式错误，请重新查询');
    }
    let result = JSON.parse(response!);
    // 针对于某些模型返回的并不是 JSON 对象而是一个数组
    if (Array.isArray(result)) {
      result = result[0];
    }
    if (!result.isIngredient) {
      return ErrorResponse(`${name}不是食品配料,如果你确定它是食品配料,请切换模型重新查询`);
    }
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await Usage.create({
      createBy,
      productName: result?.name,
      usage: completion?.usage ?? {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0,
      },
      model,
      modelLabel,
      createdAt: currentTime,
    });
    const ingredient = await Ingredients.findOne({ name: result.name });
    if (ingredient) {
      await Ingredients.updateOne({ _id: ingredient._id }, {
        $set: {
          description: result.description,
          updatedAt: currentTime,
          inSourceModel: modelLabel,
          count: ingredient.count + 1,
          type: result.type,
          inType: '0',
        },
      });
    } else {
      await Ingredients.create({
        name: result.name,
        description: result.description,
        count: 1,
        inType: '0',
        inSourceModel: modelLabel,
        createdAt: currentTime,
        updatedAt: currentTime,
        type: result.type,
      });
    }
    return SuccessResponse(result);
  });
}
