import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

import Container from '@/components/atoms/Container';
import Input, { InputProps } from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Typography from '@/components/atoms/Typography';

export type TextFieldProps<T extends FieldValues> = InputProps & {
  name: keyof T;
  labelName?: string;
  options?: RegisterOptions;
  activeWatch?: boolean;
  containerStyle?: string;
  inputStyle?: string;
};

export default function TextField<T extends FieldValues>(
  props: TextFieldProps<T>,
) {
  const {
    labelName,
    type,
    name,
    containerStyle,
    inputStyle,
    placeholder,
    options,
    onKeyDown,
  } = props;

  const { register, formState } = useFormContext();

  return (
    <Container className={containerStyle}>
      <Label>{labelName}</Label>
      <Input
        type={type}
        className={inputStyle}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        {...register(name, options)}
      />
      <Typography.Span2
        className={`${!formState.errors[name]?.message && 'invisible h-3'} mt-[8px] block text-point`}
      >
        {formState.errors[name]?.message as string}
      </Typography.Span2>
    </Container>
  );
}

TextField.defaultProps = {
  containerStyle: '',
  inputStyle: '',
  options: {},
  labelName: '',
  activeWatch: false,
};
