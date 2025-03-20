import Usage from '@/lib/db/models/usage';
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

export async function GET(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const type = searchParams.get('type') || 'total';
    const usages = await Usage.find({
      createdAt: {
        $gte: dayjs(startDate).startOf('day').format('YYYY-MM-DD'),
        $lte: dayjs(endDate).add(1, 'day').startOf('day').format('YYYY-MM-DD'),
      },
    });
    const dates = generateDateArray(startDate, endDate);
    const usagesByDay = dates.map((date) => ({
      date,
      usage: usages.filter((usage) => dayjs(usage?.createdAt).format('YYYY-MM-DD') === date).reduce((acc, usage) => acc + usage.usage[`${type}_tokens`], 0),
    }));
    return SuccessResponse({
      usage: {
        total: usages.reduce((acc, usage) => acc + usage.usage.total_tokens, 0),
        prompt: usages.reduce((acc, usage) => acc + usage.usage.prompt_tokens, 0),
        completion: usages.reduce((acc, usage) => acc + usage.usage.completion_tokens, 0),
      },
      usagesByDay,
    });
  });
}
