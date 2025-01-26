import { http, HttpHandler, HttpResponse } from 'msw';

import data from '@/db/userDB';
import userEndpoints from '@/constants/apiEndpoints';

const userActivityHandler = [] as HttpHandler[];
type UserActivityParam = { user_id: string };
// 유저의 활동 목록
userActivityHandler.push(
  http.get<UserActivityParam>(userEndpoints.user_activity, ({ params }) => {
    try {
      const { user_id: userId } = params;
      const result = data.user_activity.find(user => user.user_id === userId);
      if (!result)
        return HttpResponse.json(null, {
          status: 401,
          statusText: 'Not Found Activity!',
        });
      return HttpResponse.json(result, {
        statusText: 'Found Activity!',
      });
    } catch (error) {
      return HttpResponse.json(null, {
        status: 500,
        statusText: 'Server Error Occurred',
      });
    }
  }),
);

export default userActivityHandler;
