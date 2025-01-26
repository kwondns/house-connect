import { useRecoilValue } from 'recoil';

import Container from '@/components/atoms/Container';
import CommentItem from '@/components/molecules/CommentItem';
import { UserAtom } from '@/stores/auth.store';
import { CommentType } from '@/types/houseComment.type';
import { UserType } from '@/types/auth.type';

type CommentProps = {
  comment: CommentType;
};

function CommentReplyList({ comment }: CommentProps) {
  const { id, content, created_at, updated_at, user_id, user, house_reply } =
    comment;
  const isUser = useRecoilValue(UserAtom);

  return (
    <>
      <CommentItem
        id={id}
        content={content}
        created_at={created_at}
        updated_at={updated_at}
        nickname={user.nickname}
        avatar={user.avatar}
        isReply={false}
        isOwner={user_id === isUser?.id}
        user={isUser as UserType}
      />
      <Container className="pl-[4.75rem]">
        {house_reply.map(reply => (
          <CommentItem
            key={reply.id}
            id={reply.id}
            topId={id}
            content={reply.content}
            created_at={reply.created_at}
            updated_at={reply.updated_at}
            nickname={reply.user.nickname}
            avatar={reply.user.avatar}
            isReply
            isOwner={reply.user_id === isUser?.id}
            user={isUser as UserType}
          />
        ))}
      </Container>
    </>
  );
}

export default CommentReplyList;
