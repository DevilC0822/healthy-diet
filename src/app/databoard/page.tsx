
import {
  CardHeader,
} from '@heroui/react';
import SparklesText from '@/components/SparklesText';
import TokenUsages from './TokenUsages';

export default function Databoard() {
  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="数据看板" />
        <div className='flex flex-wrap gap-2 mt-2'>
          <TokenUsages />
        </div>
      </CardHeader>
    </>
  );
}