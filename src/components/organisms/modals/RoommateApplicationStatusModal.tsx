import { useRecoilValue, useResetRecoilState } from 'recoil';

import ModalBackdrop from './ModalBackdrop';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import IconButton from '@/components/molecules/IconButton';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Icon from '@/components/atoms/Icon';
import { RoommateApplicationAtom } from '@/stores/globalModal.store';
import Avatar from '@/components/atoms/Avatar';

export default function RoomMateApplicationStatus() {
  //! Todo: 프로필 이미지, 유저네임, 배지스, 자기소개 문구, 1:1 대화, close 버튼
  const {
    isOpen,
    profileImage,
    userName,
    roommateAppeals,
    introduceContent,
    onClickChat,
    onClickCancel,
    onClickConfirm,
  } = useRecoilValue(RoommateApplicationAtom);
  const resetRoommateApplicationModal = useResetRecoilState(
    RoommateApplicationAtom,
  );
  const onClickCloseIcon = () => resetRoommateApplicationModal();

  return isOpen ? (
    <ModalBackdrop modalType="RoommateApplicationStatus">
      <Container.FlexCol className="max-h-[566px] w-full max-w-[874px] bg-bg p-8 text-brown">
        <Container.FlexRow className="justify-between border-b-[0.5px] border-brown pb-7">
          <Typography.Head3 className="">신청 현황</Typography.Head3>
          <IconButton
            iconType="close"
            button="Ghost"
            onClick={onClickCloseIcon}
            iconClassName="size-6"
          />
        </Container.FlexRow>
        <Container.FlexCol className="pt-6">
          <Typography.SubTitle2 className="mb-6">
            신청한 인원 1명
          </Typography.SubTitle2>
          <Container.FlexCol className="max-h-96 w-full items-start gap-8 rounded-lg bg-brown6 p-6">
            <Container.FlexRow className="max-w-xl gap-7">
              {/* <Container.FlexRow className="size-[70px] rounded-full bg-brown" /> */}
              {profileImage ? (
                <Avatar.XL src={profileImage} alt="Profile Image" />
              ) : (
                <Icon className="[&>svg]:size-16 " type="avatar" />
              )}
              <Container.FlexCol className="gap-7">
                <Typography.Head3>{userName}</Typography.Head3>
                <Container.FlexRow className="flex flex-wrap gap-2.5">
                  {roommateAppeals.map(appeal => (
                    <Badge.Outline
                      key={appeal}
                      className="rounded-3xl px-[20px] py-[10px]"
                    >
                      {appeal}
                    </Badge.Outline>
                  ))}
                </Container.FlexRow>
                <Typography.P3 className="text-base">
                  {introduceContent}
                </Typography.P3>
              </Container.FlexCol>
            </Container.FlexRow>
            <Container.FlexRow className="w-full flex-wrap items-start justify-between gap-2 border-t-[0.5px] border-brown pt-7">
              <Button.Outline
                onClick={onClickChat}
                className="rounded-3xl bg-brown6 px-11 py-3"
              >
                1:1 대화
              </Button.Outline>
              <Container.FlexRow className="gap-3">
                <Button.Outline
                  onClick={onClickCancel}
                  className="rounded-3xl bg-brown6 px-11 py-3"
                >
                  거절
                </Button.Outline>
                <Button.Fill
                  onClick={onClickConfirm}
                  className="rounded-3xl px-11 py-3 text-brown3"
                >
                  수락
                </Button.Fill>
              </Container.FlexRow>
            </Container.FlexRow>
          </Container.FlexCol>
        </Container.FlexCol>
      </Container.FlexCol>
    </ModalBackdrop>
  ) : null;
}
