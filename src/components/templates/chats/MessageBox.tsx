import { ComponentProps } from 'react';

import Typography from '@/components/atoms/Typography';
import cn from '@/libs/cn';

type MessageBoxProps = ComponentProps<'div'> & {
  isChatPartner?: boolean;
};

export default function MessageBox({
  children,
  className,
  isChatPartner = false,
}: MessageBoxProps) {
  return (
    <Typography.Span1
      className={cn(
        'w-fit rounded-xl bg-brown6 px-4 py-2 leading-150 text-brown',
        isChatPartner && 'bg-brown text-white',
        className,
      )}
    >
      {children}
    </Typography.Span1>
  );
}

MessageBox.defaultProps = {
  isChatPartner: false,
};
