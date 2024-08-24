import { useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import Divider from '@/components/atoms/Divider';
import Icon from '@/components/atoms/Icon';
import Img from '@/components/atoms/Img';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import { UserType } from '@/types/auth.type';
import {
  rentalTypesInfo,
  genderInfo,
  smokingInfo,
  petInfo,
  floorInfo,
  houseTypesInfo,
  mateNumInfo,
} from '@/constants/profileDetailInfo';
import { HouseFormType } from '@/types/house.type';
import { UserAtom } from '@/stores/auth.store';
import BadgeIcon from '@/components/molecules/BadgeIcon';
import copyUrl from '@/libs/copyUrl';
import {
  removeStorage,
  useDeleteHouseDetail,
  useUpdateBookMark,
} from '@/hooks/useHouseDetail';
import ModalBackdrop from '@/components/organisms/modals/ModalBackdrop';
import Carousel from '@/components/organisms/Carousel';
import useModal from '@/hooks/useModal';
import {
  RoommateApplicationState,
  RoommateApplyState,
} from '@/types/modal.type';

// TODO: house.type HouseData(join된 column도 포함) 필요한 column만 pick해서 가져오기
export type HouseData = Omit<HouseFormType, 'rental_type' | 'floor'> & {
  created_at: string;
  updated_at: string;
  floor: keyof typeof floorInfo;
  user: User;
  user_lifestyle: LifeStyle;
  rental_type: keyof typeof rentalTypesInfo;
  user_mate_style: MateStyle;
};

type User = Pick<UserType, 'id' | 'name' | 'avatar'> & {
  gender: keyof typeof genderInfo;
};

type LifeStyle = {
  smoking: keyof typeof smokingInfo;
  pet: keyof typeof petInfo;
  appeals: string[];
};

type MateStyle = {
  mate_gender: 0 | 1 | 2;
  mate_number: 0 | 1 | 2 | 3;
  mate_appeals: string[];
  prefer_mate_age: number[];
};
const HOUSE_STORAGE_URL = `${import.meta.env.VITE_SUPABASE_STORAGE_URL}/house`;

export default function HouseDetailTemplate(props: {
  houseData: HouseData;
  bookmark: boolean;
  houseId: string;
}) {
  const { houseData, bookmark, houseId } = props;
  const user = useRecoilValue(UserAtom);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [carouselStep, setCarouselStep] = useState(0);
  const { updateBookMark, isPending } = useUpdateBookMark();
  const { deleteHouseDetailPage } = useDeleteHouseDetail();

  const {
    setModalState: setRoommateApplyModal,
    closeModal: closeRoommateApplyModal,
  } = useModal('RoommateApply');
  const {
    setModalState: setRoommateApplicationModal,
    closeModal: closeRoommateApplicationModal,
  } = useModal('RoommateApplicationStatus');

  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [modal]);

  const onClickBookMark = () => {
    updateBookMark({
      id: user?.id as string,
      houseId: houseId as string,
      isBookMark: bookmark,
    });
  };
  const onClickEditBtn = () => {
    navigate(`/house/edit/${houseId}`);
  };
  const onClickDeleteBtn = () => {
    deleteHouseDetailPage(houseId, {
      onSuccess: () => {
        removeStorage(houseId, user?.id as string);
      },
    });
  };
  if (!houseData) {
    return <div>데이터 없음..</div>;
  }
  const houseOwner = houseData.user_id === user?.id;
  const { created_at: createdAt, updated_at: updatedAt } = houseData;

  const formDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const termArray = houseData.term.map(value => {
    const years = Math.floor(value / 12);
    const months = value % 12;
    if (years === 0) {
      return `최소 ${months}개월에서 `;
    }
    if (months === 0) {
      return `${years}년 이상`;
    }
    return `${years}년 ${months}개월 이상`;
  });
  const leftImg = houseData.house_img.length - 4;
  const imgCount = () => {
    if (leftImg < 0) return <Icon type="camera-off" />;
    if (leftImg === 0) return '';
    return `+ ${leftImg} 개`;
  };

  const RoommateApplyModalContext: RoommateApplyState = {
    isOpen: true,
    type: 'RoommateApply',
    introduceContent: '',
    roommateAppeals: houseData.user_lifestyle.appeals,
    onClickCancel: () => {
      closeRoommateApplyModal();
    },
    onClickConfirm: () => {
      alert('Completed Apply');
      closeRoommateApplyModal();
    },
  };

  const RoommateApplicationContext: RoommateApplicationState = {
    isOpen: true,
    type: 'RoommateApplicationStatus',
    profileImage: '',
    userName: 'user123',
    roommateAppeals: [
      '1명',
      '남성',
      '잠귀 어두운 분',
      '청소 자주해요',
      '늦게 자요',
    ],
    introduceContent:
      '안녕하세요! 1년 6개월 동안 사는 것을 희망하고 조용히 지낼 수 있습니다. 집이 좋아보여서 신청해봅니다!',
    onClickChat() {
      alert('상대방과의 채팅이 시작합니다!');
      closeRoommateApplicationModal();
    },
    onClickConfirm: () => {
      alert('user123 님을 수락하셨습니다!');
      closeRoommateApplicationModal();
    },
    onClickCancel: () => {
      closeRoommateApplicationModal();
    },
  };

  return (
    <Container.FlexCol className="gap-8 pb-32">
      {modal && (
        <ModalBackdrop
          className="bg-[#6d6d6d]/70"
          onClickClose={() => {
            setModal(false);
          }}
        >
          <Container.FlexRow className="relative size-full tablet:size-[700px]">
            <Carousel order={carouselStep} className="overflow-y-auto">
              <Img
                src={`${HOUSE_STORAGE_URL}/${houseData.user_id}/${houseId}/${houseData.representative_img}`}
                className="min-w-full flex-1 justify-center bg-transparent tablet:min-w-[700px] [&>*]:flex-1 [&>*]:object-contain"
                alt="houseimage"
              />
              {houseData.house_img.map(src => (
                <Img
                  key={src}
                  alt="houseimage"
                  src={`${HOUSE_STORAGE_URL}/${houseData.user_id}/${houseId}/${src}`}
                  className="min-w-full flex-1 bg-transparent tablet:min-w-[700px] [&>*]:flex-1 [&>*]:object-contain"
                />
              ))}
            </Carousel>
            <IconButton.Ghost
              className="absolute left-1 top-[50%] size-8 justify-center !bg-brown/60 tablet:left-auto tablet:right-[46.5rem] tablet:size-16 "
              iconClassName="size-6 tablet:size-10"
              fill="brown4"
              iconType="prev"
              direction="left"
              onClick={() => {
                setCarouselStep(prev =>
                  prev !== 0 ? prev - 1 : houseData.house_img.length,
                );
              }}
            />
            <IconButton.Ghost
              className="absolute right-1 top-[50%] size-8 justify-center !bg-brown/60 tablet:left-[46.5rem] tablet:right-0 tablet:size-16 "
              iconClassName="size-6 tablet:size-10"
              fill="brown4"
              iconType="next"
              direction="right"
              onClick={() => {
                setCarouselStep(prev =>
                  prev !== houseData.house_img.length ? prev + 1 : 0,
                );
              }}
            />
            <IconButton.Ghost
              className="absolute right-2 top-2 size-10 justify-center hover:!bg-brown/60 tablet:-right-16 tablet:top-0"
              iconType="close"
              iconClassName="size-6"
              fill="brown4"
              onClick={() => setModal(false)}
            />
            <Container.FlexRow
              className="absolute bottom-8 left-2/4 -translate-x-2/4 items-center
             gap-2 text-brown tablet:-bottom-2 tablet:translate-y-full"
            >
              <Typography.P1>{carouselStep + 1}</Typography.P1> /
              <Typography.P1>{houseData.house_img.length + 1}</Typography.P1>
            </Container.FlexRow>
          </Container.FlexRow>
        </ModalBackdrop>
      )}
      <Container.FlexRow className="relative gap-5">
        <Img
          className=" size-[390px] flex-1 shrink-0 desktop:size-[588px] laptop:size-[470px] [&>img]:object-fill "
          src={`${HOUSE_STORAGE_URL}/${houseData.user_id}/${houseId}/${houseData.representative_img}`}
        />
        <Button.Ghost
          onClick={() => setModal(true)}
          className="absolute bottom-5 right-5 gap-1.5 rounded-3xl bg-white px-4 py-2 text-brown drop-shadow-md"
        >
          <Typography.P1>1</Typography.P1> /
          <Typography.P1>{houseData.house_img.length + 1}</Typography.P1>
        </Button.Ghost>
        <Container.Grid className="relative hidden max-h-[440px] flex-1 grid-cols-2 grid-rows-2 gap-5 desktop:max-h-[588px] laptop:grid laptop:max-h-[470px] ">
          {houseData &&
            houseData.house_img
              .slice(0, 4)
              .map((src, index) => (
                <Img
                  key={src}
                  src={`${HOUSE_STORAGE_URL}/${houseData.user_id}/${houseId}/${src}`}
                  alt={`house image ${index + 1}`}
                  className={`[&>img]:object-fill ${index === 3 && 'col-start-2 row-start-2'}`}
                />
              ))}
          <Container.FlexCol
            className={`col-start-2 row-start-2 items-center justify-center rounded-xl ${leftImg === 0 ? ' bg-brown3/30' : ' bg-brown3/50'}`}
          >
            <Typography.Head2 className="text-brown">
              {imgCount()}
            </Typography.Head2>
          </Container.FlexCol>
          <Button.Outline
            onClick={() => setModal(true)}
            className="absolute bottom-4 right-4 rounded-3xl border-white px-5  py-2 text-brown drop-shadow-md "
          >
            <Typography.P2>사진 모두 보기</Typography.P2>
          </Button.Outline>
        </Container.Grid>
      </Container.FlexRow>

      <Container.FlexCol>
        <Container.FlexCol className="gap-[3.25rem]">
          <Container.FlexCol className="gap-4">
            <Container.FlexRow className="items-center">
              <Typography.Head3 className="text-pretty pr-3 text-[1.8461538462rem] text-brown tablet:text-Head2">
                {houseData && houseData.post_title}
              </Typography.Head3>
              {houseOwner && (
                <>
                  <Button.Ghost
                    className="p-[0.5625rem] text-brown"
                    onClick={onClickEditBtn}
                  >
                    <Icon type="edit" className="block tablet:hidden" />
                    <Typography.P3 className="hidden tablet:block">
                      수정
                    </Typography.P3>
                  </Button.Ghost>
                  <Button.Ghost
                    className="p-[0.5625rem] text-brown"
                    onClick={onClickDeleteBtn}
                  >
                    <Icon type="delete" className="block tablet:hidden" />
                    <Typography.P3 className="hidden tablet:block ">
                      삭제
                    </Typography.P3>
                  </Button.Ghost>
                </>
              )}
            </Container.FlexRow>
            <Container.FlexRow className="gap-3">
              <Container className="flex flex-wrap gap-1 tablet:inline-flex tablet:flex-row">
                <Typography.P2 className="text-brown1">
                  최근 등록일
                </Typography.P2>
                <Typography.P2 className="text-brown1">
                  {formDate(createdAt)}
                </Typography.P2>
              </Container>
              <Divider.Row className="border-l-0" />
              <Container className="flex flex-wrap gap-1 tablet:inline-flex tablet:flex-row">
                <Typography.P2 className="text-brown1">
                  최근 수정일
                </Typography.P2>
                <Typography.P2 className="text-brown1">
                  {formDate(updatedAt)}
                </Typography.P2>
              </Container>
            </Container.FlexRow>
          </Container.FlexCol>
          <Container.FlexRow className="justify-between	">
            <Container.FlexRow className="flex-wrap gap-3">
              {houseOwner ? (
                <Button.Fill
                  className="rounded-lg px-10 py-4 text-white tablet:px-[3.15625rem] tablet:py-[1.21875rem]"
                  onClick={() =>
                    setRoommateApplicationModal(RoommateApplicationContext)
                  }
                >
                  <Typography.P3 className="tablet:text-P1">
                    신청 현황
                  </Typography.P3>
                </Button.Fill>
              ) : (
                <>
                  <Button.Fill
                    className="rounded-lg px-[2.03125rem] py-[1.21875rem] text-white"
                    onClick={() =>
                      setRoommateApplyModal(RoommateApplyModalContext)
                    }
                  >
                    <Typography.P3 className="tablet:text-P1">
                      룸메이트 신청
                    </Typography.P3>
                  </Button.Fill>
                  <Button.Outline className="rounded-lg bg-white px-[1.96875rem] py-[1.21875rem] text-brown ">
                    <Typography.P3 className="tablet:text-P1">
                      메시지 보내기
                    </Typography.P3>
                  </Button.Outline>
                </>
              )}
            </Container.FlexRow>
            <Container.FlexRow className="gap-5 laptop:gap-8 tablet:gap-7">
              <Container.FlexCol className="items-center justify-center gap-3">
                <IconButton.Ghost
                  iconType={bookmark ? 'fill-heart' : 'heart'}
                  onClick={onClickBookMark}
                  disabled={isPending}
                />
                <Typography.P3 className="text-brown1 tablet:text-P2">
                  {houseData.bookmark}
                </Typography.P3>
              </Container.FlexCol>
              <Container.FlexCol className="items-center justify-center gap-3">
                <IconButton.Ghost iconType="share" onClick={copyUrl} />
                <Typography.P3 className="text-brown1 tablet:text-P2">
                  공유
                </Typography.P3>
              </Container.FlexCol>
            </Container.FlexRow>
          </Container.FlexRow>
        </Container.FlexCol>
        <Divider.Col className="my-8 border-t-0 laptop:my-11" />
        <Container className="flex flex-col justify-between gap-14 desktop:flex-row laptop:gap-20">
          <Container.FlexCol className="flex-1 gap-11 text-brown">
            <Container.FlexRow className="items-center gap-4 ">
              {/* TODO: Avatar component 적용 */}
              <Img
                className="size-12 shrink-0 cursor-pointer rounded-full bg-transparent shadow-avatar"
                src={houseData.user?.avatar}
              />
              <Typography.Head3>{houseData.user?.name}</Typography.Head3>
            </Container.FlexRow>
            <Container.FlexCol className="gap-6">
              <Typography.SubTitle1>자기소개</Typography.SubTitle1>
              <Container.FlexRow className="flex-wrap gap-2">
                <BadgeIcon.Outline
                  iconType={genderInfo[houseData.user.gender].icon}
                >
                  <Typography.P2 className="py-2.5">
                    {genderInfo[houseData.user.gender].text}
                  </Typography.P2>
                </BadgeIcon.Outline>
                <BadgeIcon.Outline
                  iconType={smokingInfo[houseData.user_lifestyle.smoking].icon}
                >
                  <Typography.P2 className="py-2.5">
                    {smokingInfo[houseData.user_lifestyle.smoking].text}
                  </Typography.P2>
                </BadgeIcon.Outline>
                <BadgeIcon.Outline
                  iconType={petInfo[houseData.user_lifestyle?.pet].icon}
                >
                  <Typography.P2 className="py-2.5">
                    {petInfo[houseData.user_lifestyle.pet].text}
                  </Typography.P2>
                </BadgeIcon.Outline>
              </Container.FlexRow>
            </Container.FlexCol>
            <Container.FlexCol className="gap-6">
              <Typography.SubTitle1>라이프 스타일</Typography.SubTitle1>
              <Container.FlexRow className="flex-wrap gap-x-2 gap-y-3">
                {houseData.user_lifestyle?.appeals.map(value => (
                  <Badge.Outline
                    key={value}
                    focus={false}
                    active={false}
                    hover={false}
                    className="rounded-3xl px-5 pb-[9px] pt-[10px]"
                  >
                    <Typography.P2>{value}</Typography.P2>
                  </Badge.Outline>
                ))}
              </Container.FlexRow>
            </Container.FlexCol>
          </Container.FlexCol>
          <Container.FlexCol className="flex-1 gap-10 rounded-lg bg-brown6 p-6 text-brown laptop:gap-11 laptop:p-8">
            <Container.FlexCol className="gap-5 ">
              <Container.FlexRow className="gap-4">
                <Container.FlexRow className="gap-2">
                  <Typography.Head3 className="text-[1.3846153846rem] tablet:text-Head3">
                    {rentalTypesInfo[houseData.rental_type]}
                  </Typography.Head3>
                  <Typography.Head3 className="text-[1.3846153846rem] tablet:text-Head3">
                    {houseData.deposit_price}/{houseData.monthly_price}
                  </Typography.Head3>
                </Container.FlexRow>
                <Divider.Col />
                <Typography.P1 className="leading-6">
                  관리비 {houseData.manage_price}만원
                </Typography.P1>
              </Container.FlexRow>
              <Typography.P2>
                {houseData.region}시 {houseData.district}
              </Typography.P2>
            </Container.FlexCol>
            <Container.FlexCol className="gap-5">
              <Typography.SubTitle1>하우스 소개</Typography.SubTitle1>
              <Container.FlexRow className="flex-wrap items-center gap-3">
                <Icon type={houseTypesInfo[houseData.house_type].icon} />
                <Badge.Fill
                  active={false}
                  focus={false}
                  hover={false}
                  className="rounded-3xl px-5 py-2 text-white"
                >
                  <Typography.P2>
                    {houseTypesInfo[houseData.house_type].text}
                  </Typography.P2>
                </Badge.Fill>
                <Container.FlexRow className="gap-3 ">
                  <Typography.P2>{houseData.house_size}평</Typography.P2>
                  <Divider.Col className="border-t-0" />
                  <Typography.P2>방 {houseData.room_num}개</Typography.P2>
                  <Divider.Col />
                  <Typography.P2>{floorInfo[houseData.floor]}</Typography.P2>
                </Container.FlexRow>
              </Container.FlexRow>
            </Container.FlexCol>
            <Container.FlexCol className="gap-5">
              <Typography.SubTitle1>이런 특징이 있어요</Typography.SubTitle1>
              <Container.FlexRow className="flex-wrap gap-x-2 gap-y-3">
                {houseData.house_appeal.map(value => (
                  <Badge.Fill
                    focus={false}
                    hover={false}
                    active={false}
                    className="rounded-3xl px-5 py-2 text-white"
                    key={value}
                  >
                    <Typography.P2>{value}</Typography.P2>
                  </Badge.Fill>
                ))}
              </Container.FlexRow>
            </Container.FlexCol>
            <Container.FlexCol className="gap-6">
              <Typography.SubTitle1>원하는 룸메이트</Typography.SubTitle1>
              <Container.FlexRow className="items-center gap-5">
                <Typography.SubTitle3>기간</Typography.SubTitle3>
                <Badge.Outline
                  className="rounded-full px-4"
                  focus={false}
                  active={false}
                  hover={false}
                >
                  <Typography.P2 className="py-2.5">{termArray}</Typography.P2>
                </Badge.Outline>
              </Container.FlexRow>
              <Container.FlexCol className="gap-3">
                <Container.FlexRow className="items-center gap-5">
                  <Typography.SubTitle3>특징</Typography.SubTitle3>
                  <Container.FlexRow className="flex-wrap gap-2">
                    <BadgeIcon.Outline
                      iconType={
                        genderInfo[houseData.user_mate_style.mate_gender].icon
                      }
                    >
                      <Typography.P2 className="py-2.5">
                        {genderInfo[houseData.user_mate_style.mate_gender].text}
                      </Typography.P2>
                    </BadgeIcon.Outline>
                    <BadgeIcon.Outline
                      iconType={
                        mateNumInfo[houseData.user_mate_style?.mate_number].icon
                      }
                    >
                      <Typography.P2 className="py-2.5">
                        {
                          mateNumInfo[houseData.user_mate_style?.mate_number]
                            .text
                        }
                      </Typography.P2>
                    </BadgeIcon.Outline>
                    <Badge.Outline
                      className="rounded-full px-4"
                      focus={false}
                      active={false}
                      hover={false}
                    >
                      <Typography.P2 className="py-2.5">
                        {houseData.user_mate_style.prefer_mate_age[0]}살-
                        {houseData.user_mate_style.prefer_mate_age[1]}살
                      </Typography.P2>
                    </Badge.Outline>
                  </Container.FlexRow>
                </Container.FlexRow>
                <Container.FlexRow className="flex-wrap items-center gap-x-2 gap-y-3 pl-[3.125rem]">
                  {houseData.user_mate_style.mate_appeals.map(value => (
                    <Badge.Outline
                      focus={false}
                      active={false}
                      hover={false}
                      className="rounded-full px-4"
                      key={value}
                    >
                      <Typography.P2 className="py-2.5">{value}</Typography.P2>
                    </Badge.Outline>
                  ))}
                </Container.FlexRow>
              </Container.FlexCol>
            </Container.FlexCol>
          </Container.FlexCol>
        </Container>
        <Container.FlexCol className="gap-7 py-[3.25rem] text-brown laptop:py-[4.5rem] ">
          <Typography.SubTitle1>상세설명</Typography.SubTitle1>
          <Container.FlexCol className="rounded-lg bg-brown6 p-6">
            <pre className="whitespace-pre-wrap font-Noto-Sans-KR text-P2 leading-6">
              {houseData.describe}
            </pre>
          </Container.FlexCol>
        </Container.FlexCol>
        <Divider.Row />
      </Container.FlexCol>
    </Container.FlexCol>
  );
}
