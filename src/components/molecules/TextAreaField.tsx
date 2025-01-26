import { FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

import Container from '@/components/atoms/Container';
import TextArea, { TextAreaProps } from '@/components/atoms/TextArea';
import Label from '@/components/atoms/Label';
import Typography from '@/components/atoms/Typography';

// ! TODO: state연계시 controller 비 연계시 controller제거

export type TextAreaFieldProps<T extends FieldValues> = TextAreaProps & {
  value: string | number;
  name: keyof T;
  labelName?: string;
  options?: RegisterOptions;
  containerStyle?: string;
  textAreaStyle?: string;
  defaultValue?: string;
};

export default function TextAreaField<T extends FieldValues>(
  props: TextAreaFieldProps<T>,
) {
  const {
    labelName,
    name,
    containerStyle,
    textAreaStyle,
    placeholder,
    options,
    value,
    defaultValue,
    onKeyDown,
  } = props;

  const { register, formState } = useFormContext();

  return (
    <Container className={containerStyle}>
      <Label>{labelName}</Label>
      <TextArea
        className={textAreaStyle}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        value={value}
        defaultValue={defaultValue}
        {...register(name, options)}
      />
      <Typography.Span2
        className={`${!formState.errors[name]?.message && 'invisible'} mt-[8px] block text-point`}
      >
        {formState.errors[name]?.message as string}
      </Typography.Span2>
    </Container>
  );
}

TextAreaField.defaultProps = {
  containerStyle: '',
  textAreaStyle: '',
  options: {},
  labelName: '',
  defaultValue: '',
};
