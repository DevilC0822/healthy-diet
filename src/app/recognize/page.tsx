'use client';

import { atom, useAtom } from "jotai";
import { CardHeader, CardBody, Alert, Button, addToast, Chip, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@heroui/react";
import { FlickeringGrid } from "@/components/FlickeringGrid";
import { AuroraText } from "@/components/AuroraText";
import { models } from "@/config";
import { useLoading } from "@/hooks/useLoading";
import { cn } from "@heroui/react";
import MyTooltip from "@/components/MyTooltip";
import SparklesText from '@/components/SparklesText';
import { isMobileDevice, replaceString } from "@/utils";
import { userInfoAtom } from "@/store";
import PulsatingButton from "@/components/PulsatingButton";
import { i18nAtom, I18nKey, useAtomValue } from "@/i18n";
import { langAtom } from "@/store";

const modelNameAtom = atom(Object.keys(models)[0]);
const resultAtom = atom<{
  productName: string;
  ingredients: {
    name: string;
    description: string;
    isDangerous: boolean;
    type: string;
  }[];
} | null>(null);

export default function Inbound() {
  const i18n = useAtomValue(i18nAtom);
  const lang = useAtomValue(langAtom);
  const [modelName, setModelName] = useAtom(modelNameAtom);
  const [result, setResult] = useAtom(resultAtom);
  const { startLoading, stopLoading } = useLoading();
  const [userInfo] = useAtom(userInfoAtom);

  const uploadImage = (file: File) => {
    startLoading();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', modelName);
    formData.append('modelLabel', models[modelName].label);
    fetch('/api/recognize', {
      method: 'POST',
      headers: {
        'CreateBy': userInfo?.username ?? '',
        'Lang': lang,
      },
      body: formData,
    }).then(res => res.json()).then(data => {
      if (!data.success) {
        addToast({
          title: i18n[I18nKey.recognizeFail],
          description: data.message,
          color: 'danger',
        });
      }
      setResult(data.data ?? null);
    }).finally(() => {
      stopLoading();
    });
  };

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
          title: i18n[I18nKey.selectImageFail],
          description: i18n[I18nKey.selectImageFailTip],
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
  };
  const onReset = () => {
    setResult(null);
  };

  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text={i18n[I18nKey.recognizeTitle]} />
        <div className="w-full flex flex-col gap-2 items-start mt-2">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold tracking-tighter flex items-center max-md:text-base">
              <span className="max-md:text-sm">{i18n[I18nKey.model]}：</span><AuroraText>{models[modelName].label}</AuroraText>
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
                  {i18n[I18nKey.changeModel]}
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
            {lang === 'zh_cn' ? models[modelName].description : models[modelName].descriptionEn}
          </span>
        </div>
        {/* 上传说明 */}
        <Alert color="primary" title={i18n[I18nKey.uploadDescTitle]} description={
          `${replaceString(i18n[I18nKey.uploadDescTip], {
            type: models[modelName].limit.type.join('、'),
            size: (models[modelName].limit.size / 1024 / 1024).toString(),
          })}`
        } />
      </CardHeader>
      <CardBody className='overflow-x-scroll'>
        <div className="cursor-pointer" onClick={onSelectImage}>
          <div className={
            cn(
              'relative h-80 w-full overflow-hidden rounded-lg border bg-background flex justify-center items-center',
              result && 'hidden',
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
            <PulsatingButton
              className="text-2xl font-bold"
            >
              {i18n[I18nKey.btnUpload]}
            </PulsatingButton>
          </div>
        </div>
        {result && (
          <div className="mt-4">
            <div className="flex items-end gap-2 justify-between">
              <h1 className="text-4xl max-md:text-xl font-bold tracking-tighter">
                {i18n[I18nKey.productName]}：<AuroraText>{result.productName}</AuroraText>
              </h1>
              <Button color="secondary" size="sm" onPress={onReset}>
                {i18n[I18nKey.btnReUpload]}
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
                  title={<div className="flex items-center">
                    <MyTooltip content={ingredient.name}>
                      <span className="text-lg line-clamp-1 min-h-[20px]">{ingredient.name}</span>
                    </MyTooltip>
                    <Chip size="sm" variant="flat" color="primary" className="ml-2">{ingredient.type}</Chip>
                  </div>}
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
