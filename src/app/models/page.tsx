'use client';

import { CardHeader } from "@heroui/react";
import SparklesText from '@/components/SparklesText';
import ModelCard from "@/components/ModelCard";
import { models } from "@/config/index";
import { i18nAtom, I18nKey, useAtomValue } from "@/i18n";

export default function Models() {
  const i18n = useAtomValue(i18nAtom);
  return (
    <CardHeader className='flex flex-col gap-2 items-start'>
      <SparklesText text={i18n[I18nKey.modelLibraryTitle]} />
      <div className="flex flex-wrap gap-2">
        {Object.keys(models).map((key) => (
          <ModelCard className="max-md:max-w-full" key={key} {...models[key]} />
        ))}
      </div>
    </CardHeader>
  );
}
