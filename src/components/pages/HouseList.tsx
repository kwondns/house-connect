import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import HouseListTemplate from '@/components/templates/HouseList.template';
import { useHouseList } from '@/hooks/useHouse';
import Typography from '@/components/atoms/Typography';

export default function HouseList() {
  const { data, hasNextPage, fetchNextPage } =
    // TODO house_type, rental_type, region, district, term, deposit_price, monthly_price, mate_num, mate_gender
    // filter 추가
    useSuspenseInfiniteQuery(useHouseList());
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
