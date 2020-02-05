const LOCAL_STORAGE_KEY = 'rs.search';

export interface SearchLocalStorageData {
  history: {
    enabled: boolean;
    bookKeywordList: string[];
    articleKeywordList: string[];
  };
}

export const removeFromArray = (targetArray: any[], targetValue: any): any[] =>
  targetArray.filter((element: any) => element !== targetValue);

export const localStorageManager = (() => ({
  load: (): SearchLocalStorageData => {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
    const parsedLocalStorageData =
      localStorageData === ''
        ? {
            enabled: true,
            bookKeywordList: [],
            articleKeywordList: [],
          }
        : JSON.parse(localStorageData).history;
    const parseData: SearchLocalStorageData = {
      history: {
        enabled:
          parsedLocalStorageData.enabled !== undefined && parsedLocalStorageData.enabled !== null
            ? parsedLocalStorageData.enabled
            : true,
        bookKeywordList: parsedLocalStorageData.bookKeywordList
          ? parsedLocalStorageData.bookKeywordList
          : [],
        articleKeywordList: parsedLocalStorageData.articleKeywordList
          ? parsedLocalStorageData.articleKeywordList
          : [],
      },
    };
    return {
      history: parseData.history,
    };
  },
  save: (state: SearchLocalStorageData): void => {
    const newData: SearchLocalStorageData = localStorageManager.load();
    newData.history = {
      enabled: state.history.enabled,
      bookKeywordList: state.history.bookKeywordList,
      articleKeywordList: state.history.articleKeywordList,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  },
}))();

export function getAuthorsCount(authors?: string): number {
  return authors ? authors.split(', ').length : 0;
}

export function getSortedAuthorsHtmlString(
  authors: string,
  totalAuthorsCount: number,
  count = 2,
): string {
  const redundantCount = totalAuthorsCount - count;
  return authors
    .split(', ')
    .filter((str: string) => str.length > 0)
    .sort((a, b) => {
      if (/<strong.+<\/strong>/.test(a)) {
        return -1;
      }
      if (/<strong.+<\/strong>/.test(b)) {
        return 1;
      }
      return 0;
    })
    .slice(0, count)
    .join(', ')
    .concat(redundantCount > 0 ? ` 외 ${redundantCount}명` : '');
}
