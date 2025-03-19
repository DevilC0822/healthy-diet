import Ingredient from '@/lib/db/models/ingredients';
import { SuccessResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const distributionType = searchParams.get('type') || '1'; // distributionType

  return Execution(async () => {
    const ingredients = await Ingredient.find({});
    const allType = [...new Set(ingredients.map(i => i.type))];
    const result = [
      {
        name: '全部',
        value: distributionType === '1' ? ingredients.length : ingredients.reduce((acc, i) => acc + i.count, 0),
        children: [
          {
            name: '手动查询',
            value: distributionType === '1' ? ingredients.filter(i => i.inType === '0').length : ingredients.filter(i => i.inType === '0').reduce((acc, i) => acc + i.count, 0),
            children: allType.map(type => {
              return {
                name: type,
                value: distributionType === '1' ? ingredients.filter((i) => i.type === type && i.inType === '0').length : ingredients.filter((i) => i.type === type && i.inType === '0').reduce((acc, i) => acc + i.count, 0),
                children: ingredients.filter((i) => i.type === type && i.inType === '0').map(i => ({
                  name: i.name,
                  value: distributionType === '1' ? 1 : i.count,
                })),
              };
            }),
          },
          {
            name: '图片识别',
            value: distributionType === '1' ? ingredients.filter(i => i.inType === '1').length : ingredients.filter(i => i.inType === '1').reduce((acc, i) => acc + i.count, 0),
            children: allType.map(type => {
              return {
                name: type,
                value: distributionType === '1' ? ingredients.filter((i) => i.type === type && i.inType === '1').length : ingredients.filter((i) => i.type === type && i.inType === '1').reduce((acc, i) => acc + i.count, 0),
                children: ingredients.filter((i) => i.type === type && i.inType === '1').map(i => ({
                  name: i.name,
                  value: distributionType === '1' ? 1 : i.count,
                })),
              };
            }),
          },
        ],
      },
    ];
    return SuccessResponse(result);
  });
}

