import Link from '@/components/atoms/Link';
import Container from '@/components/atoms/Container';
import Img from '@/components/atoms/Img';
import Badge from '@/components/atoms/Badge';
import Typography from '@/components/atoms/Typography';
import Icon from '@/components/atoms/Icon';
import { houseTypesInfo, rentalTypesInfo } from '@/constants/profileDetailInfo';
import { HouseCardType } from '@/types/house.type';

type HouseCardProps = HouseCardType;

export default function HouseCard(props: HouseCardProps) {
  const {
    id,
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
    <Link to={`/house-detail/${id}`}>
      <Container className="relative h-[17.8125rem] w-80 rounded-xl shadow-[0_4px_12px_0_rgba(0,0,0,12%)]">
        <Img className="h-[12.5rem] rounded-b-none" src={representative_img} />
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
        <Container.FlexCol className="gap-y-2 p-4">
          <Container.FlexRow className="gap-x-1 text-brown">
            <Typography.P3 className="font-bold">
              {rentalTypesInfo[rental_type]}
            </Typography.P3>
            <Typography.P3 className="font-bold">
              {`${deposit_price}/${monthly_price}`}
            </Typography.P3>
          </Container.FlexRow>
          <Container.FlexRow className="flex-wrap items-center gap-1 [&>div]:rounded-[1.5625rem] [&>div]:px-[0.625rem] [&>div]:py-[0.375rem]">
            <Typography.Span1 className="text-brown">{`${region} ${district}`}</Typography.Span1>
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
      </Container>
    </Link>
  );
}
