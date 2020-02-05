import { DateDTO } from 'app/types';
import { format, formatDistanceStrict } from 'date-fns';
import { ko } from 'date-fns/locale';

export const koreanDayOfWeek: string[] = ['월', '화', '수', '목', '금', '토', '일'];

export function convertDateForIos(dateString: DateDTO): Date {
  /** https://stackoverflow.com/questions/26657353/date-on-ios-device-returns-nan/26671796#comment76427981_26671796 */
  /** https://stackoverflow.com/questions/6427204/date-parsing-in-javascript-is-different-between-safari-and-chrome  */
  return new Date(
    dateString
      .replace(/-/g, '/')
      .replace('T', ' ')
      .replace(/\..*|\+.*/, ''),
  );
}

export const buildDateAndTimeFormat = (dateString?: string): string => {
  if (!dateString) {
    return '';
  }
  const date: Date = convertDateForIos(dateString);
  const formatString: string = format(date, 'yyyy.MM.dd. HH:mm');
  return formatString;
};

export const buildOnlyDateFormat = (dateString?: string): string => {
  if (!dateString) {
    return '';
  }
  const date: Date = convertDateForIos(dateString);
  const formatString: string = format(date, 'yyyy.MM.dd.');
  return formatString;
};

export const buildKoreanDayDateFormat = (dateString?: string): string => {
  if (!dateString) {
    return '';
  }
  const date: Date = convertDateForIos(dateString);
  const formatString: string = format(date, 'yyyy년 MM월 dd일');
  const weekDayIndex: number = parseInt(format(date, 'i', { locale: ko }), 10) - 1;
  return `${formatString}(${koreanDayOfWeek[weekDayIndex]})`;
};

export const buildDateDistanceFormat = (date: DateDTO) => {
  const curDate = new Date();
  const diffDate = new Date(date);
  return formatDistanceStrict(curDate, diffDate, { locale: ko });
};
