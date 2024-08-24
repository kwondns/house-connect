import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { KeyboardEvent, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';

import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import { UserAtom } from '@/stores/auth.store';
import { Tables } from '@/types/supabase';
import Avatar from '@/components/atoms/Avatar';
import IconButton from '@/components/molecules/IconButton';
import Input from '@/components/atoms/Input';
import DateMessageBox from '@/components/templates/chats/DateMessageBox';
import UserMessageBox from '@/components/templates/chats/UserMessageBox';
import {
  useGetMessagesGroupByDate,
  useOpenChatChannel,
  useScrollToBottom,
  useSendMessage,
  useUpdateLastRead,
} from '@/hooks/useChat';
import { MessageType } from '@/types/chat.type';
import { CHAT_KEYS } from '@/constants/queryKeys';
import { MESSAGE_KEYS } from '@/constants/queryKeys/chat';

export default function ChatRoom() {
  const params = useParams<{ chatRoomId: string }>();
  const chatRoomId = params.chatRoomId as string;
  const queryClient = useQueryClient();
  const userInfo = useRecoilValue(UserAtom);
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const chatsContainerRef = useRef<HTMLDivElement>(null);
  const chatPartnerId = location.state.chatPartnerId as string;
  const lastReadMutation = useUpdateLastRead();
  const sendMessageMutation = useSendMessage();
  const { chatPartnerInfo } = queryClient.getQueryData(
    CHAT_KEYS.LIST_INFO({ userId: userInfo?.id, chatPartnerId }),
  ) as {
    newChatCount: number;
    chatPartnerInfo: Tables<'user'>;
  };
  const dateMessages = useGetMessagesGroupByDate(chatRoomId);

  useOpenChatChannel<MessageType>({
    channelName: `chat_room_messages:${chatRoomId}`, // ? channel에 '/'가 들어가면 정상작동하지 않음...
    realtimeEventFilters: [
      {
        filterOption: {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        callbackFn: () => {
          queryClient.invalidateQueries({
            queryKey: MESSAGE_KEYS.ALL,
          });
        },
      },
    ],
    useEffectDependencies: [chatRoomId, queryClient],
  });

  useScrollToBottom(chatsContainerRef, [dateMessages]);

  const sendMessage = async (messageContent: string) => {
    const messageCreatedAt = JSON.stringify(new Date());

    sendMessageMutation.mutate({
      content: messageContent,
      chatRoomId,
      sendBy: userInfo?.id as string,
      createdAt: messageCreatedAt,
    });

    const lastReadDate = JSON.stringify(new Date());

    lastReadMutation.mutate({
      userId: userInfo?.id as string,
      chatRoomId,
      lastReadDate,
    });
  };

  const onClickSendMessage = async () => {
    if (inputRef.current) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  const onEnterSendMessage = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && inputRef.current) {
      sendMessage(e.currentTarget.value);
      inputRef.current.value = '';
    }
  };

  return (
    <Container.FlexCol className="size-full min-h-full">
      {/* chat room header */}
      <Container.FlexRow className="sticky left-0 top-0 min-h-[4.875rem] items-center gap-4 bg-brown6 px-6">
        <IconButton.Ghost
          iconType="prev"
          className="mr-[0.625rem] h-[1.25rem] w-[0.75rem] cursor-pointer laptop:hidden"
          onClick={() => navigate(-1)}
        />
        <Avatar.XS src={chatPartnerInfo.avatar ?? ''} />
        <Container.FlexCol>
          <Typography.SubTitle3 className="font-bold leading-150 text-brown">
            {chatPartnerInfo.nickname}
          </Typography.SubTitle3>
          <Container.FlexRow className="items-center gap-1">
            <div className="size-[0.625rem] animate-pulse rounded-full bg-teal-400" />
            <Typography.Span2 className="text-[0.625rem] leading-150 text-brown/60">
              활동중
            </Typography.Span2>
          </Container.FlexRow>
        </Container.FlexCol>
      </Container.FlexRow>
      {/* chats area */}
      <Container.FlexCol
        ref={chatsContainerRef}
        className="h-full gap-8 overflow-y-auto p-6"
      >
        {/* TODO: react query를 이용해서 loading일 때는 대체 처리 하기 */}
        {dateMessages?.map(dateMessage => (
          <DateMessageBox
            key={dateMessage.date.toString()}
            date={dateMessage.date}
          >
            {dateMessage.userMessages.map(userMessage => (
              <UserMessageBox
                key={userMessage.userId + userMessage.lastCreatedAt.toString()}
                chatPartnerInfo={chatPartnerInfo}
                userMessage={userMessage}
              />
            ))}
          </DateMessageBox>
        ))}
      </Container.FlexCol>
      {/* Chat Input UI */}
      <Container.FlexRow className="gap-6 px-6 py-9">
        <Container.FlexRow className="w-6 items-center justify-center">
          <IconButton iconType="paper-clip" button="Ghost" />
        </Container.FlexRow>
        <div className="relative w-full">
          <Input
            ref={inputRef}
            className="w-full"
            placeholder="메세지를 입력해주세요"
            onKeyDown={onEnterSendMessage}
          />
          <IconButton
            iconType="send"
            button="Ghost"
            className="absolute right-5 top-1/2 -translate-y-1/2"
            onClick={onClickSendMessage}
          />
        </div>
      </Container.FlexRow>
    </Container.FlexCol>
  );
}
