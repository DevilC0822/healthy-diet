'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  cn,
} from '@heroui/react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { i18nAtom, I18nKey, useAtomValue } from '@/i18n';

const today = dayjs().format('YYYY-MM-DD');

const tabKeyMap: { [key: string]: { startDate: string; endDate: string; i18nKey: keyof typeof I18nKey } } = {
  '全部': {
    startDate: '2025-01-01',
    endDate: today,
    i18nKey: 'tabKeyAll',
  },
  // '近 6 个月': {
  //   startDate: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
  //   endDate: today,
  //   i18nKey: 'tabKey6Months',
  // },
  // '近 3 个月': {
  //   startDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
  //   endDate: today,
  //   i18nKey: 'tabKey3Months',
  // },
  '近 30 天': {
    startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
    endDate: today,
    i18nKey: 'tabKey30Days',
  },
  '近 7 天': {
    startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endDate: today,
    i18nKey: 'tabKey7Days',
  },
  '近 3 天': {
    startDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    endDate: today,
    i18nKey: 'tabKey3Days',
  },
};

const formatValue = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "k";
  }

  return value.toLocaleString();
};

const cache = new Map<string, {
  usagesByDay: {
    date: string;
    usage: number;
  }[];
  usage: {
    key: string;
    label: I18nKey;
    value: number;
    lineColor: string;
  }[];
}>();

let chart: echarts.ECharts;

export default function TokenUsages() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState('全部');
  const i18n = useAtomValue(i18nAtom);
  const [typeTabs, setTypeTabs] = useState([
    {
      key: 'total',
      label: I18nKey.tokenTotal,
      value: 0,
      lineColor: '#737ace',
    },
    {
      key: 'prompt',
      label: I18nKey.tokenPrompt,
      value: 0,
      lineColor: '#f095a0',
    },
    {
      key: 'completion',
      label: I18nKey.tokenCompletion,
      value: 0,
      lineColor: '#00b7e4',
    },
  ]);
  const [type, setType] = useState('total');
  const [chartData, setChartData] = useState<{
    date: string;
    usage: number;
  }[]>([]);

  const getChartData = async () => {
    const cacheKey = `${current}-${type}`;
    if (cache.has(cacheKey)) {
      setChartData(cache.get(cacheKey)?.usagesByDay || []);
      setTypeTabs(cache.get(cacheKey)?.usage || []);
      return;
    }
    const startDate = tabKeyMap[current].startDate;
    const endDate = tabKeyMap[current].endDate;
    const res = await fetch(`/api/databoard/token?startDate=${startDate}&endDate=${endDate}&type=${type}`);
    const resData = await res.json();
    setChartData(resData.data.usagesByDay);
    const usage = typeTabs.map(i => ({
      ...i,
      value: resData.data.usage?.[i.key] ?? 0,
    }));
    setTypeTabs(usage);
    cache.set(cacheKey, {
      usagesByDay: resData.data.usagesByDay,
      usage,
    });
  };

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    if (chart) {
      chart.dispose();
    }
    chart = echarts.init(chartRef.current);
    chart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: 0,
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        show: false,
        type: 'category',
        data: chartData.map(i => i.date),
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          data: chartData.map(i => i.usage),
          type: 'line',
          symbol: 'none',
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: typeTabs.find(i => i.key === type)?.lineColor as string,
              },
              {
                offset: 1,
                color: '#f9f9f9',
              },
            ]),
          },
          lineStyle: {
            color: typeTabs.find(i => i.key === type)?.lineColor as string,
          },
        },
      ],
    });
    window.addEventListener('resize', function () {
      chart.resize();
    });
    return () => {
      window.removeEventListener('resize', function () {
        chart.resize();
      });
    };
  }, [chartData]);

  useEffect(() => {
    getChartData();
  }, [current, type]);

  return (
    <Card>
      <CardHeader className='flex flex-col justify-between items-startDate'>
        <p className='text-2xl font-bold'>{i18n[I18nKey.tokenUsagesTitle]}</p>
        <Tabs
          className='mt-2'
          size="sm"
          selectedKey={current}
          onSelectionChange={(key) => setCurrent(key as string)}
        >
          {Object.keys(tabKeyMap).map((key) => (
            <Tab key={key} title={i18n[tabKeyMap[key].i18nKey]} />
          ))}
        </Tabs>
        <div className="mt-2 flex w-full items-center">
          <div className="-my-3 flex w-full max-w-[800px] max-md:max-w-full items-center gap-x-3 overflow-x-auto py-3">
            {typeTabs.map(({ key, value, label }) => (
              <button
                key={key}
                className={cn(
                  "flex w-full flex-col gap-2 rounded-medium p-3 transition-colors",
                  {
                    "bg-default-100": type === key,
                  },
                )}
                onClick={() => setType(key)}
              >
                <span
                  className={cn("text-small font-medium text-default-500 transition-colors", {
                    "text-primary": type === key,
                  })}
                >
                  {i18n[label]}
                </span>
                <div className="flex justify-center items-center gap-x-3">
                  <span className="text-3xl font-bold text-foreground">
                    {formatValue(value)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardHeader >
      <CardBody>
        <div ref={chartRef} className='w-96 h-36 max-md:w-64' />
      </CardBody>
    </Card >
  );
}