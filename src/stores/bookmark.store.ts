import { atom } from 'recoil';

export const BookmarkPageAtom = atom({ key: 'bookmarkKey', default: 1 });

export const BookmarkCurrentTabAtom = atom({ key: 'bookmarkTab', default: 0 });

export const BookmarkHouseFilterAtom = atom({
  key: 'bookmarkHouseFilter',
  default: '',
});
