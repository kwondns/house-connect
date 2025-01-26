import { atom } from 'recoil';
import { Session } from '@supabase/supabase-js';

import { UserType } from '@/types/auth.type';

export const IsNotVerifiedAtom = atom({
  key: 'isNotVerifiedAtom',
  default: false,
});

export const UserAtom = atom<UserType | null>({
  key: 'userAtom',
  default: null,
});

export const SessionAtom = atom<Session | null>({
  key: 'sessionAtom',
  default: null,
});

export const IsInitializingSession = atom<boolean>({
  key: 'isInitializingSession',
  default: true,
});
