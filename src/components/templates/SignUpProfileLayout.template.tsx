/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Children, ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import Container from '@/components/atoms/Container';
import IconButton from '@/components/molecules/IconButton';
import Typography from '@/components/atoms/Typography';
import Carousel from '@/components/organisms/Carousel';
import StepNavLinks from '@/components/molecules/StepNavLinks';
import cn from '@/libs/cn';
import Button from '@/components/atoms/Button';
import {
  signUpProfileValidationConfig,
  stepDisplayData,
  ValidationStep,
} from '@/constants/signUpProfileData';
import { SignUpProfileFormType } from '@/types/signUp.type';
import { createToast } from '@/libs/toast';

type StepTitleType = {
  num: string | number;
  title: string;
  isActive?: boolean;
};

function StepTitle({ num, title, isActive }: StepTitleType) {
  return (
    <Container.FlexRow className="mb-3 items-center gap-3">
      <div
        className={cn(
          'size-9 rounded-full flex justify-center items-center',
          isActive ? 'bg-brown' : 'bg-brown2',
        )}
      >
        <span className="translate-x-[1px] translate-y-[-1px] text-lg font-semibold text-bg">
          {num}
        </span>
      </div>
      <Typography.SubTitle3
        className={cn('font-semibold', isActive ? 'text-brown' : 'text-brown2')}
      >
        {title}
      </Typography.SubTitle3>
    </Container.FlexRow>
  );
}

StepTitle.defaultProps = {
  isActive: false,
};

type SignProfileLayoutTemplateProps = {
  children: ReactNode;
  isSubmitted: boolean;
};

export default function SignUpProfileLayoutTemplate(
  props: Readonly<SignProfileLayoutTemplateProps>,
) {
  const { children, isSubmitted } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [passedPage, setPassedPage] = useState<number[]>([]);
  const navigate = useNavigate();
  const numsOfCarouselChildren = Children.count(children);
  const [isFirstOfCarousel, isLastOfCarousel] = [
    currentStep === 0,
    currentStep === numsOfCarouselChildren - 1,
  ];
  const isInitialRendered = useRef<boolean>(true);
  const {
    trigger,
    formState: { errors },
  } = useFormContext<SignUpProfileFormType>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    trigger();
  }, []);

  const validationStep = async (carouselStep: ValidationStep) => {
    const validationConfig = signUpProfileValidationConfig[carouselStep];

    if (!validationConfig) return true;

    const { fields } = validationConfig;
    const isStepValid = await trigger(fields);

    if (!isStepValid) {
      fields.forEach(field => {
        const message = errors[field]?.message;
        if (message) {
          createToast(`${field}ValidationError`, message, {
            containerId: 'signUpProfileToastContainer',
            autoClose: 1000,
            isLoading: false,
            type: 'error',
          });
        }
      });
      return false;
    }
    return true;
  };

  const onClickPrevButton = () => {
    if (isFirstOfCarousel) navigate('/signup-intro');
    else setCurrentStep(prev => prev - 1);
  };

  const onClickNextButton = async () => {
    const canGoNextCarousel = await validationStep(
      currentStep as ValidationStep,
    );

    if (canGoNextCarousel) {
      setCurrentStep(prev => prev + 1);
      setPassedPage(prev => [...new Set([...prev, currentStep])]);
    }
  };

  // * persist carousel state(currentStep) with session Storage
  useEffect(() => {
    const carouselStepKey = 'carouselStep';
    const carouselStep = sessionStorage.getItem(carouselStepKey);

    if (isInitialRendered.current) {
      isInitialRendered.current = false;

      if (carouselStep) {
        const stepNumber = JSON.parse(carouselStep);
        setCurrentStep(stepNumber);
        setPassedPage(
          Array.from({ length: stepNumber + 1 }, (_, i) => stepNumber - i),
        );
      }
    } else {
      sessionStorage.setItem(carouselStepKey, JSON.stringify(currentStep));
    }
  }, [currentStep]);

  const onClickstepNavLinkValidate = async (step: ValidationStep) =>
    passedPage.includes(step) ? setCurrentStep(step) : null;

  return (
    <Container.FlexRow className="min-h-[51rem] w-full justify-between gap-[3.75rem]">
      <Container.FlexCol className="min-w-[13rem] screen1140:hidden">
        {stepDisplayData.map(({ stepTitle, stepNum, stepContents }) => (
          <Container.FlexCol key={stepTitle} className="mb-12">
            <StepTitle
              num={stepNum}
              isActive={stepContents.some(
                content => content.carouselCurrentStep === currentStep,
              )}
              title={stepTitle}
            />
            <StepNavLinks
              className="pl-[14px]"
              contents={stepContents.map(stepContent => ({
                ...stepContent,
                isActive: currentStep === stepContent.carouselCurrentStep,
                onClick: () =>
                  onClickstepNavLinkValidate(
                    stepContent.carouselCurrentStep as ValidationStep,
                  ),
              }))}
            />
          </Container.FlexCol>
        ))}
      </Container.FlexCol>
      <Container.FlexCol className="w-full max-w-[55.875rem]">
        <Carousel order={currentStep}>{children}</Carousel>
        <Container.FlexRow className="mt-[6.25rem] justify-end gap-x-3 pb-[76px]">
          <IconButton.Outline
            className="flex-row-reverse gap-x-[10px] rounded-[32px] px-[30px] py-[15px]"
            iconType="left-arrow"
            disabled={isSubmitted}
            onClick={onClickPrevButton}
          >
            <Typography.P1 className="text-brown">이전</Typography.P1>
          </IconButton.Outline>
          {isLastOfCarousel ? (
            <Button.Fill
              className="gap-x-[10px] rounded-[32px] px-12 py-[15px]"
              type="submit"
              disabled={isSubmitted}
            >
              <Typography.P1 className="text-bg">완료</Typography.P1>
            </Button.Fill>
          ) : (
            <IconButton.Fill
              className="gap-x-[10px] rounded-[32px] px-[30px] py-[15px]"
              iconType="right-arrow"
              stroke="bg"
              onClick={onClickNextButton}
              type="button"
            >
              <Typography.P1 className="text-bg">다음</Typography.P1>
            </IconButton.Fill>
          )}
        </Container.FlexRow>
      </Container.FlexCol>
    </Container.FlexRow>
  );
}
