export const toastErrorMessage = (message: string): string => {
  switch (message) {
    case 'Invalid login credentials':
      return '잘못된 로그인 정보입니다.';
    case 'Email not confirmed':
      return '인증을 완료해주세요.';
    case 'Token has expired or is invalid':
      return '토큰이 만료되었거나 유효하지 않습니다.';
    default:
      return '오류가 발생했습니다. 잠시 후 다시 시도해주세요';
  }
};
