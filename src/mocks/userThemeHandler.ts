import { http, HttpHandler, HttpResponse } from 'msw';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userThemeHandler = [] as HttpHandler[];

type UserThemeParam = { user_id: string };
type UserThemeRequest = {
  theme?: 0 | 1 | 2; // 0: 시스템 기본값, 1: 라이트 모드, 2: 다크 모드
  font_size?: 0 | 1 | 2; // 0: 작음, 1: 기본, 2: 큼
  language?: 0 | 1; // 0: 한글, 1: 영어
};
userThemeHandler.push(
  http.get<UserThemeParam>(userEndpoints.user_theme, ({ params }) => {
    try {
      const { user_id: userId } = params;
      const result = data.user_theme.find(user => user.user_id === userId);
      if (!result)
        return HttpResponse.json(null, {
          status: 404,
          statusText: 'Not Found User!',
        });
      return HttpResponse.json(result, { statusText: 'Found User Theme!' });
    } catch (error) {
      return HttpResponse.json(null, {
        status: 500,
        statusText: 'Server Error Occurred!',
      });
    }
  }),
);

userThemeHandler.push(
  http.patch<UserThemeParam, UserThemeRequest>(
    userEndpoints.user_theme,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const { theme, font_size: fontSize, language } = await request.json();
        const userThemeIndex = data.user_theme.findIndex(
          user => user.user_id === userId,
        );
        if (userThemeIndex === -1)
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found User!',
          });
        if (theme) {
          data.user_theme[userThemeIndex].theme = theme;
        }
        if (fontSize) {
          data.user_theme[userThemeIndex].font_size = fontSize;
        }
        if (language) {
          data.user_theme[userThemeIndex].language = language;
        }
        return HttpResponse.json(null, {
          status: 204,
          statusText: 'Update User Theme!',
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

export default userThemeHandler;
