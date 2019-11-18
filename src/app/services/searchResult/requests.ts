import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import env from 'app/config/env';
import { SearchResultArticle, SearchResultBook, SearchResultHighlight } from 'app/services/searchResult';
import { AxiosResponse } from 'axios';

export interface SearchBookResponse {
  bId: number;
  highlight: SearchResultHighlight;
  publisher: string;
}

export interface SearchArticleResponse {
  id: number;
  highlight: SearchResultHighlight;
}

export interface PublicSearchResultReponse {
  total: number;
  books: SearchBookResponse[];
  articles: SearchArticleResponse[];
}

export interface SearchResultResponse {
  totalCount: number;
  size: number;
  books?: SearchResultBook[];
  articles?: SearchResultArticle[];
}

export const requestSearchResult = (
  keyword: string,
  type: string,
  page: number,
): Promise<AxiosResponse<PublicSearchResultReponse>> => {
  const start = (page - 1) * 24;

  return request({
    url: `${env.SEARCH_API}/search`,
    method: 'get',
    params: {
      keyword,
      where: type,
      site: 'ridi-select',
      what: 'base',
      start,
    },
    withCredentials: false,
  }).then((response) =>
    camelize<AxiosResponse<PublicSearchResultReponse>>(response.data, { recursive: true }),
  );
};
