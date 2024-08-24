import { z } from 'zod';

export const CommentForm = z.object({
  content: z
    .string()
    .min(2, { message: '최소 2글자 이상 작성해주세요' })
    .max(200, { message: '최대 200글자까지 가능합니다.' }),
});

export type CommentFormType = z.infer<typeof CommentForm>;

export type CommentType = {
  content: string;
  created_at: string;
  house_id: string;
  id: string;
  updated_at: string;
  user_id: string;
  house_reply: {
    comment_id: string;
    content: string;
    created_at: string;
    id: string;
    updated_at: string;
    user_id: string;
    user: {
      id: string;
      avatar: string;
      nickname: string;
    };
  }[];
  user: {
    id: string;
    avatar: string;
    nickname: string;
  };
};
