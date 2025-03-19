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
  Button,
  addToast,
  Chip,
} from '@heroui/react';
import { SearchIcon } from "@heroui/shared-icons";
import { Usage as TUsage } from '@/types';
import { useLoading } from '@/hooks/useLoading';
import SparklesText from '@/components/SparklesText';
import { myFetch } from '@/utils';
import { models } from '@/config';

const usersAtom = atom<TUsage[]>([]);
const pageInfoAtom = atom({
  current: 1,
  size: 10,
  total: 1,
});

const modelOptions = [
  {
    label: '全部',
    value: '',
  },
  ...Object.keys(models).map((model) => ({
    label: models[model].label,
    value: models[model].label,
  })),
];

const defaultModel = modelOptions[0].value;

const filterAtom = atom({
  productName: '',
  model: defaultModel,
});

export default function User() {
  const [filter, setFilter] = useAtom(filterAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const { startLoading, stopLoading } = useLoading();

  const onSearch = (params?: { [key: string]: string | number }) => {
    startLoading();
    myFetch(`/api/usage?productName=${filter.productName}&model=${filter.model}&current=${params?.current ?? pageInfo.current}&size=${params?.size ?? pageInfo.size}`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          addToast({
            title: '错误',
            description: res.message,
            color: 'danger',
          });
          return;
        }
        setUsers(res.data.records);
        setPageInfo({
          current: res.data.current,
          size: res.data.size,
          total: Math.ceil(res.data.total / res.data.size),
        });
      }).finally(() => {
        stopLoading();
      });
  };

  const onReset = () => {
    setFilter({ ...filter, productName: '', model: defaultModel });
  };
  useEffect(() => {
    onSearch({ current: pageInfo.current, size: pageInfo.size });
  }, []);
  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="使用记录" />
        <div className="flex items-end gap-4 w-[80%] max-md:w-full max-md:flex-wrap mt-2">
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>产品名称</span>
            <Input
              color="secondary"
              aria-label="产品名称"
              placeholder="请输入产品名称"
              className="min-w-[200px]"
              endContent={<SearchIcon className="text-default-400" width={16} />}
              size="sm"
              value={filter.productName}
              onValueChange={(value) => setFilter({ ...filter, productName: value })}
            />
          </div>
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>识别模型</span>
            <Select
              className='w-[200px] max-md:w-full'
              color="secondary"
              aria-label="模型"
              size="sm"
              selectedKeys={[filter.model]}
              onChange={(e) => {
                if (e.target.value === '') {
                  return;
                }
                setFilter({ ...filter, model: e.target.value });
              }}
            >
              {modelOptions.map((option) => (
                <SelectItem color="secondary" key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>
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
          aria-label="用户列表"
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
            <TableColumn width={160} key="id">ID</TableColumn>
            <TableColumn width={300} key="productName">产品名称</TableColumn>
            <TableColumn width={180} key="model">模型</TableColumn>
            <TableColumn width={120} key="usage">Token使用量</TableColumn>
            <TableColumn width={120} key="createBy">创建人</TableColumn>
            <TableColumn width={180} key="createdAt">创建时间</TableColumn>
          </TableHeader>
          <TableBody>
            {users?.map((usage) => (
              <TableRow key={usage.id}>
                <TableCell>{usage.id}</TableCell>
                <TableCell>{usage.productName}</TableCell>
                <TableCell>
                  <Chip
                    classNames={{
                      base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30 flex-inline",
                      content: "drop-shadow shadow-black text-white",
                    }}
                    variant="shadow"
                  >
                    {usage.model}
                  </Chip>
                </TableCell>
                <TableCell>{Number(usage.usage.total_tokens).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}</TableCell>
                <TableCell>{usage.createBy}</TableCell>
                <TableCell>{usage.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </>
  );
}
