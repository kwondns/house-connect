import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { supabase } from '@/libs/supabaseClient';
import { createToast, errorToast, successToast } from '@/libs/toast';
import { UserType } from '@/types/auth.type';
import HOUSE_KEYS from '@/constants/queryKeys/house';

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
        queryKey: HOUSE_KEYS.HOUSE_DETAIL_BOOKMARK(
          variables.id,
          variables.houseId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: HOUSE_KEYS.HOUSE_DETAIL(variables.houseId),
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
export const removeStorage = async (houseId: string, userId: string) => {
  const { data, error } = await supabase.storage
    .from('images')
    .list(`house/${userId}/${houseId}`, {
      limit: 10,
      offset: 0,
    });
  if (error) throw new Error(error.message);
  if (data) {
    data.forEach(async imgObj => {
      const imgName = imgObj.name;
      const { error: removeError } = await supabase.storage
        .from('images')
        .remove([`house/${userId}/${houseId}/${imgName}`]);
      if (removeError) throw new Error(removeError.message);
    });
  }
};

export const useDeleteHouseDetail = () => {
  const navigate = useNavigate();
  const { mutate: deleteHouseDetailPage } = useMutation({
    mutationFn: async (houseId: string) => {
      const { error } = await supabase.from('house').delete().eq('id', houseId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onMutate: () =>
      createToast('deleteHouseDetailPage', '하우스 디테일 페이지 삭제 중...'),
    onError: () =>
      errorToast(
        'deleteHouseDetailPage',
        '하우스 디테일 페이지 삭제에 실패했습니다.',
      ),
    onSuccess: () => {
      successToast(
        'deleteHouseDetailPage',
        '하우스 디테일 페이지가 삭제되었습니다.',
      );
      navigate('/house');
    },
  });
  return { deleteHouseDetailPage };
};

export const houseDetailQuery = (houseId: string | undefined) =>
  queryOptions({
    queryKey: HOUSE_KEYS.HOUSE_DETAIL(houseId),
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
    queryKey: HOUSE_KEYS.HOUSE_DETAIL_BOOKMARK(user?.id, houseId),
    queryFn: async () =>
      supabase
        .from('user_bookmark')
        .select('*')
        .eq('id', user?.id ?? '')
        .eq('house_id', houseId ?? '')
        .single(),
    enabled: !!user && !!houseId,
  });
