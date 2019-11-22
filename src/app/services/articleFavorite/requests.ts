import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { FavoriteArticle } from 'app/services/articleFavorite';
import { AxiosResponse } from 'axios';

export interface FavoriteArticleListResponse {
  totalCount: number;
  results: FavoriteArticle[];
}

export const requestFavoriteArticleList = (): Promise<FavoriteArticleListResponse> => {
  const requestUrl = '/article/me/favorites';

  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<FavoriteArticleListResponse>>(response, { recursive : true }).data);
};
