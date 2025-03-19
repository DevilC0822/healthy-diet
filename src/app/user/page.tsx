'use client';

import { useEffect, useState } from 'react';
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { SearchIcon } from "@heroui/shared-icons";
import { User as TUser } from '@/types';
import MyTooltip from '@/components/MyTooltip';
import { useLoading } from '@/hooks/useLoading';
import SparklesText from '@/components/SparklesText';
import ModelConfirm from '@/components/ModelConfirm';
import { myFetch } from '@/utils';

const filterAtom = atom({
  username: '',
  role: '',
});
const usersAtom = atom<TUser[]>([]);
const pageInfoAtom = atom({
  current: 1,
  size: 10,
  total: 1,
});

const roleOptions = [
  { label: '全部', value: '' },
  { label: '管理员', value: 'admin' },
  { label: '只读管理员', value: 'onlyReadAdmin' },
  { label: '普通用户', value: 'user' },
];

export default function User() {
  const [filter, setFilter] = useAtom(filterAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const { startLoading, stopLoading } = useLoading();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentUser, setCurrentUser] = useState({
    username: '',
    role: 'user',
  });

  const onSearch = (params?: { [key: string]: string | number }) => {
    startLoading();
    myFetch(`/api/user?username=${filter.username}&role=${filter.role}&current=${params?.current ?? pageInfo.current}&size=${params?.size ?? pageInfo.size}`)
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
    setFilter({ ...filter, username: '', role: '' });
  };

  const onEdit = () => {
    startLoading();
    myFetch(`/api/user`, {
      method: 'PUT',
      body: JSON.stringify(currentUser),
    }).then(res => res.json())
      .then(res => {
        if (!res.success) {
          addToast({
            title: '错误',
            description: res.message,
            color: 'danger',
          });
          return;
        }
        onOpenChange();
        onSearch({ current: pageInfo.current, size: pageInfo.size });
      }).finally(() => {
        stopLoading();
      });
  };

  const onDelete = (user: TUser, closeFn: () => void) => {
    startLoading();
    myFetch(`/api/user`, {
      method: 'DELETE',
      body: JSON.stringify({ username: user.username }),
    }).then(res => res.json())
      .then(res => {
        if (!res.success) {
          addToast({
            title: '错误',
            description: res.message,
            color: 'danger',
          });
          return;
        }
        closeFn();
        onSearch({ current: pageInfo.current, size: pageInfo.size });
      }).finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    onSearch({ current: pageInfo.current, size: pageInfo.size });
  }, []);
  return (
    <>
      <CardHeader className='flex flex-col gap-2 items-start'>
        <SparklesText text="用户管理" />
        <div className="flex items-end gap-4 w-[80%] max-md:w-full max-md:flex-wrap mt-2">
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>用户名</span>
            <Input
              color="secondary"
              aria-label="用户名"
              placeholder="请输入用户名"
              className="min-w-[200px]"
              endContent={<SearchIcon className="text-default-400" width={16} />}
              size="sm"
              value={filter.username}
              onValueChange={(value) => setFilter({ ...filter, username: value })}
            />
          </div>
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>角色</span>
            <Select
              className='w-[200px] max-md:w-full'
              color="secondary"
              aria-label="角色"
              size="sm"
              selectedKeys={[filter.role]}
              onChange={(e) => {
                if (e.target.value === '') {
                  return;
                }
                setFilter({ ...filter, role: e.target.value });
              }}
            >
              {roleOptions.map((option) => (
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
            <TableColumn width={160} key="username">用户名</TableColumn>
            <TableColumn width={120} key="role">角色</TableColumn>
            <TableColumn width={180} key="createdAt">创建时间</TableColumn>
            <TableColumn width={180} key="updatedAt">更新时间</TableColumn>
            <TableColumn width={120} key="action">操作</TableColumn>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.username}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <MyTooltip content={roleOptions.find((option) => option.value === user.role)?.label} textEllipsis lineClamp={2}>
                    {roleOptions.find((option) => option.value === user.role)?.label}
                  </MyTooltip>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.updatedAt}</TableCell>
                <TableCell className='flex items-center'>
                  <Button size="sm" variant="light" color="secondary" onPress={() => {
                    setCurrentUser(user);
                    onOpen();
                  }}>编辑</Button>
                  <ModelConfirm
                    title="删除用户"
                    description="确定删除该用户吗？"
                    onConfirm={(closeFn) => onDelete(user, closeFn)}
                  >
                    删除
                  </ModelConfirm>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            编辑用户
          </ModalHeader>
          <ModalBody>
            <Input
              disabled
              label="用户名"
              color="secondary"
              aria-label="用户名"
              placeholder="请输入用户名"
              value={currentUser.username}
              onValueChange={(value) => setCurrentUser({ ...currentUser, username: value })}
            />
            <Select
              label="角色"
              className='max-md:w-full'
              color="secondary"
              aria-label="角色"
              size="sm"
              selectedKeys={[currentUser.role]}
              onChange={(e) => {
                if (e.target.value === '') {
                  return;
                }
                setCurrentUser({ ...currentUser, role: e.target.value });
              }}
            >
              {roleOptions.filter((option) => option.value).map((option) => (
                <SelectItem color="secondary" key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" color="default" onPress={onOpenChange}>取消</Button>
            <Button size="sm" color="secondary" onPress={onEdit}>确定</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
