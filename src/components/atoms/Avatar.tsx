import React, { ComponentProps, ReactNode } from 'react';

import cn from '@/libs/cn';
/*
- xs; 40px (2.5rem)
- s; 44px (2.75rem)
- m; 48px (3rem)
- l; 60px (3.75rem)
- xl; 72px (4.5rem)
- 2xl; 96px (6rem)
- 3xl; 128px (8rem)
*/
export type AvatarProps = ComponentProps<'img'> & { isActive?: boolean };
export type AvatarSizeType = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

type AvatarComponentProps = {
  [key in AvatarSizeType]: (props: AvatarProps) => ReactNode;
};

const AvatarSize: { size: AvatarSizeType; defaultClassName: string }[] = [
  {
    size: 'XS',
    defaultClassName: 'size-10',
  },
  {
    size: 'S',
    defaultClassName: 'size-11',
  },
  {
    size: 'M',
    defaultClassName: 'size-12',
  },
  {
    size: 'L',
    defaultClassName: 'size-[3.75rem]',
  },
  {
    size: 'XL',
    defaultClassName: 'size-[4.5rem]',
  },
  {
    size: 'XXL',
    defaultClassName: 'size-24',
  },
  {
    size: 'XXXL',
    defaultClassName: 'size-32',
  },
];

const Avatar = {} as AvatarComponentProps;
AvatarSize.forEach(({ size, defaultClassName }) => {
  Avatar[size] = ({
    className,
    isActive = false,
    src,
    ...others
  }: AvatarProps) =>
    React.createElement('img', {
      className: cn(
        'shadow-avatar shrink-0 cursor-pointer rounded-full',
        className,
        defaultClassName,
        isActive && 'shadow-avatar-active',
      ),
      src: src?.startsWith('images/avatar/')
        ? `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/avatar/${src}`
        : `${src}`,
      ...others,
    });
});
export default Avatar;
