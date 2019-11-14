import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { SearchResultBook } from 'app/services/searchResult';
import { AxiosResponse } from 'axios';

export interface SearchResultReponse {
  totalCount: number;
  size: number;
  books: SearchResultBook[];
}

export const requestSearchResult = (
  keyword: string,
  page: number,
): Promise<AxiosResponse<SearchResultReponse>> =>
  request({
    url: `/api/search`,
    method: 'get',
    params: {
      keyword,
      page,
    },
  }).then((response) =>
    camelize<AxiosResponse<SearchResultReponse>>(response.data, { recursive: true }),
  );
