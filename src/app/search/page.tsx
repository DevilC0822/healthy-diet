'use client';

import { atom, useAtom } from "jotai";
import { CardHeader, CardBody, Alert, Button, addToast, Chip, Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Input } from "@heroui/react";
import { AuroraText } from "@/components/AuroraText";
import { models } from "@/config";
import { useLoading } from "@/hooks/useLoading";
import SparklesText from '@/components/SparklesText';
import { userInfoAtom } from "@/store";

const modelNameAtom = atom(Object.keys(models)[0]);
const nameAtom = atom('');
const resultAtom = atom<{
  name: string;
  description: string;
  isDangerous: boolean;
  type: string;
} | null>(null);

export default function SearchIngredient() {
  const [modelName, setModelName] = useAtom(modelNameAtom);
  const [name, setName] = useAtom(nameAtom);
  const [result, setResult] = useAtom(resultAtom);
  const { startLoading, stopLoading } = useLoading();
  const [userInfo] = useAtom(userInfoAtom);

  const onSearch = () => {
    startLoading();
    fetch('/api/ingredients/search', {
      method: 'POST',
      headers: {
        'CreateBy': userInfo?.username ?? '',
      },
      body: JSON.stringify({
        name,
        model: modelName,
        modelLabel: models[modelName].label,
      }),
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
    });
  };

  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="配料搜索" />
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
      </CardHeader>
      <CardBody className='overflow-x-scroll'>
        <div className="flex items-center gap-2 w-[456px] max-md:w-full">
          <Input
            placeholder="请输入配料名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isClearable
          />
          <Button onPress={onSearch}>搜索</Button>
        </div>

        {
          result && (
            <Alert
              key={result.name}
              classNames={{
                base: 'w-full mt-6 max-md:mt-4 flex-grow-0',
                'mainWrapper': 'justify-start mt-0.5',
              }}
              title={<>
                <span>
                  {result.name}
                </span>
                <Chip size="sm" variant="flat" color="primary" className="ml-2">{result.type}</Chip>
              </>}
              description={result.description}
              color={result.isDangerous ? 'danger' : 'secondary'}
            />
          )
        }
      </CardBody>
    </>
  );
}
