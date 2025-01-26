/* eslint-disable react/function-component-definition */
import { ComponentProps, FC } from 'react';

import cn from '@/libs/cn';

// ! lint error => propType "type" is not required, but has no corresponding defaultProps declaration
// ! solve => assign DividerRow as DividerProps and define the DividerRow defaultProps
type DividerProps = ComponentProps<'div'> & {
  type?: 'thin' | 'medium' | 'thick';
};

const thickNess = {
  thin: 'border-[0.5px]', // width: 1px
  medium: 'border-[1px]', // width: 2px
  thick: 'border-[1.5px]', // width: 3px
};

const commonStyle = 'border-brown/60';

export default function Divider() {
  return {};
}

const DividerCol: FC<DividerProps> = ({
  type = 'thin',
  children,
  className = '',
  ...props
}) => (
  <div className={cn(commonStyle, thickNess[type], className)} {...props} />
);

const DividerRow: FC<DividerProps> = ({
  type = 'thin',
  children,
  className = '',
  ...props
}) => (
  <div
    className={cn(
      'relative',
      children && 'w-full',
      commonStyle,
      thickNess[type],
      className,
    )}
    {...props}
  >
    {children && (
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg px-[0.875rem] text-[0.9375rem] font-normal text-brown">
        {children}
      </span>
    )}
  </div>
);

DividerRow.defaultProps = { type: 'thin' };
DividerCol.defaultProps = { type: 'thin' };

Divider.Row = DividerRow;
Divider.Col = DividerCol;
