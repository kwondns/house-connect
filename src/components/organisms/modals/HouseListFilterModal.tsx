import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import Icon from '@/components/atoms/Icon';
import { genderInfo, mateNumInfo } from '@/constants/profileDetailInfo';
import { HouseListForm, HouseListType } from '@/types/house.type';
import HouseListFilterAtomState from '@/stores/houseList.store';
import FormItem from '@/components/molecules/FormItem';
import { InputRangeState } from '@/components/molecules/DualInputRange';

function HouseListFilterModal() {
  const { isOpen } = useRecoilValue(HouseListFilterAtom);
  const form = useForm<HouseListType>({
    resolver: zodResolver(HouseListForm),
    defaultValues: {
      house_type: undefined,
      rental_type: undefined,
      term: undefined,
      deposit_price: undefined,
      monthly_rental_price: undefined,
      regions: undefined,
      mate_number: 0,
      mate_gender: 0,
    },
  });
  const formData = form.watch();
  const { closeModal: closeHouseListFilterModal } = useModal('HouseListFilter');

  const setDistrictState = useSetRecoilState<SelectorStateType<'시, 구'>>(
    MoleculeSelectorState('시, 구'),
  );
  const [term, setTerm] = useState<InputRangeState>([0, 25]);
  const [depositPrice, setDepositPrice] = useState<[number, number]>([
    0, 10100,
  ]);
  const [monthlyPrice, setMonthlyPrice] = useState<[number, number]>([0, 510]);

  const onClickSelectFinish = (
    region: SelectorItemValueType<'지역'>,
    district: SelectorItemValueType<'시, 구'>,
  ) => {
    const prevRegions = form.watch('regions');

    if (prevRegions?.includes(`${region} ${district}`)) {
      createToast('duplicatedRegion', '중복된 지역을 선택하셨습니다.', {
        type: 'error',
        isLoading: false,
        containerId: 'signUpProfileToastContainer',
        autoClose: 1000,
      });
    }
    if (prevRegions && prevRegions?.length >= 3) {
      createToast('maxRegionLimit', '최대 3개의 지역까지 선택 가능합니다.', {
        type: 'warning',
        isLoading: false,
        containerId: 'signUpProfileToastContainer',
        autoClose: 1000,
      });
    }

    setDistrictState({ value: '시, 구', isOpen: false });
    form.setValue(
      'regions',
      prevRegions
        ? [...prevRegions, `${region} ${district}`]
        : [`${region} ${district}`],
    );
  };

  const onClickDeleteRegionBadge = (
    value: `${SelectorItemValueType<'지역'>} ${SelectorItemValueType<'시, 구'>}`,
  ) => {
    const prevRegions = form.getValues('regions');
    form.setValue(
      'regions',
      prevRegions?.length !== 1
        ? prevRegions?.filter(location => location !== value)
        : undefined,
    );
  };

  const [updateListFilter, setUpdateListFilter] = useRecoilState(
    HouseListFilterAtomState,
  );

  const onSubmitUpdateHouseList = (data: HouseListType) => {
    setUpdateListFilter(data);
    closeHouseListFilterModal();
  };
  useEffect(() => {
    if (!isOpen) {
      form.setValue('house_type', updateListFilter.house_type);
      form.setValue('rental_type', updateListFilter.rental_type);
      form.setValue('term', updateListFilter.term);
      if (updateListFilter.term === undefined) {
        setTerm([0, 25]);
      }
      form.setValue('deposit_price', updateListFilter.deposit_price);
      if (updateListFilter.deposit_price === undefined) {
        setDepositPrice([0, 10100]);
      }
      form.setValue(
        'monthly_rental_price',
        updateListFilter.monthly_rental_price,
      );
      if (updateListFilter.monthly_rental_price === undefined) {
        setMonthlyPrice([0, 510]);
      }
      form.setValue('regions', updateListFilter.regions);
      form.setValue('mate_gender', updateListFilter.mate_gender);
      form.setValue('mate_number', updateListFilter.mate_number);
    }
  }, [isOpen, updateListFilter]);

  return isOpen ? (
    <ModalBackdrop modalType="HouseListFilter">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitUpdateHouseList)}>
          <Container.FlexCol className="max-h-[49.25rem] w-full max-w-[42.25rem] rounded-xl bg-bg text-brown">
            <Container.FlexRow className="sticky items-center justify-between px-8 py-6">
              <Typography.SubTitle1>필터</Typography.SubTitle1>
              <IconButton.Ghost
                iconType="close"
                iconClassName="size-5"
                className="size-8 items-center justify-center"
                onClick={() => {
                  closeHouseListFilterModal();
                }}
              />
            </Container.FlexRow>
            <Divider.Col className="border-t-0" />
            <Container.FlexCol className="gap-y-10 overflow-y-scroll p-8">
              <Container.FlexCol className="gap-y-7">
                <Typography.SubTitle2>집 유형</Typography.SubTitle2>
                <Container.FlexCol className="gap-y-4">
                  <Container.FlexRow className="flex-wrap gap-x-2">
                    {houseTypeDisplayData.map(
                      ({ displayValue, stateValue }) => (
                        <Button.Outline
                          key={displayValue}
                          className="rounded-[1.875rem] px-5 py-[0.625rem]"
                          onClick={() =>
                            form.setValue(
                              'house_type',
                              stateValue === formData.house_type
                                ? undefined
                                : stateValue,
                            )
                          }
                          isActive={stateValue === formData.house_type}
                        >
                          <Typography.P2>{displayValue}</Typography.P2>
                        </Button.Outline>
                      ),
                    )}
                  </Container.FlexRow>
                  <Container.FlexRow className="flex-wrap gap-x-2">
                    {rentalTypeDisplayData.map(
                      ({ displayValue, stateValue }) => (
                        <Button.Outline
                          key={displayValue}
                          className="rounded-[1.875rem] px-5 py-[0.625rem]"
                          onClick={() =>
                            form.setValue(
                              'rental_type',
                              stateValue === formData.rental_type
                                ? undefined
                                : stateValue,
                            )
                          }
                          isActive={stateValue === formData.rental_type}
                        >
                          <Typography.P2>{displayValue}</Typography.P2>
                        </Button.Outline>
                      ),
                    )}
                  </Container.FlexRow>
                </Container.FlexCol>
              </Container.FlexCol>
              <Divider.Col className="border-t-0" />
              <Container.FlexCol className="gap-y-7">
                <Typography.SubTitle2>위치</Typography.SubTitle2>
                <Container.FlexRow className="flex-wrap gap-2">
                  {formData.regions?.map(location => (
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
                    setRangeValue={
                      setTerm as Dispatch<SetStateAction<InputRangeState>>
                    }
                    rangeValue={term}
                    labelContainerStyle="mb-5 [&>h5]:text-SubTitle3"
                    category="term"
                  />
                  <FormItem.Hidden<Pick<HouseListType, 'term'>>
                    name="term"
                    valueProp={term}
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
                  <FormItem.Hidden<Pick<HouseListType, 'deposit_price'>>
                    name="deposit_price"
                    valueProp={depositPrice}
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
                  <FormItem.Hidden<Pick<HouseListType, 'monthly_rental_price'>>
                    name="monthly_rental_price"
                    valueProp={monthlyPrice}
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
                      onClick={() =>
                        form.setValue(
                          'mate_number',
                          stateValue === formData.mate_number
                            ? undefined
                            : stateValue,
                        )
                      }
                      isActive={stateValue === formData.mate_number}
                    >
                      <Icon
                        type={mateNumInfo[stateValue as 0 | 1 | 2 | 3].icon}
                      />
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
                      onClick={() =>
                        form.setValue(
                          'mate_gender',
                          stateValue === formData.mate_gender
                            ? undefined
                            : stateValue,
                        )
                      }
                      isActive={stateValue === formData.mate_gender}
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
                <Typography.P3 className="font-semibold">
                  필터 적용
                </Typography.P3>
              </Button.Fill>
            </Container.FlexRow>
          </Container.FlexCol>
        </form>
      </FormProvider>
    </ModalBackdrop>
  ) : null;
}
export default HouseListFilterModal;
