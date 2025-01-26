import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { ReactElement, Suspense, useState } from 'react';
import { useRecoilValue } from 'recoil';

import LayoutTemplate from '@/components/templates/Layout.template';
import ComponentTest from '@/components/pages/ComponentTest';
import SignLayoutTemplate from '@/components/templates/SignLayout.template';
import SignUpProfileIntro from '@/components/pages/SignUpProfileIntro';
import SignUpProfile from '@/components/pages/SignUpProfile';
import SignIn from '@/components/pages/SignIn';
import SignUp from '@/components/pages/SignUp';
import About from '@/components/pages/About';
import SignUpProfileOutro from '@/components/pages/SignUpProfileOutro';
import { IsInitializingSession, SessionAtom } from '@/stores/auth.store';
import Loading from '@/components/pages/Loading';
import SignPasswordReset from '@/components/pages/SignPasswordReset';
import SignUpdatePassword from '@/components/pages/SignUpdatePassword';
import SignUpEmail from '@/components/pages/SignUpEmail';
import SignUpInfo from '@/components/pages/SignUpInfo';
import HouseRegister from '@/components/pages/HouseRegister';
import { ChatRoom } from '@/components/templates/chats';
import Chat from '@/components/pages/Chat';
import HouseDetail from '@/components/pages/HouseDetail';
import MyPageLayoutTemplate from '@/components/templates/MyPageLayout.template';
import MyActivity from '@/components/pages/MyActivity';
import MyAccount from '@/components/pages/MyAccount';
import MyBookmark from '@/components/pages/MyBookmark';
import HouseList from '@/components/pages/HouseList';

type RouteType = RouteObject & {
  shouldProtected?: boolean;
  element: ReactElement;
  children?: RouteType[];
};

type ProtectedRouterType = {
  children: ReactElement<{ isLogin?: boolean }>;
};

function ProtectedRouter({ children }: ProtectedRouterType) {
  const session = useRecoilValue(SessionAtom);
  const isInitializingSession = useRecoilValue(IsInitializingSession);
  const [isDelaying, setIsDelaying] = useState(true);

  // ! TODO: 하위 컴포넌트에서 초기 렌더링 시 user의 정보를 참조하고 있어 발생하는 오류를
  // ! user가 초기화 중일 때는 하위 컴포넌트의 렌더링을 막고 user 정보 초기화가 완료되었을 시만
  // ! 하위 컴포넌트를 렌더링 함.
  if (isInitializingSession) return <Loading text="로그인 정보 확인 중" />;

  if (!isInitializingSession && !session) {
    return isDelaying ? (
      <Loading
        delayTime={2000}
        setIsDelaying={setIsDelaying}
        text="로그인이 필요한 서비스입니다"
      />
    ) : (
      <Navigate to="/sign/in" />
    );
  }

  // * session이 초기화되었을 때만 도달하는 영역
  return children;
}

const routes: RouteType[] = [
  {
    path: '/',
    element: <LayoutTemplate />,
    children: [
      {
        index: true,
        element: <About />,
      },
      {
        path: 'chats',
        element: <Chat />,
        shouldProtected: true,
        children: [
          {
            path: ':chatRoomId',
            element: <ChatRoom />,
          },
        ],
      },
      {
        path: 'lounge',
        shouldProtected: true,
        element: <span>lounge page</span>,
      },
      {
        path: 'house',
        element: (
          <Suspense fallback={<Loading />}>
            <HouseList />
          </Suspense>
        ),
      },
      {
        path: 'house/regist',
        element: <HouseRegister />,
        shouldProtected: true,
      },
      {
        path: 'house/edit/:houseId',
        element: <HouseRegister />,
        shouldProtected: true,
      },
      {
        path: 'house/:houseId',
        element: <HouseDetail />,
        shouldProtected: true,
      },
      {
        path: 'sign',
        element: <SignLayoutTemplate />,
        children: [
          {
            path: 'in',
            element: <SignIn />,
          },
          {
            path: 'up',
            element: <SignUp />,
            children: [
              { index: true, element: <SignUpEmail /> },
              { path: 'info', element: <SignUpInfo /> },
            ],
          },
          {
            path: 'password',
            element: <SignPasswordReset />,
          },
          {
            path: 'update-password',
            element: <SignUpdatePassword />,
          },
        ],
      },
      {
        path: 'signup-intro',
        shouldProtected: true,
        element: <SignUpProfileIntro />,
      },
      {
        path: 'signup-profile',
        // shouldProtected: true,
        element: <SignUpProfile />,
      },
      {
        path: 'component-test',
        element: <ComponentTest />,
      },
      {
        path: 'signup-outro',
        shouldProtected: true,
        element: <SignUpProfileOutro />,
      },
      {
        path: 'mypage',
        shouldProtected: true,
        element: <MyPageLayoutTemplate />,
        children: [
          { path: 'activity', element: <MyActivity /> },
          { path: 'bookmark', element: <MyBookmark /> },
          { path: 'account', element: <MyAccount /> },
          { path: 'mate', element: <h1>준비중...</h1> },
          { path: 'alarm', element: <h1>준비중...</h1> },
          { path: 'theme', element: <h1>준비중...</h1> },
        ],
      },
    ],
  },
];

const createRoutes = (routes: RouteType[]): RouteObject[] =>
  routes.map(route => {
    const { path, element, children, shouldProtected } = route;

    const routeObject = {
      ...route,
      path,
      element: shouldProtected ? (
        <ProtectedRouter>{element}</ProtectedRouter>
      ) : (
        element
      ),
      children: children ? createRoutes(children) : undefined,
    } as RouteType;

    // ! delete useless property of RouterObject from react-router-dom
    const { shouldProtected: _, ...parsedToRouterObject } = routeObject;

    return parsedToRouterObject;
  });

const router = createBrowserRouter(createRoutes(routes));

export default function Router() {
  return <RouterProvider router={router} />;
}
