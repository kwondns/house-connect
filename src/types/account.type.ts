import { z } from 'zod';

import { PasswordValidate } from '@/types/auth.type';

export const AccountForm = z
  .object({
    avatar: z.union([z.instanceof(File), z.undefined()]),
    nickname: z
      .union([
        z.string().min(2, { message: '최소 2글자 이상 입력해주세요.' }),
        z.undefined(),
      ])
      .optional(),
    password: z.union([PasswordValidate, z.undefined()]).optional(),
    confirmPassword: z.union([PasswordValidate, z.undefined()]).optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });
export type AccountFormType = z.infer<typeof AccountForm>;
