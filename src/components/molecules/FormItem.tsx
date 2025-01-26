import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import TextField, { TextFieldProps } from '@/components/molecules/TextField';
import Input from '@/components/atoms/Input';
import Container from '@/components/atoms/Container';
import IconButton from './IconButton';

export default function FormItem() {}

FormItem.TextField = function FormItemTextField<T extends FieldValues>(
  props: TextFieldProps<T>,
) {
  const { type, labelName, name, options, ...others } = props;
  return (
    <TextField
      options={options}
      labelName={labelName}
      name={name}
      type={type}
      {...others}
    />
  );
};

FormItem.Password = function FormItemPassword<T extends FieldValues>(
  props: TextFieldProps<T> & {
    isVisible: boolean;
    onClickVisible: () => void;
  },
) {
  const { type, labelName, name, isVisible, onClickVisible, ...others } = props;
  return (
    <Container className="relative">
      <TextField
        name={name}
        labelName={labelName}
        type={isVisible ? 'text' : 'password'}
        {...others}
      />
      <IconButton.Ghost
        tabIndex={-1}
        className={`absolute bottom-[44px] right-[13px] ${labelName ? 'top-[53px]' : 'top-[30px]'}`}
        iconType={isVisible ? 'visible' : 'invisible'}
        onClick={onClickVisible}
      />
    </Container>
  );
};

FormItem.Hidden = function FormItemHidden<T extends FieldValues>(
  props: TextFieldProps<T> & { valueProp: T[keyof T] },
) {
  const { defaultValue, name, valueProp, options = {} } = props;
  const { control, setValue } = useFormContext();

  useEffect(() => {
    setValue(name, valueProp);
  }, [valueProp, name, setValue]);

  if (name)
    return (
      <Controller
        name={name}
        control={control}
        // ! defaultValue type맞추기 어려워 any로 타입 우회
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        defaultValue={defaultValue ?? ('' as any)}
        rules={options}
        render={({ field }) => <Input type="hidden" {...field} />}
      />
    );

  return <span>Name 속성이 필요합니다</span>;
};
