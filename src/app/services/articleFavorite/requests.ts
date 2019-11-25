import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { FavoriteArticle } from 'app/services/articleFavorite';
import { AxiosResponse } from 'axios';

export interface FavoriteArticleListResponse {
  totalCount: number;
  results: FavoriteArticle[];
}

export const requestFavoriteArticleList = (page: number): Promise<FavoriteArticleListResponse> => {
  const requestUrl = `/article/me/favorites?size=12&page=${page}`;

  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<FavoriteArticleListResponse>>(response, { recursive : true }).data);
};
