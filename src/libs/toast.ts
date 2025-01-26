import { toast, Flip, ToastOptions } from 'react-toastify';

import { toastErrorMessage } from '@/constants/toastMessage';

/**
 * Toast를 생성합니다.
 *
 * 기본값으로 사용 시 createToast로 Toast 생성 후 successToast 혹은 errorToast로 변경하여 같이 사용합니다.
 *
 * 기본값으로 Pending 상태에서 사용되는 isLoading 활성화를 하여 Spinner가 생성됩니다.
 *
 * 단일 Toast 생성 시 options에 적절한 값을 전달하여 createToast 단독으로 사용합니다.
 *
 * 단일 Toast 사용 시 isLoading: false 옵션을 넣어 Pending 상태를 해제합니다.
 * @example
 * // Toast 생성
 * createToast('example', '샘플입니다.')
 * // Toast Success 변환
 * successToast('example', '성공 시 Toast 변환')
 * // Toast Error 변환
 * errorToast('example', '에러 Toast 변환')
 *
 * @example
 * // 단일 Toast 생성
 * createToast('example', '커스텀 토스트', {
 *    isPending: false,
 *    type: 'info',
 *    autoClose:3000
 *  }
 * )
 * @param {string} id 핸들링하기 위한 Toast의 id
 * @param {string} message Toast 의 내용
 * @param {ToastOptions} [options] 커스텀을 위한 Toast Option
 * @return Toast의 ID.
 * @note Return값을 사용하지 않아도 Toast는 생성
 */
export const createToast = (
  id: string,
  message: string,
  options?: ToastOptions,
) =>
  toast(message, {
    toastId: id,
    autoClose: false,
    isLoading: true,
    ...options,
  });

export const successToast = (id: string, message: string) =>
  toast.update(id, {
    render: message,
    delay: 500,
    type: 'success',
    autoClose: 1500,
    transition: Flip,
    isLoading: false,
  });

export const errorToast = (id: string, message: string) =>
  toast.update(id, {
    render: toastErrorMessage(message),
    delay: 500,
    type: 'error',
    autoClose: 1500,
    transition: Flip,
    isLoading: false,
  });

/**
 * Toast를 제거합니다.
 * @param {string} id 제거할 Toast의 id
 */
export const removeToast = (id: string) => {
  toast.dismiss(id);
};
