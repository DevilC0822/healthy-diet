'use client';
import {
  CardHeader,
} from '@heroui/react';
import SparklesText from '@/components/SparklesText';
import TokenUsages from './TokenUsages';
import IngredientInCount from './IngredientInCount';
import TypeDistribution from './TypeDistribution';
import { i18nAtom, I18nKey, useAtomValue } from '@/i18n';

export default function Databoard() {
  const i18n = useAtomValue(i18nAtom);
  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text={i18n[I18nKey.databoardTitle]} />
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