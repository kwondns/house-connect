import { ComponentProps, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import Container from '@/components/atoms/Container';
import Icon from '@/components/atoms/Icon';
import Link from '@/components/atoms/Link';
import Typography from '@/components/atoms/Typography';
import cn from '@/libs/cn';
import IconButton from '@/components/molecules/IconButton';
import { UserAtom } from '@/stores/auth.store';
import { UserType } from '@/types/auth.type';
import Avatar from '@/components/atoms/Avatar';

type Props = ComponentProps<'header'> & {
  className?: string;
  isLogin: boolean;
};

type GNBProps = ComponentProps<'div'> & {
  navItems: { name: string; path: string }[];
};

type UserMenuProps = ComponentProps<'div'> & {
  user: UserType | null;
  isLogin: boolean;
  hasNewAlarm: boolean;
  isUserMenuActive: boolean;
};

// chats, lounge, house와 같은 NavLink를 관장하는 component
function GNB({ navItems, className }: GNBProps) {
  return (
    <Container.FlexRow className={cn('gap-9', className)}>
      {navItems.map(({ name, path }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            isActive ? 'text-brown' : 'text-brown2'
          }
        >
          <Typography.SpanMid1
            lang="en"
            className="text-[0.9375rem] font-semibold uppercase tracking-widest hover:text-brown1"
          >
            {name}
          </Typography.SpanMid1>
        </NavLink>
      ))}
    </Container.FlexRow>
  );
}

// header에서 Logo, GNB를 제외한 user에 대한 정보(e.g avatar alarm)
function UserMenu({
  user,
  className,
  isLogin,
  hasNewAlarm,
  isUserMenuActive,
}: UserMenuProps) {
  return (
    <Container.FlexRow
      className={cn('items-center justify-between gap-7', className)}
    >
      {isLogin && (
        <>
          <IconButton
            button="Ghost"
            iconType={hasNewAlarm ? 'alarm-exist' : 'alarm-none'}
          />
          {user?.avatar ? (
            <Avatar.XS src={user.avatar} isActive={isUserMenuActive} />
          ) : (
            <IconButton button="Ghost" iconType="avatar" />
          )}
        </>
      )}
      {!isLogin && (
        <Container.FlexRow className="items-center gap-4">
          <Link to="/sign/in">
            <Typography.SpanMid1
              lang="en"
              className="cursor-pointer text-[0.9375rem] font-semibold uppercase tracking-widest text-brown hover:text-brown1"
            >
              login
            </Typography.SpanMid1>
          </Link>
        </Container.FlexRow>
      )}
    </Container.FlexRow>
  );
}
export default function Header({ className, isLogin, ...others }: Props) {
  // ! TODO: 알람기능 추가시 바꿔야 함
  const [hasNewAlarm] = useState(false);
  const [isUserMenuActive, _setIsUserMenuActive] = useState(false);
  const location = useLocation();
  const user = useRecoilValue(UserAtom);
  const navItems = useMemo(
    () => [
      { name: 'chats', path: '/chats' },
      { name: 'lounge', path: '/lounge' },
      { name: 'house', path: '/house' },
    ],
    [],
  );
  const isNotHousePath = !location.pathname.endsWith('/house');
  const isNotSignPath = !location.pathname.startsWith('/sign');
  const isSignUpProfilePath = location.pathname.startsWith('/signup');

  return (
    <header
      className={cn(
        'fixed left-0 top-0 z-50 w-screen bg-transparent',
        isNotSignPath && 'bg-bg',
        isSignUpProfilePath && 'bg-bg',
        isNotHousePath && 'hidden tablet:block',
      )}
      {...others}
    >
      <Container.FlexRow className="mx-auto w-full max-w-[79rem] items-center justify-between px-8">
        <Link to="/">
          <Icon type="logo" className="h-[9.1875rem] w-[6.5625rem]" />
        </Link>
        {isNotSignPath && (
          <>
            <GNB navItems={navItems} />
            <UserMenu
              user={user}
              isLogin={isLogin}
              hasNewAlarm={hasNewAlarm}
              isUserMenuActive={isUserMenuActive}
            />
          </>
        )}
      </Container.FlexRow>
    </header>
  );
}

Header.defaultProps = {
  className: '',
};
