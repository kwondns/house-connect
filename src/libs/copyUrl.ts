import { createToast } from '@/libs/toast';

const copyUrl = () => {
  const currentUrl = window.location.href;
  navigator.clipboard
    .writeText(currentUrl)
    .then(() => {
      createToast('copy_url', '링크가 복사 되었습니다.', {
        isLoading: false,
        type: 'success',
        autoClose: 1000,
      });
    })
    .catch(error => {
      createToast('error_copy', '링크 복사 실패', {
        isLoading: false,
        type: error,
        autoClose: 1000,
      });
    });
};
export default copyUrl;
