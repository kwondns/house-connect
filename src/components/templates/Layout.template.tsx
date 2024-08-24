import { Outlet } from 'react-router-dom';

import cn from '@/libs/cn';
import Header from '@/components/organisms/Header';
import { useAuthState } from '@/hooks/useSign';
import Container from '@/components/atoms/Container';

export default function LayoutTemplate() {
  // * supabase authListener를 등록함과 동시에 isLogin상태를 가져오기 위함
  const [session] = useAuthState();
  const location = useLocation();
  const isHouseList = location.pathname.endsWith('/house');

  return (
    <>
      <Header isLogin={!!session} />
      {isHouseList ? (
        <>
          <Container className="absolute inset-x-0 top-[147px] h-[calc(100vh-147px)] bg-[#FCF7E7]" />
          <Container className="absolute inset-x-0 bottom-0 h-[14.68rem] rounded-t-[100rem] bg-[#FFD7C6] [clip-path:polygon(50%_0%,0%_100%,100%_100%)]" />
          <Container className="fixed inset-x-0 -z-10 h-full bg-[#FFD7C6]" />
          <main
            className={cn(
              'flex flex-col relative max-w-[90rem] monitor:max-w-[97.5rem] mx-auto h-screen pt-[9.25rem] bg-transparent',
            )}
          >
            <Outlet />
          </main>
        </>
      ) : (
        <main
          className={cn(
            'flex bg-bg flex-col relative max-w-[79rem] px-8 mx-auto h-screen pt-[9.25rem] bg-transparent',
          )}
        >
          <Outlet />
        </main>
      )}
    </>
  );
}

LayoutTemplate.defaultProps = {
  isLogin: false,
};
