import { infiniteQueryOptions, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createToast, errorToast, successToast } from '@/libs/toast';
import { supabase } from '@/libs/supabaseClient';
import { HouseFormType } from '@/types/house.type';

// 삭제할 storage directory(temporary || post)의 이미지를 가져와 삭제하는 함수
export const emptyStorage = async (userId: string, directory: string) => {
  try {
    const storagePath = `house/${userId}/${directory}`;
    const { data: imageList, error } = await supabase.storage
      .from('images')
      .list(storagePath, {
        limit: 1000,
        offset: 0,
      });
    if (error) throw new Error(`emptyError : ${error.message}`);
    if (imageList) {
      imageList.forEach(async imgObj => {
        const imgName = imgObj.name;
        const { error: removeError } = await supabase.storage
          .from('images')
          .remove([`${storagePath}/${imgName}`]);
        if (removeError) throw new Error(`emptyError: ${removeError.message}`);
      });
    }
  } catch (error) {
    createToast(
      'emptyError',
      `이미지 저장 중 문제가 발생했습니다. 고객센터에 문의해주세요.`,
      {
        type: 'error',
        autoClose: 3000,
        isLoading: false,
      },
    );
  }
};

// temporary storage 내 이미지 중 post내 업로드 될 이미지만 postId storage로 이동하는 함수
const moveImageStorage = async (
  userId: string,
  images: string[],
  postId: string,
) => {
  try {
    images.forEach(async imgName => {
      const { data, error } = await supabase.storage
        .from('images')
        .move(
          `house/${userId}/temporary/${imgName}`,
          `house/${userId}/${postId}/${imgName}`,
        );
      if (error) throw new Error(`moveImageError: ${error.message}`);

      if (data) {
        emptyStorage(userId, 'temporary');
      }
    });
  } catch (error) {
    createToast(
      'moveImageError',
      `이미지 저장 중 문제가 발생했습니다. 고객센터에 문의해주세요.`,
      {
        type: 'error',
        autoClose: 3000,
        isLoading: false,
      },
    );
  }
};

export const useHouseRegist = () => {
  const navigate = useNavigate();
  const { mutate: registHouse, isPending: isRegistHouse } = useMutation({
    mutationFn: async (houseData: HouseFormType) => {
      const { data: insertedData, error } = await supabase
        .from('house')
        .insert(houseData)
        .select('id');

      if (error) throw new Error(`houseUploadError: ${error.message}`);
      const postId = insertedData[0].id;
      return postId;
    },
    onMutate: () => createToast('uploadHousePost', '게시글 업로드 중'),
    onError: error => errorToast('uploadHousePost', error.message),
    onSuccess: async (postId, variables) => {
      const { user_id, house_img, representative_img } = variables;
      const images = house_img.concat(representative_img);
      await moveImageStorage(user_id, images, postId);
      successToast('uploadHousePost', '포스트 저장 성공!');
      navigate('/');
    },
  });
  return { registHouse, isRegistHouse };
};

export const useHouseList = () =>
  infiniteQueryOptions({
    queryKey: ['house', 'list', 'recent'],
    queryFn: async ({ pageParam }) =>
      supabase
        .from('house')
        .select(
          'id, representative_img, region, house_appeal, house_type, rental_type, region, district, term, deposit_price, monthly_price, user_id',
          { count: 'exact' },
        )
        // 임시 저장 제외
        .eq('temporary', 1)
        .range(pageParam * 12, (pageParam + 1) * 11),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam, _allPageParams) =>
      (lastPage.count as number) - (lastPageParam + 1) * 12 > 0
        ? lastPageParam + 1
        : undefined,
  });
