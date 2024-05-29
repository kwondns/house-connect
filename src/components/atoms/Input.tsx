import { ComponentProps, forwardRef, HTMLProps } from 'react';

export type InputProps = ComponentProps<'input'>;
const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  (props, ref) => {
    const { className, type = 'text', ...others } = props;
    const inputBaseStyle =
      'block h-14 w-full rounded-lg border-[1px] border-solid border-brown p-[16px] focus:outline-none focus:ring-1 focus:ring-brown2 bg-transparent';
    return (
      <input
        type={type}
        className={`block h-14 w-full rounded-lg border-[1px] border-solid border-brown p-[16px] focus:outline-none focus:ring-1 focus:ring-brown2 ${className || ''}`}
        ref={ref}
        {...others}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
