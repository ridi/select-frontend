import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { FavoriteArticle } from 'app/services/articleFavorite';
import { AxiosResponse, Method } from 'axios';

export interface FavoriteArticleListResponse {
  totalCount: number;
  results: FavoriteArticle[];
}

export interface FavoriteArticleActionResponse {
  articleId: number;
  isFavorite: boolean;
}

export const requestFavoriteArticleList = (): Promise<FavoriteArticleListResponse> => {
  const requestUrl = `/article/me/favorites`;

  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<FavoriteArticleListResponse>>(response, { recursive : true }).data);
};

export const requestFavoriteArticleAction = (method: Method, articleId: number): Promise<FavoriteArticleActionResponse> => {
  return request({
    url: `/article/me/favorites`,
    method,
    data: {
      article_id: articleId,
    },
  }).then((response) => camelize<AxiosResponse<FavoriteArticleActionResponse>>(response, { recursive: true }).data);
};
