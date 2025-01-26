import { ComponentProps, forwardRef, HTMLProps } from 'react';

export type InputProps = ComponentProps<'input'>;
const Input = forwardRef<HTMLInputElement, HTMLProps<HTMLInputElement>>(
  (props, ref) => {
    const { className, type = 'text', ...other } = props;
    const inputBaseStyle =
      'block h-14 rounded-lg border-[1px] border-solid border-brown p-[16px] placeholder:text-brown3 focus:outline-none focus:ring-1 focus:ring-point focus:border-point ring-subColor2 bg-transparent';
    return (
      <input
        type={type}
        className={`${inputBaseStyle} ${className || ''}`}
        ref={ref}
        {...other}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
