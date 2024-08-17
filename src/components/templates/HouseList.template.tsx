import { UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';

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

  const tempFilter: {
    house_type?: keyof typeof houseTypesInfo;
    rental_type?: keyof typeof rentalTypesInfo;
    regions?: string[];
    term?: [number, number];
    deposit_price?: [number, number];
    monthly_price?: [number, number];
    mate_number?: keyof typeof mateNumInfo;
    mate_gender?: keyof typeof genderInfo;
  } = {
    house_type: 0,
    rental_type: 1,
    regions: ['경기 고양시'],
    term: [6, 12],
    deposit_price: [1000, 2000],
    monthly_price: [50, 90],
    mate_number: 1,
    mate_gender: 1,
  };
  let termDisplay = '';
  if (tempFilter.term) {
    const rangeMinValue = unitConverters.term(tempFilter.term[0], 25);
    const rangeMaxValue = unitConverters.term(tempFilter.term[1], 25);
    termDisplay =
      rangeMinValue === rangeMaxValue
        ? rangeMinValue
        : `${rangeMinValue} ~ ${rangeMaxValue}`;
  }
  let depositDisplay = '';
  if (tempFilter.deposit_price) {
    const rangeMinValue = unitConverters.price(
      tempFilter.deposit_price[0],
      10001,
    );
    const rangeMaxValue = unitConverters.price(
      tempFilter.deposit_price[1],
      10001,
    );
    depositDisplay =
      rangeMinValue === rangeMaxValue
        ? rangeMinValue
        : `${rangeMinValue} ~ ${rangeMaxValue}`;
  }
  let monthlyDisplay = '';
  if (tempFilter.monthly_price) {
    const rangeMinValue = unitConverters.price(
      tempFilter.monthly_price[0],
      10001,
    );
    const rangeMaxValue = unitConverters.price(
      tempFilter.monthly_price[1],
      10001,
    );
    monthlyDisplay =
      rangeMinValue === rangeMaxValue
        ? rangeMinValue
        : `${rangeMinValue} ~ ${rangeMaxValue}`;
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
          {Object.prototype.hasOwnProperty.call(tempFilter, 'house_type') && (
            <IconButton.Ghost iconType="close">
              <Typography.P3 className="text-brown">
                {
                  houseTypesInfo[
                    tempFilter.house_type as keyof typeof houseTypesInfo
                  ].text
                }
              </Typography.P3>
            </IconButton.Ghost>
          )}
          {Object.prototype.hasOwnProperty.call(tempFilter, 'rental_type') && (
            <IconButton.Ghost iconType="close">
              <Typography.P3 className="text-brown">
                {
                  rentalTypesInfo[
                    tempFilter.rental_type as keyof typeof rentalTypesInfo
                  ]
                }
              </Typography.P3>
            </IconButton.Ghost>
          )}
          {Object.prototype.hasOwnProperty.call(tempFilter, 'regions') &&
            tempFilter.regions?.map(region => (
              <IconButton.Ghost key={region} iconType="close">
                <Typography.P3 className="text-brown">{region}</Typography.P3>
              </IconButton.Ghost>
            ))}
          {Object.prototype.hasOwnProperty.call(tempFilter, 'term') && (
            <IconButton.Ghost iconType="close">
              <Typography.P3 className="text-brown">
                {termDisplay}
              </Typography.P3>
            </IconButton.Ghost>
          )}
          {Object.prototype.hasOwnProperty.call(
            tempFilter,
            'deposit_price',
          ) && (
            <IconButton.Ghost iconType="close">
              <Typography.P3 className="text-brown">
                {depositDisplay}
              </Typography.P3>
            </IconButton.Ghost>
          )}
          {Object.prototype.hasOwnProperty.call(
            tempFilter,
            'monthly_price',
          ) && (
            <IconButton.Ghost iconType="close">
              <Typography.P3 className="text-brown">
                {monthlyDisplay}
              </Typography.P3>
            </IconButton.Ghost>
          )}

          {Object.prototype.hasOwnProperty.call(tempFilter, 'mate_number') && (
            <IconButton.Ghost iconType="close" className="!gap-x-2">
              <Icon
                type={
                  mateNumInfo[
                    tempFilter.mate_number as keyof typeof mateNumInfo
                  ].icon
                }
              />
              <Typography.P3 className="pr-2 text-brown">
                {
                  mateNumInfo[
                    tempFilter.mate_number as keyof typeof mateNumInfo
                  ].text
                }
              </Typography.P3>
            </IconButton.Ghost>
          )}
          {Object.prototype.hasOwnProperty.call(tempFilter, 'mate_gender') && (
            <IconButton.Ghost iconType="close" className="!gap-x-2">
              <Icon
                type={
                  genderInfo[tempFilter.mate_gender as keyof typeof genderInfo]
                    .icon
                }
              />
              <Typography.P3 className="pr-2 text-brown">
                {
                  genderInfo[tempFilter.mate_gender as keyof typeof genderInfo]
                    .text
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
