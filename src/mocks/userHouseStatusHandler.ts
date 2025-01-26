import { http, HttpHandler, HttpResponse } from 'msw';

import data from '@/db/userDB';
import userEndpoints from '@/constants/apiEndpoints';

const userHouseStatusHandler = [] as HttpHandler[];
type UserHouseStatusParam = { user_id: string };
type UserHouseStatusRequest = { house_status: 0 | 1 | 2; house_link: string };
// 유저의 하우스 상태
userHouseStatusHandler.push(
  http.get<UserHouseStatusParam>(
    userEndpoints.user_house_status,
    ({ params }) => {
      try {
        const { user_id: userId } = params;
        const result = data.user_house_status.find(
          user => user.user_id === userId,
        );
        if (!result)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found House Status!',
          });
        return HttpResponse.json(result, { statusText: 'Found House Status!' });
      } catch (error) {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Server Error Occurred',
        });
      }
    },
  ),
);

userHouseStatusHandler.push(
  http.put<UserHouseStatusParam, UserHouseStatusRequest>(
    userEndpoints.user_house_status,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const { house_status: houseStatus, house_link: houseLink } =
          await request.json();
        const userHouseStatusIndex = data.user_house_status.findIndex(
          user => user.user_id === userId,
        );
        // 해당 유저의 데이터가 없을 경우
        if (userHouseStatusIndex === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found User!',
          });

        // 해당 유저의 정보를 수정
        data.user_house_status[userHouseStatusIndex] = Object.assign(
          data.user_house_status[userHouseStatusIndex],
          { house_link: houseLink, house_status: houseStatus },
        );
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Update House Status!',
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

export default userHouseStatusHandler;
