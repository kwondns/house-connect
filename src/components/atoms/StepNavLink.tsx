import { ComponentProps } from 'react';

import cn from '@/libs/cn';
import Typography from '@/components/atoms/Typography';
import Button from '@/components/atoms/Button';

type StepProps = ComponentProps<'div'> & {
  isActive?: boolean;
  className?: string;
};

function Step({ isActive, className }: StepProps) {
  // ! 이것도 저번에 공부해서 얻은 stacking context와 관련있음.
  // ! 이번에는 link의 after보다 상위로 stacking context를 생성하여 line이 보이지 않게하기 위해
  // ! flex container내 z-index를 가지면 새로운 stacking context를 생성할 수 있으므로
  // ! z-10을 주어 해결함.
  const baseStyle = 'size-[7px] rounded-full z-10';

  return (
    <div
      className={cn(baseStyle, isActive ? 'bg-brown' : 'bg-brown2', className)}
    />
  );
}

Step.defaultProps = {
  isActive: false,
  className: '',
};

export type StepNavLinkProps = {
  isActive?: boolean;
  labelName: string;
  onClick?: () => void;
};

export default function StepNavLink({
  labelName,
  isActive,
  onClick,
  ...others
}: StepNavLinkProps) {
  const baseStyle = 'relative flex items-center gap-7 text-brown2 py-[11px]';

  return (
    <Button.Ghost
      className={`${baseStyle}
        
      [&:not(:first-of-type)]:after:absolute [&:not(:first-of-type)]:after:-top-1/2 [&:not(:first-of-type)]:after:left-[3px] [&:not(:first-of-type)]:after:h-full [&:not(:first-of-type)]:after:w-[1px] [&:not(:first-of-type)]:after:bg-brown2
      `}
      onClick={onClick}
      {...others}
    >
      <Step isActive={isActive} />
      <Typography.Span1 className={cn(isActive && 'text-brown')}>
        {labelName}
      </Typography.Span1>
    </Button.Ghost>
  );
}

StepNavLink.defaultProps = {
  isActive: false,
  onClick: () => {},
};
