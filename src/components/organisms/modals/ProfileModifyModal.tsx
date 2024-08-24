import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  FieldErrors,
  FormProvider,
  SubmitErrorHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardEvent, useEffect } from 'react';

import ModalBackdrop from '@/components/organisms/modals/ModalBackdrop';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import Button from '@/components/atoms/Button';
import { ProfileModifyModalAtom } from '@/stores/globalModal.store';
import IconButton from '@/components/molecules/IconButton';
import Divider from '@/components/atoms/Divider';
import {
  genderDisplayData,
  houseTypeDisplayData,
  mateNumberDisplayData,
  petDisplayData,
  rentalTypeDisplayData,
  smokeDisplayData,
} from '@/constants/signUpProfileData';
import { SignUpProfileForm, SignUpProfileFormType } from '@/types/signUp.type';
import DistrictSelector from '@/components/organisms/districtSelector/DistrictSelector';
import BadgeButton from '@/components/molecules/BadgeButton';
import { SelectorItemValueType } from '@/types/regionDistrict.type';
import { createToast } from '@/libs/toast';
import {
  MoleculeSelectorState,
  SelectorStateType,
} from '@/components/organisms/districtSelector/selector.store';
import LabelDualInputRange from '@/components/organisms/LabelDualInputRange';
import { SignupProfileStateSelector } from '@/stores/sign.store';
import FormItem from '@/components/molecules/FormItem';
import Icon from '@/components/atoms/Icon';
import {
  genderInfo,
  mateNumInfo,
  petInfo,
  smokingInfo,
} from '@/constants/profileDetailInfo';
import BadgeButtons from '@/components/molecules/BadgeButtons';
import { useUpdateProfile } from '@/hooks/useUserInfo';
import { UserAtom } from '@/stores/auth.store';
import useModal from '@/hooks/useModal';

function ProfileModifyModal() {
  const { isOpen, userInfo } = useRecoilValue(ProfileModifyModalAtom);
  const { closeModal: closeProfileModifyModal } = useModal('ProfileModify');
  const user = useRecoilValue(UserAtom);
  const form = useForm<SignUpProfileFormType>({
    defaultValues: { ...userInfo },
    resolver: zodResolver(SignUpProfileForm),
  });
  const setDistrictState = useSetRecoilState<SelectorStateType<'시, 구'>>(
    MoleculeSelectorState('시, 구'),
  );

  const [term, setTerm] = useRecoilState(SignupProfileStateSelector('term'));
  const [depositPrice, setDepositPrice] = useRecoilState(
    SignupProfileStateSelector('deposit_price'),
  );
  const [monthlyPrice, setMonthlyPrice] = useRecoilState(
    SignupProfileStateSelector('monthly_rental_price'),
  );

  const [appeals, setAppeals] = useRecoilState(
    SignupProfileStateSelector('appeals'),
  );
  const [mateAppeals, setMateAppeals] = useRecoilState(
    SignupProfileStateSelector('mate_appeals'),
  );

  const formData = form.watch();
  useEffect(() => {
    form.setValue('type', userInfo?.type);
    form.setValue('rental_type', userInfo?.rental_type);
    form.setValue('regions', userInfo?.regions ?? []);
    form.setValue('term', userInfo?.term ?? [0, 24]);
    form.setValue('deposit_price', userInfo?.deposit_price ?? [0, 10001]);
    form.setValue(
      'monthly_rental_price',
      userInfo?.monthly_rental_price ?? [0, 501],
    );
    form.setValue('smoking', userInfo?.smoking);
    form.setValue('pet', userInfo?.pet);
    form.setValue('appeals', userInfo?.appeals ?? []);
    form.setValue('mate_gender', userInfo?.mate_gender);
    form.setValue('mate_number', userInfo?.mate_number);
    form.setValue('mate_appeals', userInfo?.mate_appeals ?? []);
    setAppeals(userInfo?.appeals as string[]);
    setMateAppeals(userInfo?.mate_appeals as string[]);
  }, [userInfo]);

  const onClickSelectFinish = (
    region: SelectorItemValueType<'지역'>,
    district: SelectorItemValueType<'시, 구'>,
  ) => {
    const prevRegions = form.watch('regions');

    if (prevRegions.includes(`${region} ${district}`)) {
      createToast('duplicatedRegion', '중복된 지역을 선택하셨습니다.', {
        type: 'error',
        isLoading: false,
        containerId: 'signUpProfileToastContainer',
        autoClose: 1000,
      });
    }
    if (prevRegions.length >= 3) {
      createToast('maxRegionLimit', '최대 3개의 지역까지 선택 가능합니다.', {
        type: 'warning',
        isLoading: false,
        containerId: 'signUpProfileToastContainer',
        autoClose: 1000,
      });
    }

    setDistrictState({ value: '시, 구', isOpen: false });
    form.setValue('regions', [...prevRegions, `${region} ${district}`]);
  };

  const onClickDeleteRegionBadge = (
    value: `${SelectorItemValueType<'지역'>} ${SelectorItemValueType<'시, 구'>}`,
  ) => {
    const prevRegions = form.getValues('regions');
    form.setValue(
      'regions',
      prevRegions.filter(location => location !== value),
    );
  };
  const createBadge = async (
    badgeContent: string,
    name: 'mateAppealsInputValue' | 'appealsInputValue',
  ) => {
    if (
      !form
        .getValues(
          name === 'mateAppealsInputValue' ? 'mate_appeals' : 'appeals',
        )
        .includes(badgeContent) &&
      badgeContent !== ''
    ) {
      form.setValue(name, '');

      if (
        form.getValues(
          name === 'mateAppealsInputValue' ? 'mate_appeals' : 'appeals',
        ).length >= 5
      ) {
        createToast('maxAppealsLimit', '최대 5개까지 작성 가능합니다.', {
          type: 'warning',
          isLoading: false,
          containerId: 'signUpProfileToastContainer',
          autoClose: 1000,
        });

        return;
      }
      if (name === 'appealsInputValue')
        setAppeals(prev => [...prev, badgeContent]);
      else setMateAppeals(prev => [...prev, badgeContent]);
    }
  };

  const deleteAppealBadge = (badgeContent: string) => {
    setAppeals(prev => prev.filter(appeal => appeal !== badgeContent));
  };
  const deleteMateAppealBadge = (badgeContent: string) => {
    setMateAppeals(prev => prev.filter(appeal => appeal !== badgeContent));
  };

  const pressEnterCreateBadge = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      const { name } = e.currentTarget;
      e.preventDefault();
      const isBadgeContentValid = await form.trigger(
        name as 'mateAppealsInputValue' | 'appealsInputValue',
      );
      if (isBadgeContentValid)
        await createBadge(
          form.watch(name as 'mateAppealsInputValue' | 'appealsInputValue'),
          name as 'mateAppealsInputValue' | 'appealsInputValue',
        );
    }
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isOpen]);

  const { updateProfile, isPending } = useUpdateProfile();

  const onSubmitUpdateProfile = (data: SignUpProfileFormType) => {
    const { mateAppealsInputValue, appealsInputValue, ...payload } = data;
    if (user) updateProfile({ id: user.id, ...payload });
  };

  const onError: SubmitErrorHandler<SignUpProfileFormType> = data => {
    Object.entries(data as FieldErrors<SignUpProfileFormType>).forEach(
      ([key, value]) => {
        if (value.message) {
          createToast(`${key}ValidationError`, value.message, {
            autoClose: 1000,
            isLoading: false,
            type: 'error',
          });
        }
      },
    );
  };

  return isOpen ? (
    <ModalBackdrop modalType="ProfileModify">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitUpdateProfile, onError)}>
          <Container.FlexCol className="max-h-[85vh] w-full max-w-[42.375rem] cursor-auto overflow-x-scroll rounded-xl bg-bg text-brown">
            <Container.FlexRow className="items-center justify-between px-8 py-6">
              <Typography.SubTitle1>내 프로필 카드 수정</Typography.SubTitle1>
              <IconButton.Ghost
                onClick={() => closeProfileModifyModal()}
                iconType="close"
                iconClassName="size-5"
                className="size-8 items-center justify-center"
                disabled={isPending}
              />
            </Container.FlexRow>
            <Divider.Col className="border-t-0" />
            <Container.FlexCol className="gap-y-10 p-8">
              <Container.FlexCol className="gap-y-7">
                <Typography.P1>Step 1</Typography.P1>
                <Typography.Head2>내가 찾는 집은...</Typography.Head2>
              </Container.FlexCol>
              <Container.FlexCol className="gap-y-8">
                <Container.FlexCol className="gap-y-7">
                  <Typography.SubTitle2>집 유형</Typography.SubTitle2>
                  <Container.FlexCol className="gap-y-4">
                    <Container.FlexRow className="flex-wrap gap-x-2">
                      {houseTypeDisplayData.map(
                        ({ displayValue, stateValue }) => (
                          <Button.Outline
                            key={displayValue}
                            className="rounded-[1.5625rem] px-5 py-[0.625rem]"
                            isActive={stateValue === formData.type}
                            onClick={() => form.setValue('type', stateValue)}
                            disabled={isPending}
                          >
                            <Typography.P2 className="text-brown">
                              {displayValue}
                            </Typography.P2>
                          </Button.Outline>
                        ),
                      )}
                    </Container.FlexRow>
                    <Container.FlexRow className="flex-wrap gap-x-2">
                      {rentalTypeDisplayData.map(
                        ({ displayValue, stateValue }) => (
                          <Button.Outline
                            key={displayValue}
                            className="rounded-[1.5625rem] px-5 py-[0.625rem]"
                            isActive={stateValue === formData.rental_type}
                            onClick={() =>
                              form.setValue('rental_type', stateValue)
                            }
                            disabled={isPending}
                          >
                            <Typography.P2 className="text-brown">
                              {displayValue}
                            </Typography.P2>
                          </Button.Outline>
                        ),
                      )}
                    </Container.FlexRow>
                  </Container.FlexCol>
                </Container.FlexCol>
              </Container.FlexCol>
              <Divider.Col className="border-t-0" />
              <Container.FlexCol className="gap-y-7">
                <Typography.SubTitle2>위치</Typography.SubTitle2>
                <Container.FlexRow className="mt-7 flex-wrap gap-2">
                  {formData.regions?.map(location => (
                    <BadgeButton.Fill
                      key={location}
                      className="gap-x-3 rounded-[1.875rem] px-4 py-[0.75rem] text-bg tablet:gap-x-3 [&_p]:translate-y-[-0.0625rem]"
                      iconType="close"
                      stroke="bg"
                      onClick={() => onClickDeleteRegionBadge(location)}
                      disabled={isPending}
                    >
                      <Typography.P2>{location}</Typography.P2>
                    </BadgeButton.Fill>
                  ))}
                </Container.FlexRow>
                <DistrictSelector onSelectRegion={onClickSelectFinish} />
              </Container.FlexCol>
              <Divider.Col />
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
                  <FormItem.Hidden<Pick<SignUpProfileFormType, 'term'>>
                    name="term"
                    valueProp={term}
                  />
                </Container.FlexRow>
              </Container.FlexCol>
              <Divider.Col />
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

                  <FormItem.Hidden<Pick<SignUpProfileFormType, 'deposit_price'>>
                    name="deposit_price"
                    valueProp={term}
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
                  <FormItem.Hidden<
                    Pick<SignUpProfileFormType, 'monthly_rental_price'>
                  >
                    name="monthly_rental_price"
                    valueProp={monthlyPrice}
                  />
                </Container.FlexRow>
              </Container.FlexCol>
              <Divider.Col />
              <Container.FlexCol className="gap-y-7">
                <Typography.P1>Step 2</Typography.P1>
                <Typography.Head2>나의 라이프스타일은...</Typography.Head2>
              </Container.FlexCol>
              <Container.FlexCol className="gap-y-8">
                <Container.FlexCol className="gap-y-7">
                  <Typography.SubTitle2>흡연 여부</Typography.SubTitle2>
                  <Container.FlexRow className="flex-wrap gap-2">
                    {smokeDisplayData.map(({ displayValue, stateValue }) => (
                      <Button.Outline
                        key={displayValue}
                        className="gap-x-2 rounded-[1.5625rem] px-4"
                        isActive={stateValue === formData.smoking}
                        onClick={() => form.setValue('smoking', stateValue)}
                        disabled={isPending}
                      >
                        <Icon
                          type={
                            smokingInfo[
                              JSON.stringify(stateValue) as 'true' | 'false'
                            ].icon
                          }
                        />
                        <Typography.P2 className="py-2.5 text-brown">
                          {displayValue}
                        </Typography.P2>
                      </Button.Outline>
                    ))}
                  </Container.FlexRow>
                </Container.FlexCol>
                <Divider.Col />
                <Container.FlexCol className="gap-y-7">
                  <Typography.SubTitle2>반려동물</Typography.SubTitle2>
                  <Container.FlexRow className="flex-wrap gap-2">
                    {petDisplayData.map(({ displayValue, stateValue }) => (
                      <Button.Outline
                        key={displayValue}
                        className="gap-x-2 rounded-[1.5625rem] px-4"
                        isActive={stateValue === formData.pet}
                        onClick={() => form.setValue('pet', stateValue)}
                        disabled={isPending}
                      >
                        <Icon type={petInfo[stateValue as 0 | 1 | 2].icon} />
                        <Typography.P2 className="py-2.5 text-brown">
                          {displayValue}
                        </Typography.P2>
                      </Button.Outline>
                    ))}
                  </Container.FlexRow>
                </Container.FlexCol>
                <Divider.Col />
                <Container.FlexCol className="gap-y-5">
                  <Typography.SubTitle2>나의 라이프스타일</Typography.SubTitle2>
                  <Container.FlexCol>
                    <Container.FlexRow className="flex-wrap gap-2">
                      <BadgeButtons
                        contents={appeals ?? []}
                        className="flex flex-wrap gap-x-2 gap-y-3 [&_p]:translate-y-[-0.0625rem]"
                        badgeStyle="gap-x-3 rounded-[1.875rem] py-[0.75rem] px-4"
                        stroke="bg"
                        iconType="close"
                        typoStyle="text-bg"
                        typoType="P2"
                        onClick={deleteAppealBadge}
                      />
                    </Container.FlexRow>
                    <FormItem.TextField<
                      Pick<SignUpProfileFormType, 'appealsInputValue'>
                    >
                      placeholder="ex) 늦게 자요, 청소 자주해요, 코골이 해요"
                      type="text"
                      name="appealsInputValue"
                      onKeyDown={pressEnterCreateBadge}
                      inputStyle="w-full"
                      containerStyle="mb-3 max-w-[30.375rem]"
                      disabled={isPending}
                    />
                    <FormItem.Hidden<Pick<SignUpProfileFormType, 'appeals'>>
                      name="appeals"
                      valueProp={appeals}
                    />
                  </Container.FlexCol>
                </Container.FlexCol>
              </Container.FlexCol>
              <Divider.Col />
              <Container.FlexCol className="gap-y-7">
                <Typography.P1>Step 3</Typography.P1>
                <Typography.Head2>내가 원하는 룸메이트는...</Typography.Head2>
              </Container.FlexCol>
              <Container.FlexCol className="gap-y-8">
                <Container.FlexCol className="gap-y-7">
                  <Typography.SubTitle2>성별</Typography.SubTitle2>
                  <Container.FlexRow className="flex-wrap gap-2">
                    {genderDisplayData.map(({ displayValue, stateValue }) => (
                      <Button.Outline
                        key={displayValue}
                        className="gap-x-2 rounded-[1.5625rem] px-4"
                        isActive={stateValue === formData.mate_gender}
                        onClick={() => form.setValue('mate_gender', stateValue)}
                        disabled={isPending}
                      >
                        <Icon type={genderInfo[stateValue as 0 | 1 | 2].icon} />
                        <Typography.P2 className="py-2.5 text-brown">
                          {displayValue}
                        </Typography.P2>
                      </Button.Outline>
                    ))}
                  </Container.FlexRow>
                </Container.FlexCol>
                <Divider.Col />
                <Container.FlexCol className="gap-y-7">
                  <Typography.SubTitle2>인원</Typography.SubTitle2>
                  <Container.FlexRow className="flex-wrap gap-2">
                    {mateNumberDisplayData.map(
                      ({ displayValue, stateValue }) => (
                        <Button.Outline
                          key={displayValue}
                          className="gap-x-2 rounded-[1.5625rem] px-4"
                          isActive={stateValue === formData.mate_number}
                          onClick={() =>
                            form.setValue('mate_number', stateValue)
                          }
                          disabled={isPending}
                        >
                          <Icon
                            type={mateNumInfo[stateValue as 0 | 1 | 2 | 3].icon}
                          />
                          <Typography.P2 className="py-2.5 text-brown">
                            {displayValue}
                          </Typography.P2>
                        </Button.Outline>
                      ),
                    )}
                  </Container.FlexRow>
                </Container.FlexCol>
                <Divider.Col />
                <Container.FlexCol className="gap-y-5">
                  <Typography.SubTitle2>
                    원하는 라이프스타일
                  </Typography.SubTitle2>
                  <Container.FlexCol>
                    <Container.FlexRow className="flex-wrap gap-2">
                      <BadgeButtons
                        contents={mateAppeals ?? []}
                        className="flex flex-wrap gap-x-2 gap-y-3 [&_p]:translate-y-[-0.0625rem]"
                        badgeStyle="gap-x-3 rounded-[1.875rem] py-[0.75rem] px-4"
                        stroke="bg"
                        iconType="close"
                        typoStyle="text-bg"
                        typoType="P2"
                        onClick={deleteMateAppealBadge}
                      />
                    </Container.FlexRow>
                    <FormItem.TextField<
                      Pick<SignUpProfileFormType, 'mateAppealsInputValue'>
                    >
                      placeholder="ex) 늦게 자요, 청소 자주해요, 코골이 해요"
                      type="text"
                      name="mateAppealsInputValue"
                      onKeyDown={pressEnterCreateBadge}
                      inputStyle="w-full"
                      containerStyle="mb-3 max-w-[30.375rem]"
                      disabled={isPending}
                    />
                    <FormItem.Hidden<
                      Pick<SignUpProfileFormType, 'mate_appeals'>
                    >
                      name="mate_appeals"
                      valueProp={mateAppeals}
                    />
                  </Container.FlexCol>
                </Container.FlexCol>
              </Container.FlexCol>
            </Container.FlexCol>
            <Container.FlexRow className="p-8">
              <Button.Fill
                type="submit"
                className="w-full items-center justify-center rounded-[0.5rem] px-9 py-[1.125rem] text-white"
                disabled={isPending}
              >
                <Typography.P3 className="font-semibold">완료</Typography.P3>
              </Button.Fill>
            </Container.FlexRow>
          </Container.FlexCol>
        </form>
      </FormProvider>
    </ModalBackdrop>
  ) : null;
}

export default ProfileModifyModal;
