import { http, HttpHandler, HttpResponse } from 'msw';

import data from '@/db/userDB';
import userEndpoints from '@/constants/apiEndpoints';

const userAlarmSettingHandler = [] as HttpHandler[];
type UserAlarmSettingParam = { user_id: string };
type UserAlarmSettingRequest = {
  house_alarm_1?: boolean; // 내 집에 달린 북마크 알림
  chat_alarm_1?: boolean; // 채팅 알림
  lounge_alarm_1?: boolean; // 라운지 초대 수락 알림
  lounge_alarm_2?: boolean; // 라운지 새로운 글 알림
};
// 유저의 알람 상태
userAlarmSettingHandler.push(
  http.get<UserAlarmSettingParam>(
    userEndpoints.user_alarm_setting,
    ({ params }) => {
      try {
        const { user_id: userId } = params;
        const result = data.user_alarm_setting.find(
          user => user.user_id === userId,
        );
        if (!result)
          return HttpResponse.json(null, {
            status: 401,
            statusText: 'Not Found Alarm Setting!',
          });
        return HttpResponse.json(result, {
          statusText: 'Found Alarm Setting!',
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

userAlarmSettingHandler.push(
  http.patch<UserAlarmSettingParam, UserAlarmSettingRequest>(
    userEndpoints.user_alarm_setting,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const {
          house_alarm_1: houseAlarm1,
          chat_alarm_1: chatAlarm1,
          lounge_alarm_1: loungeAlarm1,
          lounge_alarm_2: loungeAlarm2,
        } = await request.json();
        const userAlarmSettingIndex = data.user_alarm_setting.findIndex(
          user => user.user_id === userId,
        );
        // 해당 유저의 데이터가 없을 경우
        if (userAlarmSettingIndex === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found User!',
          });

        // 해당 유저의 정보를 수정
        if (houseAlarm1)
          data.user_alarm_setting[userAlarmSettingIndex].house_alarm_1 =
            houseAlarm1;
        if (chatAlarm1)
          data.user_alarm_setting[userAlarmSettingIndex].chat_alarm_1 =
            chatAlarm1;
        if (loungeAlarm1)
          data.user_alarm_setting[userAlarmSettingIndex].lounge_alarm_1 =
            loungeAlarm1;
        if (loungeAlarm2)
          data.user_alarm_setting[userAlarmSettingIndex].lounge_alarm_2 =
            loungeAlarm2;
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Update Alarm Setting!',
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

export default userAlarmSettingHandler;
