import I18nKey from './i18nKey';
import zh_cn from './languages/zh_CN';
import en_US from './languages/en_US';
import { useAtomValue } from 'jotai';
import { i18nAtom } from '@/store';

export type Translation = {
  [K in I18nKey]: string
}

const defaultTranslation = zh_cn;

const map: { [key: string]: Translation } = {
  en_us: en_US,
  zh_cn: zh_cn,
};

export const langsMap: { [key: string]: { label: string; icon: string } } = {
  zh_cn: {
    label: '中文',
    icon: 'icon-park-outline:chinese',
  },
  en_us: {
    label: 'English',
    icon: 'icon-park-outline:english',
  },
};

export function getTranslation(lang: string): Translation {
  return map[lang.toLowerCase()] || defaultTranslation;
}

export { I18nKey, useAtomValue, i18nAtom };