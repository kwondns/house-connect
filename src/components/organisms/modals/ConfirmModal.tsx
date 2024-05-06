import { useRecoilValue } from 'recoil';

import Button from '@/components/atoms/Button';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import { ConfirmModalAtom } from '@/stores/globalModal.store';
import ModalBackdrop from '@/components/organisms/modals/ModalBackdrop';

export default function ConfirmModal() {
  const {
    isOpen,
    title,
    message,
    confirmButtonContent,
    cancelButtonContent,
    onClickConfirm,
    onClickCancel,
  } = useRecoilValue(ConfirmModalAtom);

  return isOpen ? (
    <ModalBackdrop modalType="Confirm">
      <Container.FlexCol className="w-full max-w-96 cursor-auto gap-3 rounded-2xl bg-bg p-6 text-brown">
        <Container.FlexCol className="gap-6">
          <Typography.SubTitle3>{title}</Typography.SubTitle3>
          <Typography.P3>{message}</Typography.P3>
        </Container.FlexCol>
        <Container.FlexRow className="justify-end">
          <Button.Ghost
            onClick={onClickCancel}
            type="button"
            className="translate-y-[15px] px-5 py-4"
          >
            <Typography.P3 className="font-semibold">
              {cancelButtonContent}
            </Typography.P3>
          </Button.Ghost>
          <Button.Ghost
            onClick={onClickConfirm}
            type="button"
            className="translate-y-[15px] px-5 py-4"
          >
            <Typography.P3 className="font-semibold">
              {confirmButtonContent}
            </Typography.P3>
          </Button.Ghost>
        </Container.FlexRow>
      </Container.FlexCol>
    </ModalBackdrop>
  ) : null;
}

ConfirmModal.defaultProps = {
  onClickCancel: () => {},
  onClickConfirm: () => {},
  confirmButtonContent: '확인',
  cancelButtonContent: '취소',
};
