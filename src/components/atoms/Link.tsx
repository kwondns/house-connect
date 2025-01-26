import { Link as RouterLink, LinkProps } from 'react-router-dom';

import cn from '@/libs/cn';

export default function Link(props: LinkProps) {
  const { children, className, ...others } = props;
  return (
    <RouterLink className={cn(`text-brown ${className}`)} {...others}>
      {children}
    </RouterLink>
  );
}
