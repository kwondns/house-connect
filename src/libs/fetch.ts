// ! 추후 Axios 도입 시 에러 처리 추가
export const fetchGet = async <T>(
  url: string,
  providerToken?: string,
): Promise<T> => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (providerToken)
      Object.assign(headers, { Authorization: `Bearer ${providerToken}` });
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    return await response.json();
  } catch (error) {
    throw new Error('에러 발생');
  }
};
