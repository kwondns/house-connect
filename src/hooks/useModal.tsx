import { useRecoilState, useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';

import { ModalType } from '@/types/modal.type';
import { GlobalModalAtom, ModalSelector } from '@/stores/globalModal.store';

export default function useModal<T extends ModalType>(modalType: T) {
  const setGlobalModalState = useSetRecoilState(GlobalModalAtom);
  const [modalState, setModalState] = useRecoilState(ModalSelector(modalType));

  const openModal = useCallback(
    () => setModalState(prev => ({ ...prev, isOpen: true })),
    [setModalState],
  );
  const closeModal = useCallback(
    () => setModalState(prev => ({ ...prev, isOpen: false })),
    [setModalState],
  );
  const getModalState = () => modalState;

  // ! globalModal의 modalType에 따라 최종적으로 한 개의 modal(SelectedModal)이 되므로,
  // ! type에 따른 modal의 state가 바뀔 때 GlobalModalState의 modalType을 변경해주어야 한다.
  useEffect(() => {
    setGlobalModalState(modalType);
  }, [modalState, modalType, setGlobalModalState]);

  return {
    openModal,
    closeModal,
    getModalState,
    setModalState,
    isModalOpen: modalState.isOpen,
  };
}
