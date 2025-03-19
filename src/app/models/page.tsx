import { CardHeader } from "@heroui/react";
import SparklesText from '@/components/SparklesText';
import ModelCard from "@/components/ModelCard";
import { models } from "@/config/index";

export default function Models() {
  return (
    <CardHeader className='flex flex-col gap-2 items-start'>
      <SparklesText text="模型列表" />
      <div className="flex flex-wrap gap-2">
        {Object.keys(models).map((key) => (
          <ModelCard className="max-md:max-w-full" key={key} {...models[key]} />
        ))}
      </div>
    </CardHeader>
  );
}
