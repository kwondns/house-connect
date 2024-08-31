/* eslint-disable consistent-return */
import {
  infiniteQueryOptions,
  useMutation,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { FileObject } from '@supabase/storage-js';
import { useNavigate } from 'react-router-dom';

import {
  createToast,
  errorToast,
  removeToast,
  successToast,
} from '@/libs/toast';
import { supabase } from '@/libs/supabaseClient';
import { HouseFormType, HouseListType } from '@/types/house.type';
import {
  UserLifeStyleType,
  UserMateStyleType,
} from '@/components/pages/HouseRegister';
import USER_KEYS from '@/constants/queryKeys/user';
import HOUSE_KEYS from '@/constants/queryKeys/house';

// fetch functions
export const fetchTemporaryHouseId = async (
  userId: string,
): Promise<{ id: string }> => {
  const TEMPORARY = 0;
  const { data, error } = await supabase
    .from('house')
    .select('id')
    .match({ user_id: userId, temporary: TEMPORARY });
  if (error)
    throw new Error(`임시저장된 글 확인에 실패했습니다.: ${error.message}`);
  return { id: data[0].id };
};

const fetchHousePost = async (houseId: string): Promise<HouseFormType> => {
  const { data, error } = await supabase
    .from('house')
    .select('*')
    .eq('id', houseId)
    .single();

  if (error) throw new Error(`게시글을 가져올 수 없습니다.: ${error.message}`);
  if (!data) {
    throw new Error(`게시글이 존재하지 않습니다.`);
  }

  return {
    bookmark: data.bookmark,
    deposit_price: data.deposit_price,
    describe: data.describe,
    district: data.district,
    floor: data.floor as 0 | 1 | 2,
    house_appeal: data.house_appeal,
    house_img: data.house_img,
    house_size: data.house_size,
    house_type: data.house_type as 0 | 1 | 2 | 3,
    manage_price: data.manage_price,
    monthly_price: data.monthly_price,
    post_title: data.post_title,
    region: data.region,
    rental_type: data.rental_type as 0 | 1 | 2 | 3,
    representative_img: data.representative_img,
    room_num: data.room_num,
    temporary: data.temporary as 0 | 1,
    term: data.term as HouseFormType['term'],
    user_id: data.user_id,
  };
};

const fetchUserLifeStyle = async (
  userId: string,
): Promise<UserLifeStyleType> => {
  const { data, error } = await supabase
    .from('user_lifestyle')
    .select('*')
    .eq('id', userId)
    .single();

  if (error)
    throw new Error(
      `사용자 프로필을 불러오는데 실패했습니다.: ${error.message}`,
    );
  return {
    smoking: data.smoking,
    pet: data.pet as 0 | 1 | 2,
    appeals: data.appeals || [],
  };
};

const fetchUserMateStyle = async (
  userId: string,
): Promise<UserMateStyleType> => {
  const { data, error } = await supabase
    .from('user_mate_style')
    .select('*')
    .eq('id', userId)
    .single();

  if (error)
    throw new Error(
      `사용자 프로필을 불러오는데 실패했습니다.: ${error.message}`,
    );
  return {
    mate_gender: data.mate_gender as 0 | 1 | 2,
    mate_number: data.mate_number as 0 | 1 | 2 | 3,
    mate_appeals: data.mate_appeals || [],
    prefer_mate_age:
      data.prefer_mate_age as UserMateStyleType['prefer_mate_age'],
  };
};

// react-query hooks
export const useFetchProfileData = (userId: string) => {
  const queryResults = useQueries({
    queries: [
      {
        queryKey: USER_KEYS.USER_LIFESTYLE(userId),
        queryFn: () => fetchUserLifeStyle(userId),
        enabled: !!userId,
      },
      {
        queryKey: USER_KEYS.USER_MATE_STYLE(userId),
        queryFn: () => fetchUserMateStyle(userId),
        enabled: !!userId,
      },
    ],
  });

  return {
    userLifeStyleQuery: queryResults[0] as UseQueryResult<
      UserLifeStyleType,
      Error
    >,
    userMateStyleQuery: queryResults[1] as UseQueryResult<
      UserMateStyleType,
      Error
    >,
  };
};

export const useFetchHouseData = (isEditMode: boolean, houseId: string) => {
  const houseQuery = useQuery<HouseFormType>({
    queryKey: HOUSE_KEYS.HOUSE_POST(houseId),
    queryFn: () => fetchHousePost(houseId),
    enabled: isEditMode && !!houseId,
  });
  return { houseQuery };
};

// storage 관련 함수
export const getStorageImage = async (
  storagePath: string,
): Promise<FileObject[] | undefined> => {
  const { data, error } = await supabase.storage
    .from('images')
    .list(storagePath, { limit: 1000, offset: 0 });
  if (error)
    throw new Error(`이미지를 가져오는데 실패했습니다: ${error.message}`);
  return data;
};

export const removeStorageFile = async (
  imageList: FileObject[],
  storagePath: string,
): Promise<void> => {
  const removePromises = imageList.map(imgObj =>
    supabase.storage.from('images').remove([`${storagePath}/${imgObj.name}`]),
  );
  const results = await Promise.all(removePromises);
  results.forEach(({ error }) => {
    if (error) throw new Error(`이미지 삭제에 실패했습니다: ${error.message}`);
  });
};

const moveImageStorage = async (
  images: string[],
  toStoragePath: string,
  fromStoragePath: string,
): Promise<boolean> => {
  const movePromises = images.map(imgName =>
    supabase.storage
      .from('images')
      .move(`${toStoragePath}/${imgName}`, `${fromStoragePath}/${imgName}`),
  );
  const results = await Promise.all(movePromises);
  results.forEach(({ error }, index) => {
    if (error)
      throw new Error(
        `이미지 ${images[index]} 이동에 실패했습니다: ${error.message}`,
      );
  });
  return true;
};

const saveImageStorage = async (
  userId: string,
  images: string[],
  postId: string,
): Promise<void> => {
  const postStoragePath = `house/${userId}/${postId}`;
  const tempStoragePath = `house/${userId}/temporary`;
  const moved = await moveImageStorage(
    images,
    tempStoragePath,
    postStoragePath,
  );
  if (moved) {
    const removeList = await getStorageImage(tempStoragePath);
    if (removeList) await removeStorageFile(removeList, tempStoragePath);
  }
};

// house data 생성 | 수정 | 삭제 hooks
export const useHouseRegist = () => {
  const navigate = useNavigate();
  const { mutate: registHouse, isPending: isRegistHouse } = useMutation({
    mutationFn: async (houseData: HouseFormType) => {
      const { data: insertedData, error } = await supabase
        .from('house')
        .insert(houseData)
        .select('id');

      if (error) throw new Error(`houseUploadError: ${error.message}`);
      const houseId = insertedData[0].id;
      return houseId;
    },
    onMutate: () => createToast('uploadHousePost', '게시글 업로드 중...'),
    onError: error =>
      errorToast(
        'uploadHousePost',
        `게시글 업로드에 실패했습니다.: ${error.message}`,
      ),
    onSuccess: async (houseId, variables) => {
      const { user_id, house_img, representative_img, temporary } = variables;
      const images = [representative_img, ...house_img];
      await saveImageStorage(user_id, images, houseId);
      successToast('uploadHousePost', '게시글이 저장되었습니다.');
      if (temporary === 1) navigate(`/house/${houseId}`);
      else navigate(`/house`);
    },
  });
  return { registHouse, isRegistHouse };
};

export const useHouseUpdate = () => {
  const navigate = useNavigate();
  const { mutate: updateHouse, isPending: isUpdateHouse } = useMutation({
    mutationFn: async ({
      houseData,
      houseId,
    }: {
      houseData: HouseFormType;
      houseId: string;
    }) => {
      const { data, error } = await supabase
        .from('house')
        .update(houseData)
        .eq('id', houseId)
        .select();

      if (error)
        throw new Error(`게시글 업데이트에 실패했습니다.: ${error.message}`);
      return data;
    },
    onMutate: async ({
      houseData,
      houseId,
    }: {
      houseData: HouseFormType;
      houseId: string;
    }) => {
      const toastId = createToast('updateHouse', '게시글 업데이트 중...', {
        autoClose: false,
      });
      try {
        const postStoragePath = `house/${houseData.user_id}/${houseId}`;
        const tempStoragePath = `house/${houseData.user_id}/temporary`;
        const imageList = await getStorageImage(postStoragePath);
        if (imageList) {
          const postImages = imageList.map(imgObj => imgObj.name);
          const moved = await moveImageStorage(
            postImages,
            postStoragePath,
            tempStoragePath,
          );
          if (moved) removeToast(toastId as string);
        }
        return toastId;
      } catch (error) {
        errorToast(
          toastId as string,
          '게시글 수정 중 문제가 생겼습니다. 고객센터에 문의해주세요.',
        );
      }
    },
    onError: error => {
      errorToast(
        'updateHouse',
        `게시글 업데이트 중 문제가 생겼습니다.: ${error.message}`,
      );
    },
    onSuccess: async (_, { houseData, houseId }, toastId) => {
      if (houseData) {
        const { user_id, house_img, representative_img } = houseData;
        const images = [representative_img, ...house_img];
        await saveImageStorage(user_id, images, houseId);
        removeToast(toastId as string);
        successToast('uploadHousePost', '게시글이 업데이트되었습니다.');
        navigate(`/house/${houseId}`);
      }
    },
  });
  return { updateHouse, isUpdateHouse };
};

// Update user profile
export const useUserProfileUpdate = () => {
  const { mutate: updateUserProfile } = useMutation({
    mutationFn: async ({
      dbName,
      data,
      userId,
    }: {
      dbName: string;
      data: UserLifeStyleType | UserMateStyleType;
      userId: string;
    }) => {
      const { error } = await supabase
        .from(dbName)
        .update(data)
        .eq('id', userId);
      if (error) throw new Error(`Profile update error: ${error.message}`);
    },
    onMutate: () => createToast('updateProfile', '프로필 수정 중'),
    onError: error => {
      console.error('Update profile error:', error);
      errorToast('updateProfile', error.message);
    },
    onSuccess: () => successToast('updateProfile', '프로필이 수정되었습니다.'),
  });
  return { updateUserProfile };
};

export const useDeleteHousePost = () => {
  const { mutate: deleteHousePost } = useMutation({
    mutationFn: async (houseId: string) => {
      const { error } = await supabase.from('house').delete().eq('id', houseId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onMutate: () => createToast('deletePost', '임시저장된 글 삭제 중...'),
    onError: () =>
      errorToast('deletePost', '임시저장된 글 삭제에 실패했습니다.'),
    onSuccess: () =>
      successToast('deletePost', '임시저장된 글이 삭제되었습니다.'),
  });
  return { deleteHousePost };
};

// houseList hooks
export const useHouseList = (filter: HouseListType) =>
  infiniteQueryOptions({
    queryKey: ['house', 'list', 'recent', { filter: { ...filter } }],
    queryFn: async ({ pageParam }) => {
      let defaultQuery = supabase
        .from('house')
        .select(
          'id, representative_img, region, house_appeal, house_type, rental_type, region, district, term, deposit_price, monthly_price, user_id',
          { count: 'exact' },
        )
        // 임시 저장 제외
        .eq('temporary', 1);
      const {
        mate_gender,
        mate_number,
        house_type,
        rental_type,
        monthly_rental_price,
        deposit_price,
        term,
        regions,
      } = filter;

      if (mate_gender)
        defaultQuery = defaultQuery.eq('mate_gender', mate_gender);
      if (mate_number)
        defaultQuery = defaultQuery.eq('mate_number', mate_number);
      if (typeof house_type === 'number')
        defaultQuery = defaultQuery.eq('house_type', house_type);
      if (rental_type)
        defaultQuery = defaultQuery.eq('rental_type', rental_type);
      if (monthly_rental_price) {
        if (
          monthly_rental_price[0] === monthly_rental_price[1] &&
          monthly_rental_price[0] !== 510
        )
          defaultQuery = defaultQuery.gte('monthly_price', 500);
        else {
          if (monthly_rental_price[0] > 0)
            defaultQuery = defaultQuery.gte(
              'monthly_price',
              monthly_rental_price,
            );
          if (monthly_rental_price[1] <= 500)
            defaultQuery = defaultQuery.lte(
              'monthly_price',
              monthly_rental_price,
            );
        }
      }
      if (deposit_price) {
        if (deposit_price[0] === deposit_price[1] && deposit_price[0] !== 10100)
          defaultQuery = defaultQuery.gte('monthly_price', 10000);
        else {
          if (deposit_price[0] > 0)
            defaultQuery = defaultQuery.gte('monthly_price', deposit_price);
          if (deposit_price[1] <= 10000)
            defaultQuery = defaultQuery.lte('monthly_price', deposit_price);
        }
      }
      if (term) {
        if (term[0] === term[1] && term[0] !== 25)
          defaultQuery = defaultQuery.gte('monthly_price', 24);
        else {
          if (term[0] > 0)
            defaultQuery = defaultQuery.gte('monthly_price', term);
          if (term[1] <= 24)
            defaultQuery = defaultQuery.lte('monthly_price', term);
        }
      }
      if (regions) {
        const regionQuery = regions
          .map(region => {
            const [city, district] = region.split(' ');
            return `and(region.eq.${city},district.eq.${district})`;
          })
          .join(', ');
        defaultQuery = defaultQuery.or(regionQuery);
      }
      return defaultQuery.range(pageParam * 12, (pageParam + 1) * 11);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam, _allPageParams) =>
      (lastPage.count as number) - (lastPageParam + 1) * 12 > 0
        ? lastPageParam + 1
        : undefined,
  });
