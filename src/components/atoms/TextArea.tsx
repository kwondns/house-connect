import { ComponentProps, forwardRef, HTMLProps } from 'react';

import cn from '@/libs/cn';

export type TextAreaProps = ComponentProps<'textarea'>;
const TextArea = forwardRef<
  HTMLTextAreaElement,
  HTMLProps<HTMLTextAreaElement>
>((props, ref) => {
  const { className, ...other } = props;
  const textAreaBaseStyle =
    'block w-full rounded-lg border-[1px] border-solid border-brown p-[16px] placeholder:text-brown2 focus:outline-none focus:ring-1 focus:ring-brown2 focus:border-none bg-transparent';

  return (
    <textarea
      className={cn(textAreaBaseStyle, className || '')}
      ref={ref}
      {...other}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
