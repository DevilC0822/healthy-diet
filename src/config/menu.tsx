import type { Menu } from '@/types';

export const menus: Menu[] = [
  {
    title: '配料库',
    key: 'resource',
    icon: 'solar:folder-line-duotone',
    permission: ['*'],
  },
  {
    title: '配料识别',
    key: 'recognize',
    icon: 'solar:bill-list-outline',
    permission: ['*'],
  },
  {
    title: '用户管理',
    key: 'user',
    icon: 'solar:user-circle-outline',
    permission: ['admin', 'onlyReadAdmin'],
  },
];
