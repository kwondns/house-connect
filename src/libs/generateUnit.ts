type ConvertToUnitFunction = (value: number, maxLimitValue: number) => string;

// ! 월 단위
export const generateUnitByTerm = (value: number, maxLimitValue: number) => {
  if (value === 0) return `0개월`;
  if (value > maxLimitValue)
    return Math.floor(value / 12) > 0
      ? `${maxLimitValue / 12}년`
      : `${value}개월`;

  const yearValue = Math.floor(value / 12);
  const monthValue = value % 12;
  const year = yearValue ? `${yearValue}년` : '';
  const month = monthValue ? `${monthValue}개월` : '';

  return `${year} ${month}`;
};

// ! 만 단위
export const generateUnitByPrice = (value: number, maxLimitValue: number) => {
  if (value === 0) return '0원';
  if (value > maxLimitValue)
    return value >= 10_000
      ? `${maxLimitValue / 10_000}억원`
      : `${maxLimitValue}만원`;

  const billionValue = Math.floor(value / 10_000); // ! 10억이지만, 억단위로 씀
  const thousandValue = Math.floor(value % 10_000); // ! 1000이지만, 만단위로 씀
  const billion = billionValue ? `${billionValue}억` : '';
  const thousand = thousandValue ? `${thousandValue}만` : '';

  return `${[billion, thousand].join(' ')}원`;
};

// ! 1살 단위
export const generateUnitByAge = (value: number, maxLimitValue: number) => {
  if (value === 0) return '20살';
  if (value > maxLimitValue) return `${maxLimitValue + 20}살`;

  return `${value + 20}살`;
};

export const convertUnitWithSuffix =
  (convertToUnitFunction: ConvertToUnitFunction) =>
  (value: number, maxLimitValue: number) => {
    const convertedUnit = convertToUnitFunction(value, maxLimitValue);

    return convertedUnit + (value > maxLimitValue ? ' 이상' : '');
  };

const unitConverters = {
  price: convertUnitWithSuffix(generateUnitByPrice),
  term: convertUnitWithSuffix(generateUnitByTerm),
  age: convertUnitWithSuffix(generateUnitByAge),
};

export default unitConverters;
