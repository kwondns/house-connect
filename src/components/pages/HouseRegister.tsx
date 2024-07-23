import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';

import { HouseForm, HouseFormType } from '@/types/house.type';
import { SessionAtom } from '@/stores/auth.store';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import Carousel from '@/components/organisms/Carousel';
import HouseRegisterTemplate1 from '@/components/templates/HouseRegisterTemplate1';
import HouseRegisterTemplates2 from '@/components/templates/HouseRegisterTemplates2';
import Button from '@/components/atoms/Button';
import { fetchData, useHouseRegist } from '@/hooks/useHouse';
import { SignUpProfileFormType } from '@/types/signUp.type';
import { InputRangeState } from '@/components/molecules/DualInputRange';

export type UserLifeStyleType = {
  smoking: SignUpProfileFormType['smoking'];
  pet: SignUpProfileFormType['pet'];
  appeals: SignUpProfileFormType['appeals'];
};

export type UserMateStyleType = {
  mate_gender: SignUpProfileFormType['gender'];
  mates_num: SignUpProfileFormType['mates_number'];
  mate_appeal: SignUpProfileFormType['mate_appeals'];
  prefer_mate_age: InputRangeState;
};

export default function HouseRegister() {
  const navigate = useNavigate();
  const Form = FormProvider;
  const userId = useRecoilState(SessionAtom)[0]?.user.id;
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<HouseFormType & UserLifeStyleType & UserMateStyleType>({
    resolver: zodResolver(HouseForm),
    mode: 'onChange',
    reValidateMode: 'onSubmit',
    defaultValues: {
      house_img: [],
      representative_img: '',
      post_title: '',
      region: '',
      district: '',
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
      mates_num: 1,
      mate_appeal: [],
      prefer_mate_age: [0, 30],
    },
  });

  const handlePrevCarousel = () => {
    setCurrentStep(prev => prev - 1);
  };

  const [locationError, setLocationError] = useState(false);

  const handleNextCarousel = async () => {
    const isValid = await form.trigger();
    setCurrentStep(prev => prev + 1);

    if (isValid) {
      setCurrentStep(prev => prev + 1);
      setLocationError(false);
      sessionStorage.setItem('houseRegister', JSON.stringify(form.getValues()));
    } else if (
      !isValid &&
      (form.getValues('region') === '지역' ||
        form.getValues('district') === '시, 구')
    ) {
      setLocationError(true);
    }
  };

  const { registHouse, isRegistHouse } = useHouseRegist();
  const onSaveHouse = async (formData: HouseFormType, temporary: 0 | 1) => {
    console.log(formData);
    // const representativeImgName = representativeImg.split('/').slice(-1)[0];
    // const houseImgExcludeRep = images.filter(
    //   imgName => imgName !== representativeImgName,
    // );

    // registHouse({
    //   ...formData,
    //   temporary,
    //   region: region.value,
    //   district: district.value,
    //   house_size: Number(formData.house_size),
    //   deposit_price: Number(formData.deposit_price),
    //   monthly_price: Number(formData.monthly_price),
    //   manage_price: Number(formData.manage_price),
    //   house_img: houseImgExcludeRep,
    //   representative_img: representativeImgName,
    //   room_num: Number(formData.room_num),
    //   term,
    // });
  };

  const onSubmitHouse = (formData: HouseFormType) => {
    onSaveHouse(formData, 1);
  };

  const onSaveTemporary = () => {
    const formData = form.getValues();
    onSaveHouse(formData, 0);
  };

  const { data: userLifeStyleData, isSuccess: fetchedUserLifeStyle } = useQuery(
    {
      queryKey: ['user_lifestyle', userId],
      queryFn: () =>
        fetchData('user_lifestyle', 'smoking, pet, appeals', userId),
    },
  );

  const { data: userMateStyleData, isSuccess: fetchedUserMateStyle } = useQuery(
    {
      queryKey: ['user_mate_style', userId],
      queryFn: () =>
        fetchData(
          'user_mate_style',
          'mate_gender, mate_number, mate_appeals',
          userId,
        ),
    },
  );

  useEffect(() => {
    if (fetchedUserLifeStyle && fetchedUserMateStyle) {
      form.reset(prev => ({
        ...prev,
        smoking: userLifeStyleData?.smoking,
        pet: userLifeStyleData?.pet,
        appeals: userLifeStyleData?.appeals,
        mate_gender: userMateStyleData?.mate_gender,
        mates_num: userMateStyleData?.mate_number,
        mate_appeal: userMateStyleData?.mate_appeals,
      }));
    }
  }, [
    fetchedUserLifeStyle,
    fetchedUserMateStyle,
    form,
    userLifeStyleData,
    userMateStyleData,
  ]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitHouse)}
        className="min-h-screen flex-col"
      >
        <Container.FlexCol className="mt-[4rem] w-full grow">
          <Container.FlexRow className="items-center gap-4">
            <Typography.Head2 className=" text-brown">
              하우스 등록
            </Typography.Head2>
            <Typography.P1 className="text-brown1">
              {currentStep + 1}/2
            </Typography.P1>
          </Container.FlexRow>
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
        </Container.FlexCol>
        <Container.FlexCol className="w-full grow overflow-y-auto">
          <Carousel order={currentStep}>
            <HouseRegisterTemplate1
              form={form}
              locationError={locationError}
              setLocationError={setLocationError}
            />
            <HouseRegisterTemplates2 form={form} />
          </Carousel>
        </Container.FlexCol>
        <hr style={{ marginTop: '5rem', marginBottom: '2.75rem' }} />
        <Container.FlexRow className="absolute z-20 w-full justify-between">
          <div>
            <Button.Outline
              className="mr-4 flex h-[59px] w-[9.25rem] justify-center rounded-[2rem]"
              onClick={() => navigate('/')}
            >
              <Typography.P1 className="text-brown">취소</Typography.P1>
            </Button.Outline>
          </div>
          <Container.FlexRow className="mb-[16rem] gap-4">
            <Button.Outline
              className="flex h-[3.5rem] w-[9.25rem] justify-center rounded-[2rem]"
              onClick={onSaveTemporary}
              disabled={isRegistHouse}
            >
              <Typography.P1 className="text-brown">임시저장</Typography.P1>
            </Button.Outline>
            {currentStep === 0 ? (
              <Button.Fill
                className="flex h-[3.5rem] w-[9.25rem] justify-center rounded-[2rem]"
                onClick={handleNextCarousel}
                disabled={isRegistHouse}
              >
                <Typography.P1 className="text-bg">다음</Typography.P1>
              </Button.Fill>
            ) : (
              <Container.FlexRow className="gap-4">
                <Button.Outline
                  className="flex h-[3.5rem] w-[9.25rem] justify-center rounded-[2rem]"
                  onClick={handlePrevCarousel}
                >
                  <Typography.P1 className="text-brown">이전</Typography.P1>
                </Button.Outline>
                <Button.Fill
                  className="flex h-[3.5rem] w-[9.25rem] justify-center rounded-[2rem]"
                  type="submit"
                >
                  <Typography.P1 className="text-bg">완료</Typography.P1>
                </Button.Fill>
              </Container.FlexRow>
            )}
          </Container.FlexRow>
        </Container.FlexRow>
      </form>
    </Form>
  );
}
