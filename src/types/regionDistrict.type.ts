import { district, region } from '@/constants/regions';

export type SelectorLabelType = '지역' | '시, 구';
export type RegionType = typeof region;
export type RegionValueType = RegionType[number];
export type DistrictKeyType = keyof typeof district;
export type DistrictValueArrayType = (typeof district)[DistrictKeyType];
export type DistrictValueType = DistrictValueArrayType[number];
export type SelectorItemValueType<Label extends SelectorLabelType> =
  Label extends '지역' ? RegionValueType : DistrictValueType;
export type SelectorContentsType<Label extends SelectorLabelType> =
  Label extends '지역' ? RegionType : DistrictValueArrayType;

export default {};
