import { http, HttpHandler, HttpResponse } from 'msw';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userBlockHandler = [] as HttpHandler[];

type UserBlockParam = { user_id: string };
type UserBlockRequest = { block_id: string };
type UserBlockId = { user_block_id: string };
// 유저 차단 목록 가져오기
userBlockHandler.push(
  http.get<UserBlockParam>(
    `${userEndpoints.user_block}/:user_id`,
    ({ params }) => {
      try {
        const { user_id: userId } = params;
        const result = data.user_block.filter(user => user.user_id === userId);
        // 차단 목록이 없을 경우
        if (result.length === 0)
          return HttpResponse.json(null, {
            statusText: 'User Block List Empty!',
          });

        // 차단 목록 반환
        return HttpResponse.json(result, {
          statusText: 'Found User Block List!',
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

// 차단 목록 추가
userBlockHandler.push(
  http.post<UserBlockParam, UserBlockRequest>(
    `${userEndpoints.user_block}/:user_id`,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const { block_id: blockId } = await request.json();
        const now = new Date().toISOString();
        // 차단 하려는 유저가 없을 경우
        if (data.user.findIndex(user => user.user_id === blockId) === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Block Target!',
          });

        data.user_block.push({
          user_block_id: uuid(),
          user_id: userId,
          block_id: blockId,
          created_at: now,
          updated_at: now,
        });
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Create Block!',
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

// 차단 해제
userBlockHandler.push(
  http.delete<UserBlockId>(
    `${userEndpoints.user_block}/:user_block_id`,
    ({ params }) => {
      try {
        const { user_block_id: userBlockId } = params;
        // 삭제하려는 차단 ID가 없을 경우
        if (
          data.user_block.findIndex(
            block => block.user_block_id === userBlockId,
          ) === -1
        )
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Block!',
          });

        // 정상적으로 차단 해제
        data.user_block = data.user_block.filter(
          block => block.user_block_id !== userBlockId,
        );
        return HttpResponse.json(null, {
          status: 204,
          statusText: 'Delete Block!',
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

export default userBlockHandler;
