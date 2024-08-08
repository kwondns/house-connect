import { UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';

import { HouseCardType } from '@/types/house.type';
import HouseCard from '@/components/organisms/HouseCard';
import Container from '@/components/atoms/Container';
import { useObserver } from '@/hooks/useObserver';
import Typography from '@/components/atoms/Typography';

type HouseListTemplateProps = {
  house: PostgrestSingleResponse<HouseCardType[]>[];
} & Pick<UseSuspenseInfiniteQueryResult, 'hasNextPage'> &
  Pick<UseSuspenseInfiniteQueryResult, 'fetchNextPage'>;

export default function HouseListTemplate(props: HouseListTemplateProps) {
  const { house, fetchNextPage, hasNextPage } = props;
  const lastRef = useRef<HTMLDivElement>(null);
  const isShow = useObserver(lastRef);
  useEffect(() => {
    (async () => {
      if (isShow && hasNextPage) await fetchNextPage();
    })();
  }, [isShow, hasNextPage, lastRef.current]);

  return (
    <>
      <Container.Grid className="grid-cols-4">
        {house.map(
          item => item.data && item.data.map(datum => <HouseCard {...datum} />),
        )}
      </Container.Grid>
      {hasNextPage ? (
        <div ref={lastRef} />
      ) : (
        <Typography.SubTitle2>마지막 결과입니다.</Typography.SubTitle2>
      )}
    </>
  );
}
