import { useRecoilValue, useResetRecoilState } from 'recoil';

import { ProfileModalAtom } from '@/stores/globalModal.store';
import ModalBackdrop from '@/components/organisms/modals/ModalBackdrop';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import Icon from '@/components/atoms/Icon';
import Img from '@/components/atoms/Img';
import Button from '@/components/atoms/Button';
import IconButton from '@/components/molecules/IconButton';

export default function ProfileModal() {
  const {
    isOpen,
    profileImage,
    profileMessage,
    buttonContent,
    onClickChat,
    userName,
  } = useRecoilValue(ProfileModalAtom);
  const resetProfileModal = useResetRecoilState(ProfileModalAtom);

  const onClickCloseIcon = () => resetProfileModal();

  return isOpen ? (
    <ModalBackdrop modalType="Profile">
      {/* <Icon type="close" /> */}
      <Container.FlexCol className="relative w-full max-w-96 cursor-auto overflow-hidden rounded-xl">
        {/* [&>svg>path]:scale-[2] [&>svg]:size-6 */}
        <IconButton
          type="button"
          button="Ghost"
          iconType="close"
          fill="bg"
          className="absolute right-4 top-4 [&_svg]:size-6 [&_svg_path]:scale-[1.8]"
          onClick={onClickCloseIcon}
        />

        <Container.FlexRow className="h-96 max-h-96 w-full items-center justify-center bg-brown">
          {profileImage ? (
            <Img src={profileImage} alt="Profile Image" />
          ) : (
            <Icon className="cursor-pointer [&>svg]:size-52" type="avartar" />
          )}
        </Container.FlexRow>
        <Container.FlexCol className="items-center bg-bg">
          <Container.FlexCol className="w-full items-center border border-b-brown1/50 pb-9 pt-8">
            <Typography.SubTitle1 className="text-brown">
              {userName}
            </Typography.SubTitle1>
            <Typography.P2 className="mt-8 text-brown">
              {profileMessage}
            </Typography.P2>
          </Container.FlexCol>
          <Container.FlexCol
            onClick={onClickChat}
            className="w-full items-center py-8"
          >
            <Button.Ghost type="button" className="">
              <Typography.P1 className="font-semibold text-brown">
                {buttonContent}
              </Typography.P1>
            </Button.Ghost>
          </Container.FlexCol>
        </Container.FlexCol>
      </Container.FlexCol>
    </ModalBackdrop>
  ) : null;
}
