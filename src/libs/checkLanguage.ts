const isKorean = (text: string) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);

const isEnglish = (text: string) => /[A-Za-z]/.test(text);

export { isKorean, isEnglish };
