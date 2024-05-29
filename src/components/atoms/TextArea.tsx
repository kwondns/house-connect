import { ComponentProps, forwardRef, HTMLProps } from 'react';

import cn from '@/libs/cn';

export type TextAreaProps = ComponentProps<'textarea'>;

const TextArea = forwardRef<
  HTMLTextAreaElement,
  HTMLProps<HTMLTextAreaElement>
>((props, ref) => {
  const { className, rows, ...others } = props;
  const textAreaBaseStyle =
    'resize-none block w-full rounded-lg border-[1px] border-solid border-brown p-[16px] placeholder:text-brown2 focus:outline-none focus:ring-1 focus:ring-brown2 focus:border-none bg-transparent';
  // console.log('value in textarea', value);
  console.log('rendering....');

  return (
    <textarea
      className={cn(textAreaBaseStyle, className || '')}
      ref={ref}
      rows={rows}
      {...others}
    />
  );
});

// ? forwardRef와 연계할 때 react devtool또는 개발도구에서 이름이 제대로 표시되어 디버깅이 편리한 이점이 있다.
TextArea.displayName = 'TextArea';

export default TextArea;
