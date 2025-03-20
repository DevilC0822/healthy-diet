import Ingredient from '@/lib/db/models/ingredients';
import { SuccessResponse, Execution } from '@/utils';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';

function generateDateArray(startDate: string, endDate: string) {
  const dates = [];
  let currentDate = dayjs(startDate);
  const finalDate = dayjs(endDate);
  while (currentDate.isBefore(finalDate) || currentDate.isSame(finalDate, "day")) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }
  return dates;
}

const inTypeMap: Record<string, string | undefined> = {
  total: undefined,
  input: '0',
  recognize: '1',
};

export async function GET(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const inType = searchParams.get('inType') || '';
    const inTypeKey = inTypeMap[inType];
    const ingredients = await Ingredient.find({
      updatedAt: {
        $gte: dayjs(startDate).startOf('day').format('YYYY-MM-DD'),
        $lte: dayjs(endDate).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
      },
    });
    const dates = generateDateArray(startDate, endDate);
    const inCountByDay = dates.map((date) => ({
      date,
      count: ingredients.filter((ingredient) => (inTypeKey ? inTypeKey === ingredient.inType : true) && dayjs(ingredient?.updatedAt).format('YYYY-MM-DD') === date).reduce((acc, ingredient) => acc + ingredient.count, 0),
    }));
    return SuccessResponse({
      counts: {
        total: ingredients.reduce((acc, ingredient) => acc + ingredient.count, 0),
        input: ingredients.filter((ingredient) => ingredient.inType === '0').reduce((acc, ingredient) => acc + ingredient.count, 0),
        recognize: ingredients.filter((ingredient) => ingredient.inType === '1').reduce((acc, ingredient) => acc + ingredient.count, 0),
      },
      inCountByDay,
    });
  });
}
