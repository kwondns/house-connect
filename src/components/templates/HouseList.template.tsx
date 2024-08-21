import { UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import { useRecoilState } from 'recoil';

import { HouseCardType } from '@/types/house.type';
import HouseCard from '@/components/organisms/HouseCard';
import Container from '@/components/atoms/Container';
import { useObserver } from '@/hooks/useObserver';
import Typography from '@/components/atoms/Typography';
import Icon from '@/components/atoms/Icon';
import IconButton from '@/components/molecules/IconButton';
import {
  genderInfo,
  houseTypesInfo,
  mateNumInfo,
  rentalTypesInfo,
} from '@/constants/profileDetailInfo';
import unitConverters from '@/libs/generateUnit';
import Link from '@/components/atoms/Link';
import useModal from '@/hooks/useModal';
import { HouseListFilterState } from '@/types/modal.type';
import HouseListFilterAtomState from '@/stores/houseList.store';

type HouseListTemplateProps = {
  house: PostgrestSingleResponse<HouseCardType[]>[];
} & Pick<UseSuspenseInfiniteQueryResult, 'hasNextPage'> &
  Pick<UseSuspenseInfiniteQueryResult, 'fetchNextPage'>;

export default function HouseListTemplate(props: HouseListTemplateProps) {
  const { house, fetchNextPage, hasNextPage } = props;
  const lastRef = useRef<HTMLDivElement>(null);
  const isShow = useObserver(lastRef);
  const { setModalState: setHouseListFilterModal } =
    useModal('HouseListFilter');
  const HouseListFilterContext: HouseListFilterState = {
    isOpen: true,
    type: 'HouseListFilter',
  };
  // const filterValue = useRecoilValue(HouseListFilterAtomState);
  const [filterValue, setFilterValue] = useRecoilState(
    HouseListFilterAtomState,
  );
  const removeFilter = (key: string) => {
    setFilterValue(prev => ({
      ...prev,
      [key]: undefined,
    }));
  };

  useEffect(() => {
    (async () => {
      if (isShow && hasNextPage) await fetchNextPage();
    })();
  }, [isShow, hasNextPage, lastRef.current]);

  let termDisplay = '';
  if (filterValue.term) {
    const rangeMinValue = unitConverters.term(filterValue.term[0], 25);
    const rangeMaxValue = unitConverters.term(filterValue.term[1], 25);
    if (rangeMinValue === rangeMaxValue) termDisplay = rangeMinValue;
    else if (rangeMaxValue === '2년 1개월')
      termDisplay = `${rangeMinValue} 이상`;
    else termDisplay = `${rangeMinValue} ~ ${rangeMaxValue}`;
  }
  let depositDisplay = '';
  if (filterValue.deposit_price) {
    const rangeMinValue = unitConverters.price(
      filterValue.deposit_price[0],
      10100,
    );
    const rangeMaxValue = unitConverters.price(
      filterValue.deposit_price[1],
      10100,
    );
    if (rangeMinValue === rangeMaxValue) depositDisplay = rangeMinValue;
    else if (rangeMaxValue === '1억 100만원')
      depositDisplay = `${rangeMinValue} 이상`;
    else depositDisplay = `${rangeMinValue} ~ ${rangeMaxValue}`;
  }
  let monthlyDisplay = '';
  if (filterValue.monthly_rental_price) {
    const rangeMinValue = unitConverters.price(
      filterValue.monthly_rental_price[0],
      510,
    );
    const rangeMaxValue = unitConverters.price(
      filterValue.monthly_rental_price[1],
      510,
    );
    if (rangeMinValue === rangeMaxValue) monthlyDisplay = rangeMinValue;
    else if (rangeMaxValue === ' 510만원')
      monthlyDisplay = `${rangeMinValue} 이상`;
    else monthlyDisplay = `${rangeMinValue} ~ ${rangeMaxValue}`;
  }

  return (
    <Container.FlexCol className="bg-transparent">
      <Container.FlexCol className="relative h-screen min-h-[75.375rem] pt-[4.0625rem] laptop:min-h-[85rem] laptop:px-[7.5rem] monitor:px-[11.25rem]">
        <Typography.P1 className="text-[2.5rem] leading-[135%] text-[#FF5F3C]">
          HOUSE THE COLLECTION
        </Typography.P1>
        <Typography.P1 className="indent-[-17px] text-[12.5rem] font-semibold leading-none text-[#FF5F3C]">
          HOUSE
        </Typography.P1>
        <Typography.P1 className="whitespace-nowrap text-[12.5rem] font-semibold leading-none text-[#FF5F3C]">
          -CONNECT
        </Typography.P1>
        <Icon
          type="character"
          className="absolute inset-x-1/2 top-[28.4375rem] h-[20.4375rem] w-[16.125rem] -translate-x-1/2 laptop:h-[34.875rem] laptop:w-[27.5rem]"
        />
        <Container.FlexCol className="items-center gap-y-[3.25rem] pt-[34.375rem]">
          <HashLink to="/house#list-start">
            <IconButton.Ghost iconType="down-arrow" />
          </HashLink>
          <Typography.P2
            className="text-[2.5rem] text-[#FF5F3C]"
            id="list-start"
          >
            Find Your Roommate.
          </Typography.P2>
        </Container.FlexCol>
      </Container.FlexCol>
      <Container.FlexCol className="items-center gap-y-5 pb-12 pt-[7.5rem]">
        <Container.FlexRow className="gap-x-4">
          <IconButton.Ghost
            iconType="filter"
            direction="left"
            className="rounded-[1.875rem] !bg-[#FF5F3C] px-[1.5625rem] py-2.5 shadow-[0_3px_8px_0_rgba(0,0,0,16%)]"
            onClick={() => setHouseListFilterModal(HouseListFilterContext)}
          >
            <Typography.P3 className="pl-3 leading-150 text-white">
              필터
            </Typography.P3>
          </IconButton.Ghost>
          <Link to="/house/regist">
            <IconButton.Ghost
              iconType="add"
              direction="left"
              className="rounded-[1.875rem] bg-white px-[1.5625rem] py-2.5 shadow-[0_3px_8px_0_rgba(0,0,0,16%)]"
            >
              <Typography.P3 className="pl-3 leading-150 text-brown">
                하우스 등록
              </Typography.P3>
            </IconButton.Ghost>
          </Link>
        </Container.FlexRow>
        <Container.FlexRow className="flex-wrap gap-2 px-16 [&>button]:h-10 [&>button]:gap-x-4 [&>button]:rounded-[1.875rem] [&>button]:bg-white [&>button]:px-5">
          {filterValue.house_type !== undefined && (
            <IconButton.Ghost
              iconType="close"
              onClick={() => removeFilter('house_type')}
            >
              <Typography.P3 className="text-brown">
                {
                  houseTypesInfo[
                    filterValue.house_type as keyof typeof houseTypesInfo
                  ].text
                }
              </Typography.P3>
            </IconButton.Ghost>
          )}
          {filterValue.rental_type !== undefined &&
            filterValue.rental_type !== 0 && (
              <IconButton.Ghost
                iconType="close"
                onClick={() => removeFilter('rental_type')}
              >
                <Typography.P3 className="text-brown">
                  {
                    rentalTypesInfo[
                      filterValue.rental_type as keyof typeof rentalTypesInfo
                    ]
                  }
                </Typography.P3>
              </IconButton.Ghost>
            )}
          {filterValue.regions &&
            filterValue.regions?.map(region => (
              <IconButton.Ghost
                key={region}
                iconType="close"
                onClick={() => removeFilter('regions')}
              >
                <Typography.P3 className="text-brown">{region}</Typography.P3>
              </IconButton.Ghost>
            ))}
          {filterValue.term &&
            (filterValue.term[0] !== 0 || filterValue.term[1] !== 25) && (
              <IconButton.Ghost
                iconType="close"
                onClick={() => removeFilter('term')}
              >
                <Typography.P3 className="text-brown">
                  {termDisplay}
                </Typography.P3>
              </IconButton.Ghost>
            )}
          {filterValue.deposit_price &&
            (filterValue.deposit_price[0] !== 0 ||
              filterValue.deposit_price[1] !== 10100) && (
              <IconButton.Ghost
                iconType="close"
                onClick={() => removeFilter('deposit_price')}
              >
                <Typography.P3 className="text-brown">
                  {depositDisplay}
                </Typography.P3>
              </IconButton.Ghost>
            )}
          {filterValue.monthly_rental_price &&
            (filterValue.monthly_rental_price[0] !== 0 ||
              filterValue.monthly_rental_price[1] !== 510) && (
              <IconButton.Ghost
                iconType="close"
                onClick={() => removeFilter('monthly_rental_price')}
              >
                <Typography.P3 className="text-brown">
                  {monthlyDisplay}
                </Typography.P3>
              </IconButton.Ghost>
            )}

          {filterValue.mate_number !== undefined &&
            filterValue.mate_number !== 0 && (
              <IconButton.Ghost
                iconType="close"
                className="!gap-x-2"
                onClick={() => removeFilter('mate_number')}
              >
                <Icon
                  type={
                    mateNumInfo[
                      filterValue.mate_number as keyof typeof mateNumInfo
                    ].icon
                  }
                />
                <Typography.P3 className="pr-2 text-brown">
                  {
                    mateNumInfo[
                      filterValue.mate_number as keyof typeof mateNumInfo
                    ].text
                  }
                </Typography.P3>
              </IconButton.Ghost>
            )}
          {filterValue.mate_gender !== undefined &&
            filterValue.mate_gender !== 0 && (
              <IconButton.Ghost
                iconType="close"
                className="!gap-x-2"
                onClick={() => removeFilter('mate_gender')}
              >
                <Icon
                  type={
                    genderInfo[
                      filterValue.mate_gender as keyof typeof genderInfo
                    ].icon
                  }
                />
                <Typography.P3 className="pr-2 text-brown">
                  {
                    genderInfo[
                      filterValue.mate_gender as keyof typeof genderInfo
                    ].text
                  }
                </Typography.P3>
              </IconButton.Ghost>
            )}
        </Container.FlexRow>
      </Container.FlexCol>
      <Container.Grid className="grid-cols-[1fr_1fr_1fr_1fr] gap-x-6 gap-y-10 overflow-x-auto px-16 monitor:px-0 [&>img]:object-contain">
        {house.map(
          item =>
            item.data &&
            item.data.map(datum => (
              <HouseCard
                key={datum.id}
                size="w-[19.375rem] monitor:w-[23.25rem]"
                {...datum}
              />
            )),
        )}
      </Container.Grid>
      {hasNextPage ? (
        <div ref={lastRef} />
      ) : (
        <Typography.Head3 className="p-16 text-center text-brown">
          마지막 결과입니다.
        </Typography.Head3>
      )}
    </Container.FlexCol>
  );
}
