const CHAT_KEYS = {
  ALL: ['chat'] as const,
  LIST: ({userId}:{userId: string | undefined}) =>
    [...CHAT_KEYS.ALL, 'list', { userId }] as const,
  LIST_INFO: ({
    userId,
    chatPartnerId,
  }: {
    userId: string | undefined;
    chatPartnerId: string | undefined;
  }) => [...CHAT_KEYS.ALL, 'listInfo', { userId, chatPartnerId }] as const,
};

const MESSAGE_KEYS = {
  ALL: ['message'] as const,
  CHAT_ROOM: ({ chatRoomId }: { chatRoomId: string | undefined }) => [
    ...MESSAGE_KEYS.ALL,
    { chatRoomId },
  ],
};

export { CHAT_KEYS, MESSAGE_KEYS };
