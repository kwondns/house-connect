import { useRecoilState } from 'recoil';

import Container from '@/components/atoms/Container';
import Selector from '@/components/molecules/Selector';
import { district, region } from '@/constants/regions';
import {
  MoleculeSelectorState,
  SelectorStateType,
} from '@/components/organisms/districtSelector/selector.store';
import {
  DistrictKeyType,
  SelectorItemValueType,
} from '@/types/regionDistrict.type';

type DistrictSelectorProps = {
  onSelectRegion?: (
    region: SelectorItemValueType<'지역'>,
    district: SelectorItemValueType<'시, 구'>,
  ) => void;
};

export default function DistrictSelector({
  onSelectRegion = () => {},
}: DistrictSelectorProps) {
  const [regionSelectorState, setRegionState] = useRecoilState<
    SelectorStateType<'지역'>
  >(MoleculeSelectorState('지역'));
  const [districtSelectorState, setDistrictState] = useRecoilState<
    SelectorStateType<'시, 구'>
  >(MoleculeSelectorState('시, 구'));

  const onClickRegion = (content: SelectorItemValueType<'지역'>) => {
    setRegionState(prev => ({ ...prev, value: content, isOpen: true }));
    setDistrictState(prev => ({ ...prev, isOpen: true }));
  };
  const onClickDistrict = (content: SelectorItemValueType<'시, 구'>) => {
    setRegionState(prev => ({ ...prev, isOpen: false }));
    setDistrictState(prev => ({ ...prev, value: content, isOpen: false }));

    // ! 상위 component에서 최종적인 region state를 setter하는 함수
    if (!['지역', '시, 구'].includes(regionSelectorState.value)) {
      onSelectRegion(
        regionSelectorState.value as SelectorItemValueType<'지역'>,
        content,
      );
    }
  };

  return (
    <Container.FlexRow>
      <Selector<'지역'>
        className="max-w-28"
        contents={region}
        label="지역"
        state={regionSelectorState}
        setState={setRegionState}
        onClick={onClickRegion}
      />
      <Selector<'시, 구'>
        className="z-10 max-w-48 translate-x-[-1px] [&_div>li>button]:justify-start"
        contents={district[regionSelectorState.value as DistrictKeyType] ?? []}
        label="시, 구"
        state={districtSelectorState}
        setState={setDistrictState}
        onClick={onClickDistrict}
      />
    </Container.FlexRow>
  );
}

DistrictSelector.defaultProps = {
  onSelectRegion: () => {},
};
