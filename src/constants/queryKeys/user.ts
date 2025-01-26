const USER_KEYS = {
  ALL: ['user'] as const,
  USER_LIFESTYLE: (userId: string) =>
    [...USER_KEYS.ALL, 'lifeSTyle', { id: userId }] as const,
  USER_MATE_STYLE: (userId: string) =>
    [...USER_KEYS.ALL, 'mateStyle', { id: userId }] as const,
  USER_INFO: (userId: string | undefined) =>
    [...USER_KEYS.ALL, 'info', userId] as const,
  USER_BOOKMARK: (userId: string | undefined, page: number, filter: string) =>
    [...USER_KEYS.ALL, 'bookmark', 'list', userId, page, filter] as const,
  USER_BOOKMARK_HOUSE_COUNT: (userId: string | undefined, filter: string) =>
    [...USER_KEYS.ALL, 'bookmark', 'house', 'count', userId, filter] as const,
};

export default USER_KEYS;
