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
    fetch('/api/recognize', {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then(data => {
      console.log(data);
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
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      console.log(file);
      if (file) {
        uploadImage(file);
      }
    }
    input.click();
  }
  // 调用系统相机
  // const onOpenCamera = () => {
  //   navigator.mediaDevices.getUserMedia({
  //     video: true,
  //   }).then(stream => {
  //     // 拿到照片文件
  //     const video = document.createElement('video');
  //     video.srcObject = stream;
  //     video.play();
  //     document.body.appendChild(video);
  //     // 拍照
  //     video.onclick = () => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;
  //       canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
  //       // 将 base64 字符串转换为 Blob 对象
  //       const base64 = canvas.toDataURL('image/jpeg');
  //       const byteString = atob(base64.split(',')[1]);
  //       const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  //       const ab = new ArrayBuffer(byteString.length);
  //       const ia = new Uint8Array(ab);
  //       for (let i = 0; i < byteString.length; i++) {
  //         ia[i] = byteString.charCodeAt(i);
  //       }
  //       const blob = new Blob([ab], { type: mimeString });
  //       const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
  //       uploadImage(file);
  //       // 停止视频流并移除视频元素
  //       const tracks = stream.getTracks();
  //       tracks.forEach(track => track.stop());
  //       document.body.removeChild(video);
  //     }
  //   })
  // }
  const onReset = () => {
    setResult(null);
  }

  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="配料识别" />
        <div className="w-full flex flex-col gap-2 items-start mt-2">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold tracking-tighter flex items-center">
              <span>模型：</span><AuroraText>{models[modelName].name}</AuroraText>
            </p>
            <Dropdown placement="right" backdrop="blur">
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
              <DropdownMenu aria-label="Link Actions">
                {Object.keys(models).map(key => (
                  <DropdownItem key={key} onPress={() => setModelName(key)}>
                    {models[key].name}
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
        <Alert color="secondary" title="上传说明" description={
          `支持${models[modelName].limit.type.join('、')}格式，大小不超过${models[modelName].limit.size / 1024 / 1024}MB`
        } />
      </CardHeader>
      <CardBody className='overflow-x-scroll'>
        <div className="cursor-pointer" onClick={onSelectImage}>
          <UploadComponent result={!!result} className="w-full" />
        </div>

        {/* {
          isMobileDevice() ? (
            <Dropdown backdrop="blur" offset={-120}>
              <DropdownTrigger>
                <div className="cursor-pointer">
                  <UploadComponent result={!!result} className="w-full" />
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="select" onPress={onSelectImage}>
                  从相册选择
                </DropdownItem>
                <DropdownItem key="camera" onPress={onOpenCamera}>
                  拍照
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="cursor-pointer" onClick={onSelectImage}>
              <UploadComponent result={!!result} className="w-full" />
            </div>
          )
        } */}
        {result && (
          <div className="mt-4">
            <div className="flex items-end gap-2 justify-between">
              <h1 className="text-4xl max-md:text-2xl font-bold tracking-tighter">
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
                    h-[118px]
                  `}
                  title={<MyTooltip content={ingredient.name}>
                    <span className="text-lg line-clamp-1 min-h-[20px]">{ingredient.name}</span>
                  </MyTooltip>}
                  description={<MyTooltip content={ingredient.description} textEllipsis lineClamp={3}>
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
