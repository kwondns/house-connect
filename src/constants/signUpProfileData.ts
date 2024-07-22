import { IconType } from '@/types/icon.type';
import { SignUpProfileFormType } from '@/types/signUp.type';

const stepDisplayData = [
  {
    stepTitle: '내가 찾는 집',
    stepNum: 1,
    stepContents: [
      {
        labelName: '집 유형, 매물 종류',
        carouselCurrentStep: 0,
      },
      {
        labelName: '위치, 기간',
        carouselCurrentStep: 1,
      },
      {
        labelName: '가격대',
        carouselCurrentStep: 2,
      },
    ],
  },
  {
    stepTitle: '나의 라이프스타일',
    stepNum: 2,
    stepContents: [
      {
        labelName: '흡연, 반려동물',
        carouselCurrentStep: 3,
      },
      {
        labelName: '나의 라이프스타일 어필',
        carouselCurrentStep: 4,
      },
    ],
  },
  {
    stepTitle: '내가 원하는 룸메이트',
    stepNum: 3,
    stepContents: [
      {
        labelName: '성별, 인원 수',
        carouselCurrentStep: 5,
      },
      {
        labelName: '원하는 라이프스타일 어필',
        carouselCurrentStep: 6,
      },
    ],
  },
];

const houseTypeDisplayData: {
  displayValue: string;
  stateValue: SignUpProfileFormType['type'];
  iconType: IconType;
}[] = [
  {
    displayValue: '원룸/오피스텔',
    stateValue: 0,
    iconType: 'studio-officetel',
  },
  {
    displayValue: '빌라/연립',
    stateValue: 1,
    iconType: 'villa-townhouse',
  },
  {
    displayValue: '아파트',
    stateValue: 2,
    iconType: 'apartment',
  },
  {
    displayValue: '단독주택',
    stateValue: 3,
    iconType: 'single-family-house',
  },
];

const rentalTypeDisplayData: {
  displayValue: string;
  stateValue: SignUpProfileFormType['rental_type'];
  iconType: IconType;
}[] = [
  {
    displayValue: '월세',
    stateValue: 1,
    iconType: 'monthly-rental-price',
  },
  {
    displayValue: '반전세',
    stateValue: 2,
    iconType: 'semi-monthly-rental-price',
  },
  {
    displayValue: '전세',
    stateValue: 3,
    iconType: 'year-rental-price',
  },
  {
    displayValue: '상관없음',
    stateValue: 0,
    iconType: 'dont-mind-rental-price',
  },
];

const smokeDisplayData: {
  displayValue: string;
  stateValue: SignUpProfileFormType['smoking'];
  iconType: IconType;
}[] = [
  {
    displayValue: '흡연자',
    stateValue: true,
    iconType: 'smoke',
  },
  {
    displayValue: '비흡연자',
    stateValue: false,
    iconType: 'none-smoke',
  },
];

const petDisplayData: {
  displayValue: string;
  stateValue: SignUpProfileFormType['pet'];
  iconType: IconType;
}[] = [
  {
    displayValue: '반려동물 키워요',
    stateValue: 1,
    iconType: 'pet-lover',
  },
  {
    displayValue: '반려동물 NO',
    stateValue: 2,
    iconType: 'none-pet-lover',
  },
  {
    displayValue: '상관없어요',
    stateValue: 0,
    iconType: 'dont-mind-pet',
  },
];

const genderDisplayData: {
  displayValue: string;
  stateValue: SignUpProfileFormType['gender'];
  iconType: IconType;
}[] = [
  {
    displayValue: '남성',
    stateValue: 1,
    iconType: 'male',
  },
  {
    displayValue: '여성',
    stateValue: 2,
    iconType: 'female',
  },
  {
    displayValue: '상관없어요',
    stateValue: 0,
    iconType: 'dont-mind-sex',
  },
];

const mateNumberDisplayData: {
  displayValue: string;
  stateValue: SignUpProfileFormType['mates_number'];
  iconType: IconType;
}[] = [
  {
    displayValue: '1명',
    stateValue: 1,
    iconType: 'one-person',
  },
  {
    displayValue: '2명',
    stateValue: 2,
    iconType: 'two-people',
  },
  {
    displayValue: '3명 이상',
    stateValue: 3,
    iconType: 'three-people',
  },
  {
    displayValue: '상관없어요',
    stateValue: 0,
    iconType: 'dont-mind-people',
  },
];

const signUpProfileValidationConfig = {
  0: {
    fields: ['type', 'rental_type'],
  },
  1: {
    fields: ['regions'],
  },
  3: {
    fields: ['smoking', 'pet'],
  },
  4: {
    fields: ['appeals'],
  },
  5: {
    fields: ['gender', 'mates_number'],
  },
  6: {
    fields: ['mate_appeals'],
  },
} as const;

export const signUpProfileBadgeExamples = [
  '외향적',
  '내향적',
  '야행성',
  '직장인이에요',
  '학생이에요',
  '청소 잘 해요',
  '친구초대 안 해요',
  '요리 잘 해요',
  '혼밥 싫어요',
  '더위 잘 타요',
  '추위 잘 타요',
];

export type ValidationConfig = typeof signUpProfileValidationConfig;
export type ValidationStep = keyof ValidationConfig;

export {
  stepDisplayData,
  houseTypeDisplayData,
  rentalTypeDisplayData,
  smokeDisplayData,
  petDisplayData,
  genderDisplayData,
  mateNumberDisplayData,
  signUpProfileValidationConfig,
};
