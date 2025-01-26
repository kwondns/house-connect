import { useQueryClient } from '@tanstack/react-query';

import Link from '@/components/atoms/Link';
import Container from '@/components/atoms/Container';
import Img from '@/components/atoms/Img';
import Badge from '@/components/atoms/Badge';
import Typography from '@/components/atoms/Typography';
import Icon from '@/components/atoms/Icon';
import { houseTypesInfo, rentalTypesInfo } from '@/constants/profileDetailInfo';
import { HouseCardType } from '@/types/house.type';
import { houseDetailQuery } from '@/hooks/useHouseDetail';

// eslint-disable-next-line react/require-default-props
type HouseCardProps = HouseCardType & { size?: string };

export default function HouseCard(props: HouseCardProps) {
  const queryClient = useQueryClient();
  const {
    size,
    id,
    user_id,
    region,
    district,
    house_type,
    house_appeal,
    rental_type,
    representative_img,
    term,
    monthly_price,
    deposit_price,
  } = props;
  return (
    <Link
      to={`/house/${id}`}
      onMouseEnter={() =>
        queryClient.prefetchQuery({
          ...houseDetailQuery(id),
          staleTime: 1000 * 60 * 999,
        })
      }
      className={size}
    >
      <Container
        className={`relative w-80 rounded-xl bg-white shadow-[0_4px_12px_0_rgba(0,0,0,12%)] ${size}`}
      >
        <Img
          className="h-[12.5rem] rounded-b-none"
          src={`${import.meta.env.VITE_SUPABASE_BUCKET_URL}/house/${user_id}/${id}/${representative_img}`}
        />
        <Container.FlexRow className="absolute inset-x-0 top-0 items-start p-4">
          <Container.FlexRow className="flex-1 flex-wrap gap-1 [&>div]:rounded-[1.5625rem] [&>div]:px-[0.625rem] [&>div]:py-[0.375rem]">
            {house_appeal.map(appeal => (
              <Badge.Outline
                key={appeal}
                hover={false}
                active={false}
                focus={false}
              >
                <Typography.P2 key={appeal}>{appeal}</Typography.P2>
              </Badge.Outline>
            ))}
          </Container.FlexRow>
          <Icon type="mini-heart" />
        </Container.FlexRow>
        <Container.FlexCol className="gap-y-1.5 p-4">
          <Container.FlexRow className="gap-x-1 text-brown">
            <Typography.P3 className="font-bold">
              {rentalTypesInfo[rental_type]}
            </Typography.P3>
            <Typography.P3 className="font-bold">
              {`${deposit_price}/${monthly_price}`}
            </Typography.P3>
          </Container.FlexRow>
          <Container.FlexCol className="flex-wrap gap-y-2 monitor:flex-row monitor:items-center monitor:gap-1">
            <Typography.Span1 className="text-brown">{`${region} ${district}`}</Typography.Span1>
            <Container.FlexRow className="gap-1 [&>div]:rounded-[1.5625rem] [&>div]:px-[0.625rem] [&>div]:py-[0.375rem]">
              <Badge.Outline hover={false} active={false} focus={false}>
                <Typography.Span2>
                  {houseTypesInfo[house_type].text}
                </Typography.Span2>
              </Badge.Outline>
              <Badge.Outline hover={false} active={false} focus={false}>
                <Typography.Span2>{`${term[0]}개월 이상`}</Typography.Span2>
              </Badge.Outline>
            </Container.FlexRow>
          </Container.FlexCol>
        </Container.FlexCol>
      </Container>
    </Link>
  );
}
