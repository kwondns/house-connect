import { http, HttpHandler, HttpResponse } from 'msw';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userAuthHandler = [] as HttpHandler[];

type UserAuthParam = { user_id: string };
type UserAuthRequest = { email: string; password: string };
// 유저 인증
userAuthHandler.push(
  http.post<never, UserAuthRequest>(
    userEndpoints.user_auth,
    async ({ request }) => {
      try {
        const { email, password } = await request.json();
        const now = new Date().toISOString();
        const userAuthIndex = data.user_auth.findIndex(
          user => user.email === email,
        );
        // 유저가 없을 경우 or
        // 패스워드 불일치
        // 실제 서비스에선 암호화 된 데이터 비교하는 로직
        // Supabase 에서 처리
        if (
          userAuthIndex === -1 ||
          data.user_auth[userAuthIndex].password !== password
        )
          return HttpResponse.json(null, {
            status: 401,
            statusText: 'Wrong Credential!',
          });
        if (data.user_auth[userAuthIndex].status !== 0)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Block User!',
          });
        // 최근 로그인 시간으로 변경
        data.user_auth[userAuthIndex].updated_at = now;
        return HttpResponse.json(data.user_auth[userAuthIndex], {
          status: 200,
          statusText: 'Success Auth!',
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

// 친구 해제
userAuthHandler.push(
  http.delete<UserAuthParam>(
    `${userEndpoints.user_auth}/:user_id`,
    ({ params }) => {
      try {
        const { user_id: userId } = params;
        // ID가 없을 경우
        if (data.user_auth.findIndex(user => user.user_id === userId) === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Friend!',
          });

        // 정상적으로 삭제
        data.user_auth = data.user_auth.filter(user => user.user_id !== userId);
        return HttpResponse.json(null, {
          status: 204,
          statusText: 'Delete User!',
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

export default userAuthHandler;
