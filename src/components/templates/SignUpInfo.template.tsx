import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import Button from '@/components/atoms/Button';
import FormItem from '@/components/molecules/FormItem';
import { SignUpInfo, SignUpInfoType } from '@/types/auth.type';
import { useUpdateUserInfo } from '@/hooks/useSign';

function Dash() {
  return <div className="mt-3 h-[1px] w-[0.5625rem] bg-brown" />;
}
function Dot() {
  return <div className="size-1 rounded-full bg-brown" />;
}

export default function SignUpInfoTemplate() {
  const Form = FormProvider;
  const form = useForm<SignUpInfoType>({
    resolver: zodResolver(SignUpInfo),
  });
  const { updateUserInfo, isPending } = useUpdateUserInfo();
  const onSubmit = (data: SignUpInfoType) => {
    const { gender, ...others } = data;
    updateUserInfo({ ...others, gender: gender === 1 || gender === 3 ? 1 : 2 });
  };
  useEffect(() => {
    const { errors } = form.formState;
    if (errors.birth) {
      form.clearErrors('gender');
    } else if (errors.gender) {
      form.setError('birth', errors.gender);
      form.clearErrors('gender');
    }
  }, [form.formState.errors]);

  return (
    <Container.FlexCol className="min-w-full flex-1 gap-[3.25rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Container.FlexCol className="gap-[1.625rem]">
            <FormItem.TextField
              labelName="이름"
              type="text"
              name="name"
              placeholder="이름 입력"
              inputStyle="mt-[1rem] w-full"
            />
            <Container.FlexRow className="items-center gap-[1rem]">
              <FormItem.TextField
                labelName="주민등록번호"
                type="text"
                name="birth"
                placeholder="990101"
                inputStyle="mt-[1rem]"
                disabled={isPending}
              />
              <Dash />
              <FormItem.TextField
                type="text"
                name="gender"
                placeholder="2"
                inputStyle="w-[2.5625rem] mt-[2rem] placeholder:text-[0.9375rem]"
                containerStyle=""
                disabled={isPending}
              />
              <Container.FlexRow className="gap-x-[0.75rem] pt-3">
                {Array.from({ length: 6 }).map(() => (
                  // eslint-disable-next-line react/jsx-key
                  <Dot />
                ))}
              </Container.FlexRow>
            </Container.FlexRow>
          </Container.FlexCol>
          <Button.Fill
            type="submit"
            className="mt-[2.5rem] w-full rounded-[10px] py-[0.25rem]"
            disabled={isPending}
          >
            <Typography.P3 className="mx-auto my-[1rem] text-[#F4E7DB]">
              완료
            </Typography.P3>
          </Button.Fill>
        </form>
      </Form>
    </Container.FlexCol>
  );
}
