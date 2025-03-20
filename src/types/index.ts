import { I18nKey } from '@/i18n';

export type InType = '0' | '1';

export const InTypeMap = {
  '0': '手动查询',
  '1': '图片识别',
};

export type Ingredient = {
  id: string;
  name: string;
  type: string;
  description: string;
  count: number;
  inType: InType;
  inSourceModel: string;
  createdAt: string;
  updatedAt: string;
}

export type IngredientList = Ingredient[];

export type User = {
  id: string;
  username: string;
  role: 'admin' | 'onlyReadAdmin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export type UserList = User[];

export type Menu = {
  title: I18nKey;
  key: string;
  icon: string;
  permission: string[];
}


export type Usage = {
  id: string;
  productName: string;
  model: string;
  modelLabel: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
  createBy: string;
  createdAt: string;
}

export type UsageList = Usage[];