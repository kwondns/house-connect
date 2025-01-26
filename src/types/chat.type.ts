/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  RealtimePostgresChangesFilter,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';

import { Tables } from '@/types/supabase';

export type MessageType = Tables<'messages'>;
export type UserMessageType = {
  userId: string;
  messages: Tables<'messages'>[];
  lastCreatedAt: Date;
};

export type PostgresChangeFilterOption =
  RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`>;

export type PostgresChangeCallback<Payload extends { [key: string]: any }> = (
  // eslint-disable-next-line no-unused-vars
  payload: RealtimePostgresChangesPayload<Payload>,
) => void;

export type OpenChannelProps<Payload extends { [key: string]: string }> = {
  channelName: string;
  realtimeEventFilters: {
    filterOption: PostgresChangeFilterOption;
    callbackFn: PostgresChangeCallback<Payload>;
  }[];
  useEffectDependencies: unknown[];
};
