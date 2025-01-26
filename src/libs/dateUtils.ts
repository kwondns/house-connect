const formatDateByCountry = (
  date: Date,
  time: boolean = false,
  locale: Intl.LocalesArgument = 'ko-KR',
) => {
  if (time) {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const isToday = (date1: Date, date2: Date) =>
  formatDateByCountry(date1) === formatDateByCountry(date2);

export { formatDateByCountry, isToday };
