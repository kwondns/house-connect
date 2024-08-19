import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Container from '@/components/atoms/Container';
import Divider from '@/components/atoms/Divider';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import useModal from '@/hooks/useModal';
import { HouseListFilterAtom } from '@/stores/globalModal.store';
import ModalBackdrop from '@/components/organisms/modals/ModalBackdrop';
import {
  genderDisplayData,
  houseTypeDisplayData,
  mateNumberDisplayData,
  rentalTypeDisplayData,
} from '@/constants/signUpProfileData';
import Button from '@/components/atoms/Button';
import {
  MoleculeSelectorState,
  SelectorStateType,
} from '@/components/organisms/districtSelector/selector.store';
import BadgeButton from '@/components/molecules/BadgeButton';
import DistrictSelector from '@/components/organisms/districtSelector/DistrictSelector';
import { SelectorItemValueType } from '@/types/regionDistrict.type';
import { createToast } from '@/libs/toast';
import { SignupProfileStateSelector } from '@/stores/sign.store';
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import Icon from '@/components/atoms/Icon';
import { genderInfo, mateNumInfo } from '@/constants/profileDetailInfo';

function HouseListFilterModal() {
  const { isOpen } = useRecoilValue(HouseListFilterAtom);
  const { closeModal: closeHouseListFilterModal } = useModal('HouseListFilter');

  const setDistrictState = useSetRecoilState<SelectorStateType<'시, 구'>>(
    MoleculeSelectorState('시, 구'),
  );
  const [regions, setRegions] = useRecoilState(
    SignupProfileStateSelector('regions'),
  );
  const [term, setTerm] = useRecoilState(SignupProfileStateSelector('term'));
  const [depositPrice, setDepositPrice] = useRecoilState(
    SignupProfileStateSelector('deposit_price'),
  );
  const [monthlyPrice, setMonthlyPrice] = useRecoilState(
    SignupProfileStateSelector('monthly_rental_price'),
  );

  const onClickSelectFinish = (
    region: SelectorItemValueType<'지역'>,
    district: SelectorItemValueType<'시, 구'>,
  ) => {
    setRegions(prev => {
      if (prev.includes(`${region} ${district}`)) {
        createToast('duplicatedRegion', '중복된 지역을 선택하셨습니다.', {
          type: 'error',
          isLoading: false,
          containerId: 'signUpProfileToastContainer',
          autoClose: 1000,
        });
        return prev;
      }

      if (prev.length >= 3) {
        createToast('maxRegionLimit', '최대 3개 지역까지 선택 가능합니다.', {
          type: 'warning',
          isLoading: false,
          containerId: 'signUpProfileToastContainer',
          autoClose: 1000,
        });
        return prev;
      }
      return [...prev, `${region} ${district}`];
    });

    setDistrictState({ value: '시, 구', isOpen: false });
    // form.setValue('regions', [`${region} ${district}`]);
  };
  const onClickDeleteRegionBadge = (
    value: `${SelectorItemValueType<'지역'>} ${SelectorItemValueType<'시, 구'>}`,
  ) => setRegions(prev => prev.filter(location => location !== value));

  return isOpen ? (
    <ModalBackdrop modalType="HouseListFilter">
      <Container.FlexCol className="max-h-[49.25rem] w-full max-w-[42.25rem] rounded-xl bg-bg text-brown">
        <Container.FlexRow className="sticky items-center justify-between px-8 py-6">
          <Typography.SubTitle1>필터</Typography.SubTitle1>
          <IconButton.Ghost
            iconType="close"
            iconClassName="size-5"
            className="size-8 items-center justify-center"
            onClick={() => closeHouseListFilterModal()}
          />
        </Container.FlexRow>
        <Divider.Col className="border-t-0" />
        <Container.FlexCol className="gap-y-10 overflow-y-scroll p-8">
          <Container.FlexCol className="gap-y-7">
            <Typography.SubTitle2>집 유형</Typography.SubTitle2>
            <Container.FlexCol className="gap-y-4">
              <Container.FlexRow className="flex-wrap gap-x-2">
                {houseTypeDisplayData.map(({ displayValue, stateValue }) => (
                  <Button.Outline
                    key={displayValue}
                    className="rounded-[1.875rem] px-5 py-[0.625rem]"
                  >
                    <Typography.P2>{displayValue}</Typography.P2>
                  </Button.Outline>
                ))}
              </Container.FlexRow>
              <Container.FlexRow className="flex-wrap gap-x-2">
                {rentalTypeDisplayData.map(({ displayValue, stateValue }) => (
                  <Button.Outline
                    key={displayValue}
                    className="rounded-[1.875rem] px-5 py-[0.625rem]"
                  >
                    <Typography.P2>{displayValue}</Typography.P2>
                  </Button.Outline>
                ))}
              </Container.FlexRow>
            </Container.FlexCol>
          </Container.FlexCol>
          <Divider.Col className="border-t-0" />
          <Container.FlexCol className="gap-y-7">
            <Typography.SubTitle2>위치</Typography.SubTitle2>
            <Container.FlexRow className="flex-wrap gap-2">
              {regions?.map(location => (
                <BadgeButton.Fill
                  key={location}
                  className="gap-x-3 rounded-[1.875rem] px-4 py-[0.75rem] text-bg tablet:gap-x-3 [&_p]:translate-y-[-0.0625rem]"
                  iconType="close"
                  stroke="bg"
                  onClick={() => onClickDeleteRegionBadge(location)}
                >
                  <Typography.P2>{location}</Typography.P2>
                </BadgeButton.Fill>
              ))}
            </Container.FlexRow>
            <DistrictSelector onSelectRegion={onClickSelectFinish} />
          </Container.FlexCol>
          <Divider.Col className="border-t-0" />
          <Container.FlexCol className="gap-y-7">
            <Typography.SubTitle2>기간</Typography.SubTitle2>
            <Container.FlexRow className="flex-wrap gap-2">
              <LabelDualInputRange
                className="w-full"
                min={0}
                max={24}
                step={1}
                setRangeValue={setTerm}
                rangeValue={term}
                labelContainerStyle="mb-5 [&>h5]:text-SubTitle3"
                category="term"
              />
            </Container.FlexRow>
          </Container.FlexCol>
          <Divider.Col className="border-t-0" />
          <Container.FlexCol className="gap-y-7">
            <Typography.SubTitle2>가격대</Typography.SubTitle2>
            <Container.FlexRow className="flex-wrap gap-y-[3.25rem]">
              <LabelDualInputRange
                label="보증금"
                className="w-full"
                min={0}
                max={10000}
                step={100}
                setRangeValue={setDepositPrice}
                rangeValue={depositPrice}
                category="price"
                labelContainerStyle="mb-5 [&>h5]:text-SubTitle3"
              />

              <LabelDualInputRange
                label="월세"
                className="w-full"
                min={0}
                max={500}
                step={10}
                setRangeValue={setMonthlyPrice}
                rangeValue={monthlyPrice}
                category="price"
                labelContainerStyle="mb-5 [&>h5]:text-SubTitle3"
              />
            </Container.FlexRow>
          </Container.FlexCol>
          <Divider.Col className="border-t-0" />
          <Container.FlexCol className="gap-y-7">
            <Typography.SubTitle2>인원</Typography.SubTitle2>
            <Container.FlexRow className="flex-wrap gap-2">
              {mateNumberDisplayData.map(({ displayValue, stateValue }) => (
                <Button.Outline
                  key={displayValue}
                  className="gap-x-2 rounded-[1.5625rem] px-4"
                >
                  <Icon type={mateNumInfo[stateValue as 0 | 1 | 2 | 3].icon} />
                  <Typography.P2 className="py-2.5 text-brown">
                    {displayValue}
                  </Typography.P2>
                </Button.Outline>
              ))}
            </Container.FlexRow>
          </Container.FlexCol>
          <Divider.Col className="border-t-0" />
          <Container.FlexCol className="gap-y-7">
            <Typography.SubTitle2>성별</Typography.SubTitle2>
            <Container.FlexRow className="flex-wrap gap-2">
              {genderDisplayData.map(({ displayValue, stateValue }) => (
                <Button.Outline
                  key={displayValue}
                  className="gap-x-2 rounded-[1.5625rem] px-4"
                >
                  <Icon type={genderInfo[stateValue as 0 | 1 | 2].icon} />
                  <Typography.P2 className="py-2.5 text-brown">
                    {displayValue}
                  </Typography.P2>
                </Button.Outline>
              ))}
            </Container.FlexRow>
          </Container.FlexCol>
        </Container.FlexCol>
        <Container.FlexRow className="sticky bottom-0 rounded-xl bg-bg p-6">
          <Button.Fill
            type="submit"
            className="w-full items-center justify-center rounded-[0.5rem] px-9 py-[1.125rem] text-white"
          >
            <Typography.P3 className="font-semibold">필터 적용</Typography.P3>
          </Button.Fill>
        </Container.FlexRow>
      </Container.FlexCol>
    </ModalBackdrop>
  ) : null;
}
export default HouseListFilterModal;
