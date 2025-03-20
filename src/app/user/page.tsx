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
import { useLoading } from '@/hooks/useLoading';
import SparklesText from '@/components/SparklesText';
import ModelConfirm from '@/components/ModelConfirm';
import { myFetch } from '@/utils';
import { i18nAtom, I18nKey, useAtomValue } from '@/i18n';
import { roleOptions } from '@/config';
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

export default function User() {
  const i18n = useAtomValue(i18nAtom);
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
        <SparklesText text={i18n[I18nKey.userManagementTitle]} />
        <div className="flex items-end gap-4 w-[80%] max-md:w-full max-md:flex-wrap mt-2">
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>{i18n[I18nKey.username]}</span>
            <Input
              color="secondary"
              aria-label={i18n[I18nKey.username]}
              placeholder={i18n[I18nKey.usernamePlaceholder]}
              className="min-w-[200px]"
              endContent={<SearchIcon className="text-default-400" width={16} />}
              size="sm"
              value={filter.username}
              onValueChange={(value) => setFilter({ ...filter, username: value })}
            />
          </div>
          <div className='flex items-center gap-2 max-md:w-full'>
            <span className='text-nowrap'>{i18n[I18nKey.role]}</span>
            <Select
              className='w-[200px] max-md:w-full'
              color="secondary"
              aria-label={i18n[I18nKey.role]}
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
                  {i18n[option.label]}
                </SelectItem>
              ))}
            </Select>
          </div>
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
          aria-label={i18n[I18nKey.userList]}
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
            <TableColumn width={160} key="username">{i18n[I18nKey.username]}</TableColumn>
            <TableColumn width={120} key="role">{i18n[I18nKey.role]}</TableColumn>
            <TableColumn width={180} key="createdAt">{i18n[I18nKey.createdAt]}</TableColumn>
            <TableColumn width={180} key="updatedAt">{i18n[I18nKey.updatedAt]}</TableColumn>
            <TableColumn width={120} key="action">{i18n[I18nKey.action]}</TableColumn>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.username}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{i18n[roleOptions.find((option) => option.value === user.role)?.label as keyof typeof I18nKey]}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.updatedAt}</TableCell>
                <TableCell className='flex items-center'>
                  <Button size="sm" variant="light" color="secondary" onPress={() => {
                    setCurrentUser(user);
                    onOpen();
                  }}>{i18n[I18nKey.editUser]}</Button>
                  <ModelConfirm
                    title={i18n[I18nKey.deleteUser]}
                    description={i18n[I18nKey.deleteUserTip]}
                    onConfirm={(closeFn) => onDelete(user, closeFn)}
                  >
                    {i18n[I18nKey.deleteUser]}
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
            {i18n[I18nKey.editUser]}
          </ModalHeader>
          <ModalBody>
            <Input
              disabled
              label={i18n[I18nKey.username]}
              color="secondary"
              aria-label={i18n[I18nKey.username]}
              placeholder={i18n[I18nKey.usernamePlaceholder]}
              value={currentUser.username}
              onValueChange={(value) => setCurrentUser({ ...currentUser, username: value })}
            />
            <Select
              label={i18n[I18nKey.role]}
              className='max-md:w-full'
              color="secondary"
              aria-label={i18n[I18nKey.role]}
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
            <Button size="sm" color="default" onPress={onOpenChange}>{i18n[I18nKey.cancel]}</Button>
            <Button size="sm" color="secondary" onPress={onEdit}>{i18n[I18nKey.confirm]}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
