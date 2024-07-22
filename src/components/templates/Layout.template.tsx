import { Outlet } from 'react-router-dom';

import cn from '@/libs/cn';
import Header from '@/components/organisms/Header';
import { useAuthState } from '@/hooks/useSign';

export default function LayoutTemplate() {
  // * supabase authListener를 등록함과 동시에 isLogin상태를 가져오기 위함
  const [session] = useAuthState();

  return (
    <>
      <Header isLogin={!!session} />
      <main
        className={cn(
          'flex bg-bg flex-col relative max-w-[79rem] px-8 mx-auto h-screen pt-[9.25rem]',
        )}
      >
        <Outlet />
      </main>
    </>
  );
}

LayoutTemplate.defaultProps = {
  isLogin: false,
};
