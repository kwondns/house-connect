export type ModalType =
  | 'Alert'
  | 'Confirm'
  | 'Profile'
  | 'RoommateApplicationStatus';

export type ModalStateByType = {
  Alert: AlertModalState;
  Confirm: ConfirmModalState;
  Profile: ProfileModalState;
  RoommateApplicationStatus: RoommateApplicationState;
};

export type AlertModalState = {
  isOpen: boolean;
  type: 'Alert';
  title: string;
  message: string;
  buttonContent: string;
  onClickConfirm: () => void;
};

export type ConfirmModalState = {
  isOpen: boolean;
  type: 'Confim';
  title: string;
  message: string;
  onClickCancel: () => void;
  onClickConfirm: () => void;
  confirmButtonContent: string;
  cancelButtonContent: string;
};

export type ProfileModalState = {
  isOpen: boolean;
  type: 'Profile';
  onClickChat: () => void;
  userId: string;
  userName: string;
  profileMessage: string;
  profileImage: string;
  buttonContent: string;
};
export type RoommateApplicationState = {
  isOpen: boolean;
  type: 'RoommateApplicationStatus';
  profileImage: string;
  userName: string;
  roommateAppeals: string[];
  introduceContent: string;
  onClickChat: () => void;
  onClickCancel: () => void;
  onClickConfirm: () => void;
};
