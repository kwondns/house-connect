import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import TextField, { TextFieldProps } from '@/components/molecules/TextField';
import Input from '@/components/atoms/Input';
import TextAreaField, {
  TextAreaFieldProps,
} from '@/components/molecules/TextAreaField';
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

// // ! controller로 감쌀 필요가 없이 register
// FormItem.TextArea = function FormItemTextArea<T extends FieldValues>(
//   props: TextAreaFieldProps<T>,
// ) {};

// FormItem.TextAreaWithState => controller로 감싸고(control을 이용하는 것 )
FormItem.TextAreaField = function FormItemTextAreaField<T extends FieldValues>(
  // eslint-disable-next-line react/require-default-props
  props: TextAreaFieldProps<T> & { isControlled?: boolean },
) {
  const { control, getValues } = useFormContext();
  const {
    defaultValue,
    name,
    labelName,
    options,
    containerStyle,
    textAreaStyle,
    isControlled = false,
  } = props;
  const fieldValue = getValues(name as string) || defaultValue;

  return isControlled ? (
    <Controller
      name={name}
      control={control}
      defaultValue={fieldValue}
      rules={options}
      render={({ field }) => (
        <TextAreaField
          {...field}
          containerStyle={containerStyle}
          labelName={labelName}
          className={textAreaStyle}
        />
      )}
    />
  ) : (
    <TextAreaField />
  );
};
