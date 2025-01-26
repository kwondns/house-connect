import { http, HttpHandler, HttpResponse } from 'msw';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';

import userEndpoints from '@/constants/apiEndpoints';
import data from '@/db/userDB';

const userBookmarkHandler = [] as HttpHandler[];
type UserBookmarkParam = { user_id: string };
type UserBookmarkRequest = {
  bookmark_type: 0 | 1 | 2; // 0: 하우스, 1: 라운지, 2: 라운지 게시글
  content_id: string;
};
type UserBookmarkId = { bookmark_id: string };
userBookmarkHandler.push(
  http.get<UserBookmarkParam>(
    `${userEndpoints.user_bookmark}/:user_id`,
    ({ params }) => {
      try {
        const { user_id: userId } = params;
        const result = data.user_bookmark.filter(
          user => user.user_id === userId,
        );
        if (result.length === 0)
          return HttpResponse.json(null, {
            status: 200,
            statusText: 'Not Found Bookmark!',
          });
        return HttpResponse.json(result, { statusText: 'Found Bookmark!' });
      } catch (error) {
        return HttpResponse.json(null, {
          status: 500,
          statusText: 'Server Error Occurred!',
        });
      }
    },
  ),
);

// 북마크 생성
userBookmarkHandler.push(
  http.post<UserBookmarkParam, UserBookmarkRequest>(
    `${userEndpoints.user_bookmark}/:user_id`,
    async ({ params, request }) => {
      try {
        const { user_id: userId } = params;
        const { bookmark_type: bookmarkType, content_id: contentId } =
          await request.json();
        const now = new Date().toISOString();
        data.user_bookmark.push({
          bookmark_id: uuid(),
          user_id: userId,
          bookmark_type: bookmarkType,
          content_id: contentId,
          created_at: now,
          updated_at: now,
        });
        return HttpResponse.json(null, {
          status: 201,
          statusText: 'Create Bookmark!',
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

// 북마크 제거
userBookmarkHandler.push(
  http.delete<UserBookmarkId>(
    `${userEndpoints.user_bookmark}/:bookmark_id`,
    ({ params }) => {
      try {
        const { bookmark_id: bookmarkId } = params;
        if (
          data.user_bookmark.findIndex(
            bookmark => bookmark.bookmark_id === bookmarkId,
          ) === -1
        )
          return HttpResponse.json(null, {
            status: 404,
            statusText: 'Not Found Bookmark!',
          });
        data.user_bookmark = data.user_bookmark.filter(
          bookmark => bookmark.bookmark_id !== bookmarkId,
        );
        return HttpResponse.json(null, {
          status: 204,
          statusText: 'Delete Bookmark!',
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

export default userBookmarkHandler;
