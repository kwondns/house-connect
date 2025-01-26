import { ComponentProps } from 'react';

export type LabelProps = ComponentProps<'label'>;

export default function Label(props: LabelProps) {
  const { htmlFor, className, children, ...other } = props;
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-P3 text-brown1 ${className}`}
      {...other}
    >
      {children}
    </label>
  );
}
