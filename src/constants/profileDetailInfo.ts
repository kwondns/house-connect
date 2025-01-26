export const rentalTypesInfo = {
  0: '상관없음',
  1: '월세',
  2: '전세',
  3: '반전세',
} as const;

export const floorInfo = {
  0: '지하',
  1: '반지하',
  2: '지상',
} as const;

export const houseTypesInfo = {
  0: {
    icon: 'studio-officetel',
    text: '원룸/오피스텔',
  },
  1: {
    icon: 'villa-townhouse',
    text: '빌라/연립',
  },
  2: {
    icon: 'apartment',
    text: '아파트',
  },
  3: {
    icon: 'single-family-house',
    text: '단독주택',
  },
} as const;

export const genderInfo = {
  0: {
    icon: 'icon-gender-free',
    text: '상관없음',
  },
  1: {
    icon: 'icon-male',
    text: '남성',
  },
  2: {
    icon: 'icon-female',
    text: '여성',
  },
} as const;

export const smokingInfo = {
  true: {
    icon: 'mini-smoke',
    text: '흡연자',
  },
  false: {
    icon: 'mini-none-smoke',
    text: '비흡연자',
  },
} as const;

export const petInfo = {
  0: {
    icon: 'pet-circle',
    text: '반려동물 상관없어요',
  },
  1: {
    icon: 'pet-heart',
    text: '반려동물 키워요',
  },
  2: {
    icon: 'pet-hate',
    text: '반려동물 NO',
  },
} as const;

export const mateNumInfo = {
  0: {
    icon: 'dont-mind-people',
    text: '상관없음',
  },
  1: {
    icon: 'one-person',
    text: '1명',
  },
  2: {
    icon: 'two-people',
    text: '2명',
  },
  3: {
    icon: 'three-people',
    text: '3명이상',
  },
} as const;
