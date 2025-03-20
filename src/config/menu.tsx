import type { Menu } from '@/types';
import { I18nKey } from '@/i18n';

export const menus: Menu[] = [
  {
    title: I18nKey.menuDataboard,
    key: 'databoard',
    icon: 'solar:diagram-up-broken',
    permission: ['*'],
  },
  {
    title: I18nKey.menuResource,
    key: 'resource',
    icon: 'solar:folder-line-duotone',
    permission: ['*'],
  },
  {
    title: I18nKey.menuIngredientRecognize,
    key: 'recognize',
    icon: 'solar:card-search-broken',
    permission: ['*'],
  },
  {
    title: I18nKey.menuIngredientSearch,
    key: 'search',
    icon: 'solar:calendar-search-broken',
    permission: ['*'],
  },
  {
    title: I18nKey.menuModelLibrary,
    key: 'models',
    icon: 'solar:box-minimalistic-broken',
    permission: ['*'],
  },
  {
    title: I18nKey.menuUsage,
    key: 'usage',
    icon: 'solar:bill-list-outline',
    permission: ['admin', 'onlyReadAdmin'],
  },
  {
    title: I18nKey.menuUserManagement,
    key: 'user',
    icon: 'solar:user-circle-outline',
    permission: ['admin', 'onlyReadAdmin'],
  },
];
