'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
} from '@heroui/react';
import * as echarts from 'echarts';
import { i18nAtom, I18nKey, useAtomValue } from '@/i18n';

const chart: {
  [key: string]: echarts.ECharts;
} = {};

const chartNameType: { [key: string]: I18nKey } = {
  '0': I18nKey.typeDistributionTimes,
  '1': I18nKey.typeDistributionCount,
};

export default function IngredientInProportion({ type }: { type: '0' | '1' }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const i18n = useAtomValue(i18nAtom);
  const [chartData, setChartData] = useState<{
    name: string;
    value: number;
    children: {
      name: string;
      value: number;
      children: {
        name: string;
        value: number;
      }[];
    }[];
  }[]>([]);

  const getChartData = async () => {
    const res = await fetch(`/api/databoard/type-distribution?type=${type}`);
    const data = await res.json();
    setChartData(data.data);
  };

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    if (chart[type]) {
      chart[type].dispose();
    }
    chart[type] = echarts.init(chartRef.current);
    chart[type].setOption({
      tooltip: {
        trigger: 'item',
      },
      grid: {
        left: 0,
        right: '5%',
        bottom: '5%',
        top: '0',
        containLabel: true,
      },
      series: {
        type: 'sunburst',
        data: chartData,
        radius: [0, '90%'],
        itemStyle: {
          borderRadius: 7,
          borderWidth: 2,
        },
        label: {
          show: false,
        },
      },
    });
    window.addEventListener('resize', function () {
      chart[type].resize();
    });
    return () => {
      window.removeEventListener('resize', function () {
        chart[type].resize();
      });
    };
  }, [chartData]);

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <Card>
      <CardHeader className='flex flex-col justify-between items-startDate'>
        <p className='text-2xl font-bold'>{i18n[chartNameType[type]]}</p>
      </CardHeader >
      <CardBody className='flex justify-center items-center'>
        <div ref={chartRef} className='w-96 h-72 max-md:w-64' />
      </CardBody>
    </Card >
  );
}