export type InType = '0' | '1';

export const InTypeMap = {
  '0': '手动入库',
  '1': 'AI 入库',
}

export type Ingredient = {
  id: string;
  name: string;
  description: string;
  count: number;
  inType: InType;
  inSourceModel: string;
  createdAt: string;
  updatedAt: string;
}

export type IngredientList = Ingredient[];