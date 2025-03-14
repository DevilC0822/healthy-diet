import type { Menu } from '@/types';

export const menus: Menu[] = [
  {
    title: '数据看板',
    key: 'databoard',
    icon: 'solar:diagram-up-broken',
    permission: ['*'],
  },
  {
    title: '配料库',
    key: 'resource',
    icon: 'solar:folder-line-duotone',
    permission: ['*'],
  },
  {
    title: '识配料',
    key: 'recognize',
    icon: 'solar:calendar-search-broken',
    permission: ['*'],
  },
  {
    title: '模型库',
    key: 'models',
    icon: 'solar:box-minimalistic-broken',
    permission: ['*'],
  },
  {
    title: '使用记录',
    key: 'usage',
    icon: 'solar:bill-list-outline',
    permission: ['admin', 'onlyReadAdmin'],
  },
  {
    title: '用户管理',
    key: 'user',
    icon: 'solar:user-circle-outline',
    permission: ['admin', 'onlyReadAdmin'],
  },
];
