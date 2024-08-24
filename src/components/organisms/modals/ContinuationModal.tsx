import { useRecoilValue } from 'recoil';

import { ContinuationModalAtom } from '@/stores/globalModal.store';
import ModalBackdrop from '@/components/organisms/modals/ModalBackdrop';
import Container from '@/components/atoms/Container';
import Typography from '@/components/atoms/Typography';
import Button from '@/components/atoms/Button';

export default function ContinuationModal() {
  const {
    isOpen,
    title,
    message,
    onClickCancel,
    onClickContinue,
    cancelButtonContent,
    continueButtonContent,
  } = useRecoilValue(ContinuationModalAtom);

  return isOpen ? (
    <ModalBackdrop modalType="Continue">
      <Container.FlexCol className="w-full max-w-96 cursor-auto rounded-2xl bg-bg text-brown">
        <Container.FlexCol className="gap-5 p-6">
          <Typography.SubTitle3>{title}</Typography.SubTitle3>
          <Typography.P3 className="whitespace-pre-line text-start leading-6">
            {message}
          </Typography.P3>
        </Container.FlexCol>
        <Container.FlexRow className="justify-end pb-[10px] pr-[10px]">
          <Button.Ghost
            onClick={onClickCancel}
            type="button"
            className="py-2 px-4 "
          >
            <Typography.P3 className="font-semibold">
              {cancelButtonContent}
            </Typography.P3>
          </Button.Ghost>
          <Button.Ghost
            onClick={onClickContinue}
            type="button"
            className="py-2 px-4"
          >
            <Typography.P3 className="font-semibold text-point">
              {continueButtonContent}
            </Typography.P3>
          </Button.Ghost>
        </Container.FlexRow>
      </Container.FlexCol>
    </ModalBackdrop>
  ) : null;
}

ContinuationModal.defaultProps = {
  onClickCancel: () => {},
  onClickContinue: () => {},
  cancelButtonContent: '취소',
  continueButtonContent: '이어쓰기',
};
