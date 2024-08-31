import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import HouseListTemplate from '@/components/templates/HouseList.template';
import { useHouseList } from '@/hooks/useHouse';
import Typography from '@/components/atoms/Typography';
import HouseListFilterAtomState from '@/stores/houseList.store';

export default function HouseList() {
  const houseFilter = useRecoilValue(HouseListFilterAtomState);
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    useHouseList(houseFilter),
  );
  if (!data.pages)
    return <Typography.Head1>데이터가 없습니다.</Typography.Head1>;
  return (
    <HouseListTemplate
      house={data.pages}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
