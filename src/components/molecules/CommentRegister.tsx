/* eslint-disable react/require-default-props */
import { useRecoilValue } from 'recoil';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import TextArea from '@/components/atoms/TextArea';
import Typography from '@/components/atoms/Typography';
import { UserAtom } from '@/stores/auth.store';
import { useComment, useReply } from '@/hooks/useCommentReply';
import { CommentForm, CommentFormType } from '@/types/houseComment.type';

type CommentRegisterProps = {
  nickName?: string;
  content?: string;
  methodType: 'insert' | 'update';
  topId?: string;
  id?: string;
  isReply: boolean;
  onCloseRegister?: () => void;
};

function CommentRegister(props: CommentRegisterProps) {
  const {
    nickName,
    content,
    methodType,
    topId,
    id,
    isReply,
    onCloseRegister = () => null,
  } = props;
  const user = useRecoilValue(UserAtom);
  const { updateComment, commentPending } = useComment();
  const { updateReply, replyPending } = useReply();
  const form = useForm<CommentFormType>({ resolver: zodResolver(CommentForm) });

  const onClickComment = (data: CommentFormType) => {
    if (!isReply) {
      updateComment(
        {
          methodType,
          content: data.content,
          topId,
          userId: user?.id as string,
          id,
        },
        {
          onSuccess: () => {
            form.reset();
            onCloseRegister();
          },
        },
      );
    } else {
      updateReply(
        {
          methodType,
          content: data.content,
          topId,
          userId: user?.id as string,
          id,
        },
        {
          onSuccess: () => {
            form.reset();
            onCloseRegister();
          },
        },
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onClickComment)}>
        <Container.FlexCol
          className={`relative items-center gap-8 laptop:items-end  ${nickName ? 'bg-brown4 p-6' : ''}`}
        >
          <TextArea
            type="text"
            className={`min-h-[11.5625rem] overflow-auto p-6 leading-6 placeholder:text-P2 placeholder:text-brown3 ${nickName ? 'pt-[3.875rem]' : ''}`}
            placeholder={
              nickName ? '답글을 작성해주세요.' : '댓글을 남겨보세요.'
            }
            rows={5}
            defaultValue={content ?? ''}
            {...form.register('content')}
            disabled={commentPending || replyPending}
          />
          {nickName && (
            <Typography.SubTitle2 className="absolute left-12 top-12 text-brown">
              {nickName}
            </Typography.SubTitle2>
          )}
          <Button.Fill
            disabled={commentPending || replyPending}
            type="submit"
            className="w-full justify-center rounded-lg py-4 text-white laptop:w-auto laptop:px-10 laptop:py-[1.125rem]"
          >
            <Typography.SubTitle3>등록</Typography.SubTitle3>
          </Button.Fill>
        </Container.FlexCol>
      </form>
    </FormProvider>
  );
}

export default CommentRegister;
