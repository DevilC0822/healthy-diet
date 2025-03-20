'use client';

import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import {
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  Select,
  SelectItem,
  // Slider,
  Button,
  addToast,
  Chip,
} from '@heroui/react';
import { SearchIcon } from "@heroui/shared-icons";
import { Ingredient, InTypeMap } from '@/types';
import MyTooltip from '@/components/MyTooltip';
import { useLoading } from '@/hooks/useLoading';
import SparklesText from '@/components/SparklesText';
import { models } from '@/config';
import { i18nAtom, I18nKey, useAtomValue } from '@/i18n';

const modelOptions = [
  {
    label: I18nKey.optionAll,
    value: '',
  },
  ...Object.keys(models).map((model) => ({
    label: models[model].label,
    value: models[model].label,
  })),
];

const defaultModel = modelOptions[0].value;

const filterAtom = atom({
  name: '',
  inType: '',
  inSourceModel: defaultModel,
  count: [0, 1000],
});
const ingredientsAtom = atom<Ingredient[]>([]);
const pageInfoAtom = atom({
  current: 1,
  size: 10,
  total: 1,
});

const inTypeOptions = [
  { label: I18nKey.inTypeTotal, value: '' },
  { label: I18nKey.inTypeInput, value: '0' },
  { label: I18nKey.inTypeRecognize, value: '1' },
];

export default function Resource() {
  const i18n = useAtomValue(i18nAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [ingredients, setIngredients] = useAtom(ingredientsAtom);
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const { startLoading, stopLoading } = useLoading();

  const onSearch = (params?: { [key: string]: string | number }) => {
    startLoading();
    fetch(`/api/ingredients?name=${filter.name}&inType=${filter.inType}&inSourceModel=${filter.inSourceModel}&current=${params?.current ?? pageInfo.current}&size=${params?.size ?? pageInfo.size}`)
      .then(res => res.json())
      .then(res => {
        stopLoading();
        if (!res.success) {
          addToast({
            title: '错误',
            description: res.message,
            color: 'danger',
          });
          return;
        }
        setIngredients(res.data.records);
        setPageInfo({
          current: res.data.current,
          size: res.data.size,
          total: Math.ceil(res.data.total / res.data.size),
        });
      });
  };

  const onReset = () => {
    setFilter({ ...filter, name: '', inType: '', inSourceModel: defaultModel, count: [0, 1000] });
  };

  useEffect(() => {
    onSearch({ current: pageInfo.current, size: pageInfo.size });
  }, []);
  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text={i18n[I18nKey.resourceTitle]} />
        <div className="flex items-end gap-4 w-[80%] max-md:w-full max-md:flex-wrap mt-2">
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>{i18n[I18nKey.ingredientName]}</span>
            <Input
              color="secondary"
              aria-label={i18n[I18nKey.ingredientName]}
              placeholder={i18n[I18nKey.ingredientNamePlaceholder]}
              className="min-w-[200px]"
              endContent={<SearchIcon className="text-default-400" width={16} />}
              size="sm"
              value={filter.name}
              onValueChange={(value) => setFilter({ ...filter, name: value })}
            />
          </div>
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>{i18n[I18nKey.inType]}</span>
            <Select
              className='w-[200px] max-md:w-full'
              color="secondary"
              aria-label={i18n[I18nKey.inType]}
              size="sm"
              selectedKeys={[filter.inType]}
              onChange={(e) => {
                if (e.target.value === '') {
                  return;
                }
                setFilter({ ...filter, inType: e.target.value });
              }}
            >
              {inTypeOptions.map((option) => (
                <SelectItem color="secondary" key={option.value}>
                  {i18n[option.label]}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>{i18n[I18nKey.inSourceModel]}</span>
            <Select
              className='w-[200px] max-md:w-full'
              color="secondary"
              aria-label={i18n[I18nKey.inSourceModel]}
              size="sm"
              selectedKeys={[filter.inSourceModel]}
              onChange={(e) => {
                setFilter({ ...filter, inSourceModel: e.target.value });
              }}
            >
              {modelOptions.map((option) => (
                <SelectItem color="secondary" key={option.value}>
                  {Object.keys(I18nKey).includes(option.label) ? i18n[option.label as keyof typeof I18nKey] : option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          {/* <div className='flex items-center gap-2 max-md:w-full'>
              <span className='text-nowrap'>查询次数</span>
              <Slider
                color="secondary"
                aria-label="查询次数"
                className="max-w-md"
                maxValue={1000}
                minValue={0}
                step={10}
                value={filter.count}
                onChange={(value) => setFilter({ ...filter, count: value as number[] })}
              />
            </div> */}
          <div className="flex items-center gap-2 max-md:w-full">
            <Button size="sm" color="secondary" onPress={() => onSearch()}>{i18n[I18nKey.btnSearch]}</Button>
            <Button size="sm" color="secondary" onPress={onReset}>{i18n[I18nKey.btnReset]}</Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className='overflow-x-scroll'>
        <Table
          rowHeight={60}
          isStriped
          className="min-w-[1200px]"
          aria-label="资源列表"
          bottomContent={
            <div className='flex justify-end mt-2'>
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={pageInfo.current}
                total={pageInfo.total}
                boundaries={1}
                onChange={(current) => onSearch({ current })}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn width={160} key="name">{i18n[I18nKey.ingredientName]}</TableColumn>
            <TableColumn width={120} key="type">{i18n[I18nKey.ingredientType]}</TableColumn>
            <TableColumn width={300} key="description">{i18n[I18nKey.ingredientDescription]}</TableColumn>
            <TableColumn width={120} key="count">{i18n[I18nKey.ingredientCount]}</TableColumn>
            <TableColumn width={120} key="inType">{i18n[I18nKey.inType]}</TableColumn>
            <TableColumn width={220} key="inSourceModel">{i18n[I18nKey.inSourceModel]}</TableColumn>
            <TableColumn width={160} key="createdAt">{i18n[I18nKey.createdAt]}</TableColumn>
            <TableColumn width={160} key="updatedAt">{i18n[I18nKey.updatedAt]}</TableColumn>
          </TableHeader>
          <TableBody>
            {ingredients?.map((ingredient) => (
              <TableRow key={ingredient.name}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.type}</TableCell>
                <TableCell>
                  <MyTooltip content={ingredient.description} textEllipsis lineClamp={2}>
                    {ingredient.description}
                  </MyTooltip>
                </TableCell>
                <TableCell>{ingredient.count}</TableCell>
                <TableCell>{InTypeMap[ingredient.inType]}</TableCell>
                <TableCell>
                  <Chip
                    classNames={{
                      base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30 flex-inline",
                      content: "drop-shadow shadow-black text-white",
                    }}
                    variant="shadow"
                  >
                    {ingredient.inSourceModel}
                  </Chip>
                </TableCell>
                <TableCell>{ingredient.createdAt}</TableCell>
                <TableCell>{ingredient.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </>
  );
}
