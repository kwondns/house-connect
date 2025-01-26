import { atomFamily } from 'recoil';

import {
  SelectorLabelType,
  SelectorItemValueType,
} from '@/types/regionDistrict.type';

export type SelectorStateType<Label extends SelectorLabelType> = {
  value: SelectorItemValueType<Label> | SelectorLabelType;
  isOpen: boolean;
};

export const MoleculeSelectorState = atomFamily<
  SelectorStateType<SelectorLabelType>,
  SelectorLabelType
>({
  key: 'selectorOpenState',
  default: (label: SelectorLabelType) => ({
    value: label,
    isOpen: false,
  }),
});

export default {};
