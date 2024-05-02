import { useRecoilValue } from 'recoil';

import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import { AlertModalAtom } from '@/stores/globalModal.store';
import ModalContainer from '@/components/organisms/modals/ModalContainer';

export default function AlertModal() {
  const { title, message, onClickConfirm, buttonContent, isOpen } =
    useRecoilValue(AlertModalAtom);

  console.log('AlertModal rendered!!');

  return isOpen ? (
    <ModalContainer>
      <Container.FlexCol className="w-full max-w-96 gap-3 rounded-2xl bg-bg p-6 text-brown">
        <Container.FlexCol className="gap-6">
          <Typography.SubTitle3>{title}</Typography.SubTitle3>
          <Typography.P3>{message}</Typography.P3>
        </Container.FlexCol>
        <Container.FlexRow className="justify-end">
          <Button.Ghost
            onClick={onClickConfirm}
            type="button"
            className="translate-y-[15px] px-5 py-4"
          >
            <Typography.P3 className="font-semibold">
              {buttonContent}
            </Typography.P3>
          </Button.Ghost>
        </Container.FlexRow>
      </Container.FlexCol>
    </ModalContainer>
  ) : null;
}

AlertModal.defaultProps = {
  buttonContent: '확인',
  onClick: () => {},
};