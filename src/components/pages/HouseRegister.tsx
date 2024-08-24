import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SessionAtom } from '@/stores/auth.store';
import { HouseForm, HouseFormType } from '@/types/house.type';
import { SignUpProfileFormType } from '@/types/signUp.type';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import Carousel from '@/components/organisms/Carousel';
import HouseRegisterTemplate1 from '@/components/templates/HouseRegister/HouseRegisterTemplate1';
import HouseRegisterTemplates2 from '@/components/templates/HouseRegister/HouseRegisterTemplates2';
import Button from '@/components/atoms/Button';
import useModal from '@/hooks/useModal';
import { InputRangeState } from '@/components/molecules/DualInputRange';
import {
  fetchTemporaryHouseId,
  useDeleteHousePost,
  useFetchHouseData,
  useHouseRegist,
  useHouseUpdate,
  useFetchProfileData,
  useUserProfileUpdate,
} from '@/hooks/useHouse';

export type UserLifeStyleType = {
  smoking: SignUpProfileFormType['smoking'];
  pet: SignUpProfileFormType['pet'];
  appeals: SignUpProfileFormType['appeals'];
};

export type UserMateStyleType = {
  mate_gender: SignUpProfileFormType['mate_gender'];
  mate_number: SignUpProfileFormType['mate_number'];
  mate_appeals: SignUpProfileFormType['mate_appeals'];
  prefer_mate_age: InputRangeState;
};

export default function HouseRegister() {
  const navigate = useNavigate();
  const Form = FormProvider;
  const userId = useRecoilState(SessionAtom)[0]?.user.id as string;
  const { houseId } = useParams<{ houseId: string }>();
  const isEditMode = !!houseId;
  const [currentStep, setCurrentStep] = useState(0);
  const [locationError, setLocationError] = useState(false);

  const form = useForm<HouseFormType & UserLifeStyleType & UserMateStyleType>({
    resolver: zodResolver(HouseForm),
    mode: 'onChange',
    defaultValues: {
      house_img: [],
      representative_img: '',
      post_title: '',
      region: '지역',
      district: '시, 구',
      house_type: 0,
      rental_type: 1,
      floor: 0,
      house_size: undefined,
      room_num: undefined,
      deposit_price: undefined,
      monthly_price: undefined,
      manage_price: undefined,
      house_appeal: [],
      term: [0, 24],
      describe: undefined,
      bookmark: 0,
      temporary: 0,
      user_id: userId,
      smoking: true,
      pet: 1,
      appeals: [],
      mate_gender: 1,
      mate_number: 1,
      mate_appeals: [],
      prefer_mate_age: [0, 30],
    },
  });

  // 임시저장글 확인 & 모달
  const { setModalState, closeModal } = useModal('Continue');
  const { deleteHousePost } = useDeleteHousePost();
  useEffect(() => {
    const checkTemporaryHouse = async () => {
      if (!houseId) {
        const { id: tempHouseId } = await fetchTemporaryHouseId(userId);
        setModalState({
          isOpen: true,
          type: 'Continue',
          title: '저장된 글이 있어요!',
          message: `저장된 글을 불러와 이어서 작성할 수 있습니다.
					취소를 누르면 저장된 글은 삭제됩니다.`,
          continueButtonContent: '이어쓰기',
          cancelButtonContent: '취소',
          onClickCancel: () => {
            deleteHousePost(tempHouseId);
            closeModal();
          },
          onClickContinue: () => {
            navigate(`/house/edit/${tempHouseId}`);
            closeModal();
          },
        });
      }
    };
    checkTemporaryHouse();
  }, [userId, houseId, navigate]);

  // 사용자 프로필(user_lifestyle, user_mate_style)을 가져와 초기값을 수정
  const { userLifeStyleQuery, userMateStyleQuery } = useFetchProfileData(
    userId as string,
  );
  const { data: userLifeStyleData, isSuccess: fetchedUserLifeStyle } =
    userLifeStyleQuery;
  const { data: userMateStyleData, isSuccess: fetchedUserMateStyle } =
    userMateStyleQuery;
  // ! reset을 사용하면 undefined여야하는 입력란이 초기값인 NaN이들어가면서 placeholder가 보이지 않아서 setValue 사용
  useEffect(() => {
    if (fetchedUserLifeStyle && fetchedUserMateStyle) {
      form.setValue('smoking', userLifeStyleData.smoking);
      form.setValue('pet', userLifeStyleData.pet);
      form.setValue('appeals', userLifeStyleData.appeals);
      form.setValue('mate_gender', userMateStyleData.mate_gender);
      form.setValue('mate_number', userMateStyleData.mate_number);
      form.setValue('mate_appeals', userMateStyleData.mate_appeals);
      form.setValue('prefer_mate_age', userMateStyleData.prefer_mate_age);
    }
  }, [
    fetchedUserLifeStyle,
    fetchedUserMateStyle,
    form,
    userLifeStyleData,
    userMateStyleData,
  ]);

  // 임시저장된 글 이어쓰기 | 게시글 수정
  const { houseQuery } = useFetchHouseData(isEditMode, houseId as string);
  const { data: housePost } = houseQuery;
  useEffect(() => {
    const fetchHouseData = () => {
      if (isEditMode) {
        form.reset(prev => ({
          ...prev,
          ...housePost,
        }));
      }
    };
    fetchHouseData();
  }, [isEditMode, form, houseId, housePost]);

  const { registHouse, isRegistHouse } = useHouseRegist();
  const { updateUserProfile } = useUserProfileUpdate();
  const { updateHouse, isUpdateHouse } = useHouseUpdate();

  const onUpdateProfile = async (
    formData: HouseFormType & UserLifeStyleType & UserMateStyleType,
  ) => {
    updateUserProfile({
      dbName: 'user_lifestyle',
      data: {
        smoking: formData.smoking,
        pet: formData.pet,
        appeals: formData.appeals,
      },
      userId,
    });

    updateUserProfile({
      dbName: 'user_mate_style',
      data: {
        mate_gender: formData.mate_gender,
        mate_number: formData.mate_number,
        mate_appeals: formData.mate_appeals,
        prefer_mate_age: formData.prefer_mate_age,
      },
      userId,
    });
  };

  const onSaveHouse = async (
    formData: HouseFormType & UserLifeStyleType & UserMateStyleType,
    temporary: 0 | 1,
  ) => {
    const houseImgExcludeRep = formData.house_img.filter(
      imgName => imgName !== formData.representative_img,
    );

    // ! FormData에 user_lifeStyle, user_mate_style도 있어서 houseData만 분리해서 넘겨줘야 함.
    const houseData = {
      house_img: houseImgExcludeRep,
      representative_img: formData.representative_img,
      post_title: formData.post_title,
      region: formData.region,
      district: formData.district,
      house_type: formData.house_type,
      rental_type: formData.rental_type,
      floor: formData.floor,
      house_size: Number(formData.house_size),
      room_num: Number(formData.room_num),
      deposit_price: Number(formData.deposit_price),
      monthly_price: Number(formData.monthly_price),
      manage_price: Number(formData.manage_price),
      house_appeal: formData.house_appeal,
      term: formData.term,
      describe: formData.describe,
      bookmark: formData.bookmark,
      temporary,
      user_id: userId,
    };

    if (isEditMode) {
      updateHouse({ houseData, houseId: houseId as string });
    } else {
      registHouse(houseData);
    }

    await onUpdateProfile(formData);
  };

  const handlePrevCarousel = () => setCurrentStep(prev => prev - 1);

  const handleNextCarousel = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setLocationError(false);
    } else if (
      form.getValues('region') === '지역' ||
      form.getValues('district') === '시, 구'
    ) {
      setLocationError(true);
    }
  };

  const onSubmitHouse = (
    formData: HouseFormType & UserLifeStyleType & UserMateStyleType,
  ) => {
    onSaveHouse(formData, 1);
  };

  const onSaveTemporary = () => {
    const formData = form.getValues();
    onSaveHouse(formData, 0);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitHouse)}
        className="min-h-screen min-w-[320px] flex-col focus:scroll-auto"
      >
        <Container.FlexCol className="w-full tablet:pb-[5rem] s-tablet:flex-col-reverse">
          <Container.FlexCol className="mb-20 mt-[4rem] grow">
            <Container.FlexRow className="items-center gap-4">
              <Typography.Head2 className=" text-brown">
                하우스 등록
              </Typography.Head2>
              <Typography.P1 className="text-brown1">
                {currentStep + 1}/2
              </Typography.P1>
            </Container.FlexRow>
            <Container.FlexRow className="hidden md:block">
              {currentStep === 0 ? (
                <IconButton.Ghost
                  className="my-6"
                  iconType="front"
                  onClick={handleNextCarousel}
                />
              ) : (
                <IconButton.Ghost
                  className="my-6"
                  iconType="back"
                  onClick={handlePrevCarousel}
                />
              )}
            </Container.FlexRow>
            <Container.FlexCol className="w-full grow">
              <Carousel order={currentStep}>
                <HouseRegisterTemplate1
                  form={form}
                  userId={userId}
                  houseId={houseId as string}
                  isEditMode={isEditMode}
                  locationError={locationError}
                  setLocationError={setLocationError}
                />
                <HouseRegisterTemplates2 form={form} />
              </Carousel>
            </Container.FlexCol>
          </Container.FlexCol>
          <Container.FlexRow className="fixed bottom-[calc(100vh-12rem)] w-[93%] justify-between bg-bg tablet:sticky tablet:bottom-0 tablet:w-full tablet:border-t  tablet:border-brown tablet:pt-[2.75rem] s-tablet:pb-4">
            <Container.FlexRow>
              <IconButton.Outline
                className="rounded-[2rem] tablet:mr-4 tablet:flex tablet:h-[3.5rem] tablet:w-[9.25rem] tablet:justify-center s-tablet:border-none"
                iconType="prev"
                iconClassName="md:hidden"
                onClick={() => navigate('/')}
                disabled={isRegistHouse || isUpdateHouse}
              >
                <Typography.P1 className="hidden text-brown tablet:block">
                  취소
                </Typography.P1>
              </IconButton.Outline>
            </Container.FlexRow>
            <Container.FlexRow className="gap-4 tablet:mb-[1rem]">
              {currentStep === 0 && (
                <Button.Outline
                  className="flex justify-center rounded-[2rem] tablet:h-[3.5rem] tablet:w-[9.25rem] s-tablet:border-none s-tablet:p-2"
                  onClick={onSaveTemporary}
                  disabled={isRegistHouse || isUpdateHouse}
                >
                  <Typography.P1 className="text-brown">임시저장</Typography.P1>
                </Button.Outline>
              )}
              {currentStep === 0 ? (
                <Button.Fill
                  className="flex justify-center rounded-[2rem] tablet:h-[3.5rem] tablet:w-[9.25rem] s-tablet:bg-bg s-tablet:p-2 s-tablet:hover:bg-bg"
                  onClick={handleNextCarousel}
                  disabled={isRegistHouse || isUpdateHouse}
                >
                  <Typography.P1 className="text-brown tablet:text-bg">
                    다음
                  </Typography.P1>
                </Button.Fill>
              ) : (
                <Container.FlexRow className="gap-4">
                  <Button.Outline
                    className="flex justify-center rounded-[2rem] tablet:h-[3.5rem] tablet:w-[9.25rem] s-tablet:border-none s-tablet:p-2"
                    onClick={handlePrevCarousel}
                  >
                    <Typography.P1 className="text-brown">이전</Typography.P1>
                  </Button.Outline>
                  <Button.Fill
                    className="flex justify-center rounded-[2rem] tablet:h-[3.5rem] tablet:w-[9.25rem] s-tablet:bg-bg s-tablet:p-2 s-tablet:hover:bg-bg"
                    type="submit"
                    disabled={isRegistHouse || isUpdateHouse}
                  >
                    <Typography.P1 className="text-brown tablet:text-bg">
                      완료
                    </Typography.P1>
                  </Button.Fill>
                </Container.FlexRow>
              )}
            </Container.FlexRow>
          </Container.FlexRow>
        </Container.FlexCol>
      </form>
    </Form>
  );
}
