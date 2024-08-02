import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { ReactElement, useState } from 'react';
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
import Chat from '@/components/pages/Chat';
import ChatRoom from '@/components/templates/ChatRoom';
import { IsInitializingSession, SessionAtom } from '@/stores/auth.store';
import Loading from '@/components/pages/Loading';
import SignPasswordReset from '@/components/pages/SignPasswordReset';
import SignUpdatePassword from '@/components/pages/SignUpdatePassword';
import SignUpEmail from '@/components/pages/SignUpEmail';
import SignUpInfo from '@/components/pages/SignUpInfo';
import HouseRegister from '@/components/pages/HouseRegister';
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

  if (!isInitializingSession && !session) {
    return isDelaying ? (
      <Loading delayTime={2000} setIsDelaying={setIsDelaying} />
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
            path: ':chatId',
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
        element: <HouseList />,
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
        path: 'house-detail/:houseId',
        element: <h1>House Detail Page</h1>,
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
        path: 'account',
        shouldProtected: true,
        element: (
          <div>
            My Account page(myPage할 때 sidebar UI먼저 작업 필요해 보임)
            <Outlet />
          </div>
        ),
        // ! TODO: 아래는 my-page의 알림 설정 mock page -> 추후 재조정
        children: [
          {
            path: 'alert-settings',
            element: <h1>알림 설정</h1>,
          },
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
