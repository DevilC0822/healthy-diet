import { createStore, atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Menu } from '@/types';
import { menus } from '@/config/menu';

type UserInfo = {
  username: string;
  role: string;
  menu: Menu[];
}

const myStore = createStore();

const dietTokenAtom = atomWithStorage('diet-token', '', {
  getItem: (key) => {
    if (typeof window === 'undefined') {
      return '';
    }
    return localStorage.getItem(key) || '';
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(key);
  },
}, {
  getOnInit: true,
});

const userInfoAtom = atom<UserInfo | null>(null);

const isLoginAtom = atom(async (get) => {
  if (typeof window === 'undefined') {
    return false;
  }
  const token = get(dietTokenAtom);
  try {
    const response = await fetch('/api/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      method: 'GET',
    }).then(res => res.json());
    myStore.set(userInfoAtom, {
      ...response.data,
      menu: menus.filter(menu => menu.permission.includes('*') || menu.permission.includes(response.data.role)),
    });
    return response.success;
  } catch {
    myStore.set(userInfoAtom, {
      username: '',
      role: '',
      menu: menus.filter(menu => menu.permission.includes('*')),
    });
    return false;
  }
});

export default myStore;

export { isLoginAtom, dietTokenAtom, userInfoAtom };
