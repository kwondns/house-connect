import { http, HttpHandler, HttpResponse } from 'msw';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userSendFriendHandler = [] as HttpHandler[];

type UserSendFriendParam = { user_id: string };
type UserSendFriendRequest = { to_id: string };
type UserSendFriendId = { user_send_friend_id: string };
userSendFriendHandler.push(
  http.get<UserSendFriendParam>(
    `${userEndpoints.user_send_friend}/:user_id`,
    ({ params }) => {
      try {
        const { user_id: userId } = params;

        // fromId에 내 ID가 있는 데이터, 내가 신청한 데이터
        const fromId = data.user_send_friend.filter(
          user => user.from_id === userId,
        );
        fromId.forEach((from, index) => {
          const findResult = data.user.find(
            user_value => user_value.user_id === from.to_id,
          );
          if (findResult) {
            const {
              user_id: userId,
              created_at: createdAt,
              updated_at: updatedAt,
              ...others
            } = findResult;
            Object.assign(fromId[index], { ...others });
          }
        });

        // toId에 내 ID가 있는 데이터, 나한테 신청한 데이터
        const toId = data.user_send_friend.filter(
          user => user.to_id === userId,
        );
        toId.forEach((from, index) => {
          const findResult = data.user.find(
            user_value => user_value.user_id === from.from_id,
          );
          if (findResult) {
            const {
              user_id: userId,
              created_at: createdAt,
              updated_at: updatedAt,
              ...others
            } = findResult;
            Object.assign(toId[index], { ...others });
          }
        });

        if (!fromId && !toId)
          return HttpResponse.json(
            { fromId: null, toId: null },
            { statusText: `Not Found Send Friend!` },
          );

        return HttpResponse.json(
          { toId, fromId },
          { statusText: 'Found Send User!' },
        );
      } catch (error) {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Server Error Occurred!',
        });
      }
    },
  ),
);

// POST 친구 요청 생성
userSendFriendHandler.push(
  http.post<UserSendFriendParam, UserSendFriendRequest>(
    `${userEndpoints.user_send_friend}/:user_id`,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const { to_id: toId } = await request.json();
        const now = new Date().toISOString();
        // 상대의 ID가 없을 경우
        if (data.user.findIndex(user => user.user_id === toId) === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found User!',
          });

        data.user_send_friend.push({
          user_send_friend_id: uuid(),
          from_id: userId,
          to_id: toId,
          created_at: now,
          updated_at: now,
        });
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Send Friend!',
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

// 요청 거절
userSendFriendHandler.push(
  http.delete<UserSendFriendId>(
    `${userEndpoints.user_send_friend}/:user_send_friend_id`,
    ({ params }) => {
      try {
        const { user_send_friend_id: userSendFriendId } = params;
        // 해당 요청이 없는 경우
        if (
          data.user_send_friend.findIndex(
            value => value.user_send_friend_id === userSendFriendId,
          ) === -1
        )
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Request!',
          });
        data.user_send_friend = data.user_send_friend.filter(
          value => value.user_send_friend_id !== userSendFriendId,
        );
        return HttpResponse.json(null, {
          status: 204,
          statusText: 'Delete Send Friend!',
        });
      } catch (error) {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Server Error Occurred',
        });
      }
    },
  ),
);

// 요청 수락
userSendFriendHandler.push(
  http.patch<UserSendFriendId>(
    `${userEndpoints.user_send_friend}/:user_send_friend_id`,
    ({ params }) => {
      try {
        const { user_send_friend_id: userSendFriendId } = params;
        // 해당 요청이 없는 경우
        if (
          data.user_send_friend.findIndex(
            value => value.user_send_friend_id === userSendFriendId,
          ) === -1
        )
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Request!',
          });
        data.user_send_friend = data.user_send_friend.filter(
          value => value.user_send_friend_id !== userSendFriendId,
        );
        return HttpResponse.json(null, {
          status: 204,
          statusText: 'Accept Success!',
        });
      } catch (error) {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Server Error Occurred',
        });
      }
    },
  ),
);

export default userSendFriendHandler;
