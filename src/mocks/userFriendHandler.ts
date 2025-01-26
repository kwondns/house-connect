import { http, HttpHandler, HttpResponse } from 'msw';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userFriendHandler = [] as HttpHandler[];

type UserFriendParam = { user_id: string };
type UserFriendRequest = { friend_id: string };
type UserFriendId = { user_friend_id: string };
// 유저 친구 목록 가져오기
userFriendHandler.push(
  http.get<UserFriendParam>(
    `${userEndpoints.user_friend}/:user_id`,
    ({ params }) => {
      try {
        const { user_id: userId } = params;
        const result = data.user_friend.filter(user => user.user_id === userId);
        // 친구 목록이 없을 경우
        if (result.length === 0)
          return HttpResponse.json(null, {
            statusText: 'User Friend List Empty!',
          });

        // 친구 목록 반환
        return HttpResponse.json(result, {
          statusText: 'Found User Friend List!',
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

// 친구 목록 추가
userFriendHandler.push(
  http.post<UserFriendParam, UserFriendRequest>(
    `${userEndpoints.user_friend}/:user_id`,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const { friend_id: friendId } = await request.json();
        const now = new Date().toISOString();
        // 친구 하려는 유저가 없을 경우
        if (data.user.findIndex(user => user.user_id === friendId) === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Friend Target!',
          });

        data.user_friend.push({
          user_friend_id: uuid(),
          user_id: userId,
          friend_id: friendId,
          created_at: now,
          updated_at: now,
        });
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Create Friend!',
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
userFriendHandler.push(
  http.delete<UserFriendId>(
    `${userEndpoints.user_friend}/:user_friend_id`,
    ({ params }) => {
      try {
        const { user_friend_id: userFriendId } = params;
        // 삭제하려는 친구 ID가 없을 경우
        if (
          data.user_friend.findIndex(
            friend => friend.user_friend_id === userFriendId,
          ) === -1
        )
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Friend!',
          });

        // 정상적으로 친구 해제
        data.user_friend = data.user_friend.filter(
          friend => friend.user_friend_id !== userFriendId,
        );
        return HttpResponse.json(null, {
          status: 204,
          statusText: 'Delete Friend!',
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

export default userFriendHandler;
