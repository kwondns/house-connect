import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import cn from '@/libs/cn';
import Container from '@/components/atoms/Container';
import Icon from '@/components/atoms/Icon';
import { SessionAtom } from '@/stores/auth.store';
import { createToast } from '@/libs/toast';
import { supabase } from '@/libs/supabaseClient';

export default function SignLayoutTemplate() {
  const navigate = useNavigate();
  const session = useRecoilValue(SessionAtom);

  useEffect(() => {
    let timeoutId: number;
    const { data } = supabase.auth.onAuthStateChange(async _event => {
      if (session) {
        timeoutId = window.setTimeout(() => {
          const { birth, gender, nickname } = session.user.user_metadata;

          if (!birth || !gender || !nickname) {
            createToast('signup-info', '추가 정보를 입력해주세요.', {
              isLoading: false,
              type: 'warning',
              autoClose: 3000,
            });

            navigate('/sign/up/info');
          }
          // 성공적으로 user추가정보(birth, gender, nickname)를 update했을 때
          else {
            navigate('/signup-intro');
          }
        }, 0);
      }
    });

    return () => {
      data.subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [session]);

  return (
    <>
      <Container
        className={cn(
          'fixed left-0 top-0 z-[-9999] h-screen w-[51vw] bg-subColor1',
        )}
      />
      <Container
        className={cn(
          'fixed right-0 top-0 z-[-9998] h-screen w-[50vw] bg-bg rounded-xl',
        )}
      />
      <Container className="h-full w-[50%] pl-[4.75rem] pt-[calc(50vh-147px)]">
        <Icon className="translate-y-[-50%]" type="character" />
      </Container>
      <Container className="absolute right-0 w-[50%] pl-[7.125rem] [&_input]:placeholder:text-[0.875rem]">
        <Outlet />
      </Container>
    </>
  );
}
