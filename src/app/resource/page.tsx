/* eslint-disable react-hooks/exhaustive-deps */
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

const filterAtom = atom({
  name: '',
  inType: 'all',
  inSourceModel: '',
  count: [0, 1000],
});
const ingredientsAtom = atom<Ingredient[]>([]);
const pageInfoAtom = atom({
  current: 1,
  size: 10,
  total: 1,
});

const inTypeOptions = [
  { label: '全部', value: 'all' },
  { label: 'AI 入库', value: '1' },
  { label: '手动入库', value: '0' },
];

export default function Resource() {
  const [filter, setFilter] = useAtom(filterAtom);
  const [ingredients, setIngredients] = useAtom(ingredientsAtom);
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const { startLoading, stopLoading } = useLoading();

  const onSearch = (params?: { [key: string]: string | number }) => {
    console.log(filter);
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
    setFilter({ ...filter, name: '', inType: 'all', inSourceModel: '', count: [0, 1000] });
  }

  useEffect(() => {
    onSearch({ current: pageInfo.current, size: pageInfo.size });
  }, []);
  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="配料资源库" />
        <div className="flex items-end gap-4 w-[80%] max-md:w-full max-md:flex-wrap mt-2">
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>配料名称</span>
            <Input
              color="secondary"
              aria-label="配料名称"
              placeholder="请输入配料名称"
              className="min-w-[200px]"
              endContent={<SearchIcon className="text-default-400" width={16} />}
              size="sm"
              value={filter.name}
              onValueChange={(value) => setFilter({ ...filter, name: value })}
            />
          </div>
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>入库方式</span>
            <Select
              className='w-[200px] max-md:w-full'
              color="secondary"
              aria-label="入库方式"
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
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>入库模型</span>
            <Input
              color="secondary"
              aria-label="入库模型"
              placeholder="请输入入库模型"
              className="min-w-[200px]"
              endContent={<SearchIcon className="text-default-400" width={16} />}
              size="sm"
              value={filter.inSourceModel}
              onValueChange={(value) => setFilter({ ...filter, inSourceModel: value })}
            />
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
            <Button size="sm" color="secondary" onPress={() => onSearch()}>查询</Button>
            <Button size="sm" color="secondary" onPress={onReset}>重置</Button>
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
            <TableColumn width={160} key="name">名称</TableColumn>
            <TableColumn width={300} key="description">描述</TableColumn>
            <TableColumn width={120} key="count">入库次数</TableColumn>
            <TableColumn width={120} key="inType">入库方式</TableColumn>
            <TableColumn width={220} key="inSourceModel">入库模型</TableColumn>
            <TableColumn width={120} key="createdAt">创建时间</TableColumn>
            <TableColumn width={120} key="updatedAt">更新时间</TableColumn>
          </TableHeader>
          <TableBody>
            {ingredients?.map((ingredient) => (
              <TableRow key={ingredient.name}>
                <TableCell>{ingredient.name}</TableCell>
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
