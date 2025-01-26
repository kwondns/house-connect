import { http, HttpHandler, HttpResponse } from 'msw';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userProfileHandler = [] as HttpHandler[];

type UserProfileParam = { user_id: string };
type LookingHouse = {
  house_type: 0 | 1 | 2 | 3; // 집 유형 0: 원룸/오피스텔, 1: 빌라/연립, 2: 아파트, 3: 단독주택
  rental_type: 0 | 1 | 2; // 집 대여 유형 0: 월세, 1: 전세, 2: 반 전세
  house_regions: string[];
  deposit_price: [number, number];
  monthly_rental_price: [number, number];
  term: [number, number];
};
type MateStyle = {
  gender: 0 | 1 | 2; // 0: 상관없음 1: 남성, 2: 여성
  mates_number: 0 | 1 | 2 | 3; // 0: 상관없음, 1: 1명, 2: 2명, 3: 3명이상
  mate_appeals: string[];
};
type Lifestyle = {
  smoking: boolean;
  pet: 0 | 1 | 2; // 0: 상관없음, 1: 좋음, 2: 싫음
  appeals: string[];
};
type UserProfileRequest = {
  looking_house: LookingHouse;
  mate_style: MateStyle;
  lifestyle: Lifestyle;
};

userProfileHandler.push(
  http.get<UserProfileParam>(userEndpoints.user_profile, ({ params }) => {
    try {
      const { user_id: userId } = params;
      // looking_house 에 대한 정보 수집
      const lookingHouse = data.user_looking_house.find(
        user => user.user_id === userId,
      );

      // mate_style 에 대한 정보 수집
      const mateStyle = data.user_mate_style.find(
        user => user.user_id === userId,
      );

      // lifestyle 에 대한 정보 수집
      const lifestyle = data.user_lifestyle.find(
        user => user.user_id === userId,
      );

      // 3가지 중 하나라도 없을 경우 에러, user 에 대한 정보는 무조건 전부 있어야 함.
      if ([lookingHouse, mateStyle, lifestyle].some(item => item === undefined))
        return HttpResponse.json(null, {
          status: 404,
          statusText: 'Not Found User!',
        });
      return HttpResponse.json(
        { looking_house: lookingHouse, mate_style: mateStyle, lifestyle },
        { status: 200, statusText: 'Found User Profile!' },
      );
    } catch (error) {
      return HttpResponse.json(null, {
        status: 500,
        statusText: 'Server Error Occurred',
      });
    }
  }),
);

userProfileHandler.push(
  http.post<UserProfileParam, UserProfileRequest>(
    userEndpoints.user_theme,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const {
          looking_house: lookingHouse,
          mate_style: mateStyle,
          lifestyle,
        } = await request.json();
        const now = new Date().toISOString();

        // 회원가입 시 3가지의 데이터가 전부 존재하여 바로 Push
        data.user_looking_house.push({
          user_id: userId,
          updated_at: now,
          created_at: now,
          ...lookingHouse,
        });
        data.user_mate_style.push({
          user_id: userId,
          created_at: now,
          updated_at: now,
          ...mateStyle,
        });
        data.user_lifestyle.push({
          user_id: userId,
          created_at: now,
          updated_at: now,
          ...lifestyle,
        });
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Create Profile!',
        });
      } catch (error) {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Server Error Occurred!',
        });
      }
    },
  ),
);

userProfileHandler.push(
  http.put<UserProfileParam, UserProfileRequest>(
    userEndpoints.user_profile,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const {
          looking_house: lookingHouse,
          mate_style: mateStyle,
          lifestyle,
        } = await request.json();
        const now = new Date().toISOString();

        // 수정할 데이터 검색
        const lookingHouseIndex = data.user_looking_house.findIndex(
          user => user.user_id === userId,
        );
        const mateStyleIndex = data.user_mate_style.findIndex(
          user => user.user_id === userId,
        );
        const lifestyleIndex = data.user_lifestyle.findIndex(
          user => user.user_id === userId,
        );

        // 모든 유저가 각각의 데이터를 갖고 있어야 함, 없을 경우 에러
        if (
          lookingHouseIndex === -1 ||
          mateStyleIndex === -1 ||
          lifestyleIndex === -1
        )
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found User!',
          });

        // Request 로 들어온 데이터로 변경
        data.user_looking_house[lookingHouseIndex] = Object.assign(
          data.user_looking_house[lookingHouseIndex],
          lookingHouse,
          { updated_at: now },
        );
        data.user_mate_style[mateStyleIndex] = Object.assign(
          data.user_mate_style[mateStyleIndex],
          mateStyle,
          { updated_at: now },
        );
        data.user_lifestyle[lifestyleIndex] = Object.assign(
          data.user_lifestyle[lifestyleIndex],
          lifestyle,
          { updated_at: now },
        );
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Update Profile!',
        });
      } catch (error) {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Server Error Occurred!',
        });
      }
    },
  ),
);

export default userProfileHandler;
