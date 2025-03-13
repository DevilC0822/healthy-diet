'use client';

import { atom, useAtom } from "jotai";
import { CardHeader, CardBody, Alert, Button, addToast, Chip, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@heroui/react";
import { FlickeringGrid } from "@/components/FlickeringGrid";
import { AuroraText } from "@/components/AuroraText";
import { models } from "@/config";
import { useLoading } from "@/hooks/useLoading";
import { cn } from "@/lib/utils";
import MyTooltip from "@/components/MyTooltip";
import SparklesText from '@/components/SparklesText';
import { isMobileDevice } from "@/lib/utils";

const modelNameAtom = atom(Object.keys(models)[0]);
const resultAtom = atom<{
  productName: string;
  ingredients: {
    name: string;
    description: string;
    isDangerous: boolean;
  }[];
} | null>(null);

const UploadComponent = ({ result = false, className }: { result?: boolean, className?: string }) => {
  return (
    <div className={
      cn(
        'relative h-80 w-full overflow-hidden rounded-lg border bg-background flex justify-center items-center',
        result && 'hidden',
        className
      )
    }>
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full w-full h-80"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
      <h1 className="text-4xl font-bold tracking-tighter">
        上传 <AuroraText>配料图片</AuroraText>
      </h1>
    </div>
  )
}

export default function Inbound() {
  const [modelName, setModelName] = useAtom(modelNameAtom);
  const [result, setResult] = useAtom(resultAtom);
  const { startLoading, stopLoading } = useLoading();

  const uploadImage = (file: File) => {
    startLoading();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', modelName);
    formData.append('modelLabel', models[modelName].label);
    fetch('/api/recognize', {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(data => {
      if (!data.success) {
        addToast({
          title: '识别失败',
          description: data.message,
          color: 'danger',
        });
      }
      setResult(data.data ?? null);
    }).finally(() => {
      stopLoading();
    })
  }

  const onSelectImage = () => {
    // 创建一个input标签
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // 将 input 添加到 DOM 中，防止在 iOS Safari 中被过早回收
    input.style.position = 'absolute';
    input.style.visibility = 'hidden';
    input.style.pointerEvents = 'none';
    input.style.left = '-9999px';
    document.body.appendChild(input);

    // 添加多个事件监听
    const handleFile = (e: Event) => {
      try {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          uploadImage(file);
          // 重置input，确保同一文件可以重复选择
          target.value = '';
        }
      } catch {
        addToast({
          title: '选择图片失败',
          description: '请重试或选择其他图片',
          color: 'danger',
        });
      } finally {
        // 从 DOM 中移除 input 元素
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
      }
    };

    // 绑定多个相关事件，确保在各种浏览器中都能正确触发
    if (isMobileDevice()) {
      input.addEventListener('input', handleFile, false);
    } else {
      input.addEventListener('change', handleFile, false);
    }
    input.click();
  }
  const onReset = () => {
    setResult(null);
  }

  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="配料识别" />
        <div className="w-full flex flex-col gap-2 items-start mt-2">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold tracking-tighter flex items-center max-md:text-base">
              <span className="max-md:text-sm">模型：</span><AuroraText>{models[modelName].label}</AuroraText>
            </p>
            <Dropdown trigger="press" placement="bottom" backdrop="blur">
              <DropdownTrigger>
                <Chip
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30 cursor-pointer",
                    content: "drop-shadow shadow-black text-white",
                  }}
                  variant="shadow"
                >
                  更换模型
                </Chip>
              </DropdownTrigger>
              <DropdownMenu
                disabledKeys={Object.keys(models).filter(key => models[key].disabled).map(key => key as string)}
                aria-label="Link Actions"
              >
                {Object.keys(models).map(key => (
                  <DropdownItem
                    key={key}
                    onPress={() => setModelName(key)}
                    textValue={models[key].label}
                  >
                    {models[key].label}
                    {models[key].modelCompany && <Chip variant="flat" color="secondary" className="ml-2">{models[key].modelCompany}</Chip>}
                    {models[key].disabled && <span className="text-sm text-gray-500 ml-2">({models[key]?.disabledReason ?? ''})</span>}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <span className="text-sm text-gray-500">
            {models[modelName].description}
          </span>
        </div>
        {/* 上传说明 */}
        <Alert color="primary" title="上传说明" description={
          `支持${models[modelName].limit.type.join('、')}格式，大小不超过${models[modelName].limit.size / 1024 / 1024}MB`
        } />
      </CardHeader>
      <CardBody className='overflow-x-scroll'>
        <div className="cursor-pointer" onClick={onSelectImage}>
          <UploadComponent result={!!result} className="w-full" />
        </div>
        {result && (
          <div className="mt-4">
            <div className="flex items-end gap-2 justify-between">
              <h1 className="text-4xl max-md:text-xl font-bold tracking-tighter">
                商品名称：<AuroraText>{result.productName}</AuroraText>
              </h1>
              <Button color="secondary" size="sm" onPress={onReset}>
                重新上传
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap mt-6">
              {result.ingredients.map(ingredient => (
                <Alert
                  key={ingredient.name}
                  classNames={{
                    'mainWrapper': 'justify-start mt-0.5',
                  }}
                  className={`
                    w-[calc(25%-0.5rem)]
                    max-xl:w-[calc(33.333333%-0.5rem)]
                    max-lg:w-[calc(50%-0.5rem)]
                    max-sm:w-full
                    min-h-[98px]
                  `}
                  title={<MyTooltip content={ingredient.name}>
                    <span className="text-lg line-clamp-1 min-h-[20px]">{ingredient.name}</span>
                  </MyTooltip>}
                  description={<MyTooltip
                    content={ingredient.description}
                    textEllipsis
                    lineClamp={2}>
                    {ingredient.description}
                  </MyTooltip>}
                  color={ingredient.isDangerous ? 'danger' : 'secondary'}
                />
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </>
  );
}
