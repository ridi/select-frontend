import qs from 'qs';
import { AxiosResponse } from 'axios';
import request from 'app/config/axios';

import { camelize } from '@ridi/object-case-converter';

import env from 'app/config/env';
import { COUNT_PER_PAGE } from 'app/constants';
import { Article } from 'app/services/article';
import { ArticleRequestQueries } from 'app/types';
import { ArticleResponse } from 'app/services/article/requests';
import { buildArticleRequestQueriesToString } from 'app/utils/request';

export interface ArticleListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: ArticleResponse[];
}

export interface PopularArticleListResponse {
  totalPage: number;
  totalCount: number;
  size: number;
  articles: Article[];
}

export const requestArticles = (
  requestQueries?: ArticleRequestQueries,
  etcParams?: {
    articleIds?: number[];
    page?: number;
    size?: number;
  },
): Promise<ArticleListResponse> => {
  const additionalQueryString = qs.stringify(
    {
      page: etcParams?.page || 1,
      size: etcParams?.size || COUNT_PER_PAGE,
      ids: etcParams?.articleIds?.join(',') || undefined,
    },
    { encode: false },
  );
  return request({
    url: `/article/articles${buildArticleRequestQueriesToString(
      requestQueries,
    )}&${additionalQueryString}`,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<ArticleListResponse>>(response, { recursive: true }).data,
  );
};

export const requestPopularArticleList = ({
  page,
  countPerPage,
}: {
  page?: number;
  countPerPage?: number;
}): Promise<PopularArticleListResponse> => {
  const parameters = qs.stringify({ page, size: countPerPage });
  return request({
    url: `${env.BESTSELLER_API}/select/popular/articles?${parameters}`,
    method: 'GET',
    withCredentials: true,
  }).then(
    response =>
      camelize<AxiosResponse<PopularArticleListResponse>>(response, { recursive: true }).data,
  );
};
