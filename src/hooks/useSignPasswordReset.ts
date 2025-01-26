import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  SignPasswordResetType,
  SignUpdatePasswordType,
} from '@/types/auth.type';
import { supabase } from '@/libs/supabaseClient';
import { createToast, errorToast, successToast } from '@/libs/toast';

export const useSignPasswordReset = () => {
  const { mutate: passwordReset, isPending } = useMutation({
    mutationFn: async (payload: SignPasswordResetType) => {
      const { error } = await supabase.auth.resetPasswordForEmail(
        payload.email,
        {
          // ! TODO: dev, production에 따라 redirect URL 변경해야 함.
          redirectTo: 'http://localhost:5173/sign/update-password',
        },
      );
      if (error) throw new Error(error.message);
    },
    onMutate: () =>
      createToast('passwordReset', '초기화 요청을 보내는 중입니다...'),
    onSuccess: () => successToast('passwordReset', '이메일을 확인해주세요.'),
    onError: () => errorToast('passwordReset', '요청에 실패했습니다.'),
  });
  return { passwordReset, isPending };
};

export const useSignUpdatePassword = () => {
  const navigate = useNavigate();
  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: async (payload: Pick<SignUpdatePasswordType, 'password'>) => {
      const { error } = await supabase.auth.updateUser({
        password: payload.password,
      });
      if (error) throw new Error(error.message);
    },
    onMutate: () =>
      createToast('passwordUpdate', '비밀번호를 변경 중입니다...'),
    onSuccess: () => {
      successToast('passwordUpdate', '비밀번호 변경에 성공했습니다.');
      navigate('/sign/in');
    },
    onError: () => {
      errorToast('passwordUpdate', '비밀번호 변경에 실패했습니다.');
    },
  });
  return { updatePassword, isPending };
};
