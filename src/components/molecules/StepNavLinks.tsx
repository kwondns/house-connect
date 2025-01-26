import { ComponentProps } from 'react';

import Container from '@/components/atoms/Container';
import StepNavLink, { StepNavLinkProps } from '@/components/atoms/StepNavLink';
import cn from '@/libs/cn';

type Props = ComponentProps<'div'> & {
  contents: StepNavLinkProps[];
};

export default function StepNavLinks({ contents, className }: Props) {
  return (
    <Container.FlexCol
      className={cn('relative w-fit justify-between', className)}
    >
      {contents.map(({ labelName, isActive, onClick }) => (
        <StepNavLink
          key={labelName}
          labelName={labelName}
          isActive={isActive}
          onClick={onClick}
        />
      ))}
    </Container.FlexCol>
  );
}
