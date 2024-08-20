import { atom, RecoilState } from 'recoil';

import { HouseListType } from '@/types/house.type';

const HouseListFilterAtomState: RecoilState<HouseListType> =
  atom<HouseListType>({
    key: 'HouseListFilterState',
    default: {
      house_type: undefined,
      rental_type: undefined,
      term: undefined,
      deposit_price: undefined,
      monthly_rental_price: undefined,
      mate_number: 0,
      mate_gender: 0,
      regions: undefined,
    },
  });
export default HouseListFilterAtomState;
