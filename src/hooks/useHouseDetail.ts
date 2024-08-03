import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { supabase } from '@/libs/supabaseClient';
import { createToast } from '@/libs/toast';
import { UserType } from '@/types/auth.type';

type BookMark = {
  id: string;
  houseId: string;
  isBookMark: boolean;
};

export const useUpdateBookMark = () => {
  const queryClient = useQueryClient();
  const { mutate: updateBookMark, isPending } = useMutation({
    mutationFn: async (payload: BookMark) => {
      if (payload.isBookMark) {
        const { error: deleteError } = await supabase
          .from('user_bookmark')
          .delete()
          .eq('id', payload.id)
          .eq('house_id', payload.houseId);
        if (deleteError) {
          throw new Error(deleteError.message);
        }
      } else {
        const { error: insertError } = await supabase
          .from('user_bookmark')
          .insert([{ id: payload.id, house_id: payload.houseId }])
          .select('*');
        if (insertError) {
          throw new Error(insertError.message);
        }
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['house_bookmark', variables.id, variables.houseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['house', 'detail', variables.houseId],
      });

      if (variables.isBookMark) {
        createToast('cancel_bookmark', '북마크 해제 되었습니다.', {
          isLoading: false,
          type: 'info',
          autoClose: 1000,
        });
      } else {
        createToast('add_bookmark', '북마크에 추가 되었습니다!', {
          isLoading: false,
          type: 'success',
          autoClose: 1000,
        });
      }
    },
    onError: error => {
      createToast('error_bookmark', error.message, {
        isLoading: false,
        type: 'error',
        autoClose: 1000,
      });
    },
  });
  return { updateBookMark, isPending };
};

export const houseDetailQuery = (houseId: string | undefined) =>
  queryOptions({
    queryKey: ['house', 'detail', houseId],
    queryFn: async () =>
      supabase
        .from('house')
        .select(
          `*, user(id, name, avatar, gender), user_lifestyle(smoking, pet, appeals), user_mate_style(mate_gender, mate_number, mate_appeals, prefer_mate_age)`,
        )
        .eq('id', houseId ?? '')
        .single(),
    enabled: !!houseId,
  });

export const useHouseBookMark = (
  user: UserType | null,
  houseId: string | undefined,
) =>
  queryOptions({
    queryKey: ['house_bookmark', user?.id, houseId],
    queryFn: async () =>
      supabase
        .from('user_bookmark')
        .select('*')
        .eq('id', user?.id ?? '')
        .eq('house_id', houseId ?? '')
        .single(),
    enabled: !!user && !!houseId,
  });
