
import {
  CardHeader,
} from '@heroui/react';
import SparklesText from '@/components/SparklesText';
import TokenUsages from './TokenUsages';
import IngredientInCount from './IngredientInCount';
import TypeDistribution from './TypeDistribution';

export default function Databoard() {
  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="数据看板" />
        <div className='flex flex-wrap gap-2 mt-2 max-md:flex-col max-md:w-full'>
          <TokenUsages />
          <IngredientInCount />
          <TypeDistribution type='0' />
          <TypeDistribution type='1' />
        </div>
      </CardHeader>
    </>
  );
}