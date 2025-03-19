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

const today = dayjs().format('YYYY-MM-DD');

const tabKeyMap: { [key: string]: { startDate: string; endDate: string } } = {
  '全部': {
    startDate: '2025-01-01',
    endDate: today,
  },
  // '近 6 个月': {
  //   startDate: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
  //   endDate: today,
  // },
  // '近 3 个月': {
  //   startDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
  //   endDate: today,
  // },
  '近 30 天': {
    startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
    endDate: today,
  },
  '近 7 天': {
    startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endDate: today,
  },
  '近 3 天': {
    startDate: dayjs().subtract(2, 'day').format('YYYY-MM-DD'),
    endDate: today,
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
  inCountByDay: {
    date: string;
    count: number;
  }[];
  counts: {
    key: string;
    label: string;
    value: number;
    lineColor: string;
  }[];
}>();

let chart: echarts.ECharts;

export default function IngredientInCount() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState('全部');
  const [typeTabs, setTypeTabs] = useState([
    {
      key: 'total',
      label: '全部',
      value: 0,
      lineColor: '#737ace',
    },
    {
      key: 'input',
      label: '手动查询',
      value: 0,
      lineColor: '#f095a0',
    },
    {
      key: 'recognize',
      label: '图片识别',
      value: 0,
      lineColor: '#00b7e4',
    },
  ]);
  const [type, setType] = useState('total');
  const [chartData, setChartData] = useState<{
    date: string;
    count: number;
  }[]>([]);

  const getChartData = async () => {
    const cacheKey = `${current}-${type}`;
    if (cache.has(cacheKey)) {
      setChartData(cache.get(cacheKey)?.inCountByDay || []);
      setTypeTabs(cache.get(cacheKey)?.counts || []);
      return;
    }
    const startDate = tabKeyMap[current].startDate;
    const endDate = tabKeyMap[current].endDate;
    const res = await fetch(`/api/databoard/in-count?startDate=${startDate}&endDate=${endDate}&type=${type}`);
    const resData = await res.json();
    setChartData(resData.data.inCountByDay);
    const counts = typeTabs.map(i => ({
      ...i,
      value: resData.data.counts?.[i.key] ?? 0,
    }));
    setTypeTabs(counts);
    cache.set(cacheKey, {
      inCountByDay: resData.data.inCountByDay,
      counts,
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
          data: chartData.map(i => i.count),
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
        <p className='text-2xl font-bold'>配料入库量</p>
        <Tabs
          className='mt-2'
          size="sm"
          selectedKey={current}
          onSelectionChange={(key) => setCurrent(key as string)}
        >
          {Object.keys(tabKeyMap).map((key) => (
            <Tab key={key} title={key} />
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
                  {label}
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