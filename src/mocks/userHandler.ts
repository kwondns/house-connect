import { http, HttpHandler, HttpResponse } from 'msw';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userHandler = [] as HttpHandler[];

type UserParam = { user_id: string };
type UserRequest = { nickname: string; password: string; avatar: string };
userHandler.push(
  http.get<UserParam>(userEndpoints.user, ({ params }) => {
    try {
      const { user_id: userId } = params;
      const result = data.user.find(user => user.user_id === userId);
      if (!result)
        return HttpResponse.json(null, {
          status: 404,
          statusText: 'Not Found User!',
        });
      return HttpResponse.json(result, {
        status: 200,
        statusText: 'Found User!',
      });
    } catch (error) {
      return HttpResponse.json(null, {
        status: 500,
        statusText: 'Server Error Occurred',
      });
    }
  }),
);

userHandler.push(
  http.put<UserParam, UserRequest>(
    userEndpoints.user,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const { nickname, avatar, password } = await request.json();
        const now = new Date().toISOString();
        const userIndex = data.user.findIndex(user => user.user_id === userId);
        // 유저가 없을 경우
        if (userIndex === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found User!',
          });
        // 유저 정보 업데이트
        data.user[userIndex] = Object.assign(
          data.user[userIndex],
          { nickname, avatar, password },
          { updated_at: now },
        );
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Update User!',
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

export default userHandler;
