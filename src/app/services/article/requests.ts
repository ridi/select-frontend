import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';

import request from 'app/config/axios';
import { Article } from 'app/services/article';
import { ChannelResponse } from 'app/services/articleChannel/request';
import { ArticleRequestIncludableData, DateDTO } from 'app/types';

export interface AuthorResponse {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  channelId: number;
}

export interface ArticleResponse extends Article {
  author?: AuthorResponse;
  channel?: ChannelResponse;
  content?: string;
  teaserContent?: string;
}

export interface ArticleListResponse {
  totalCount: number;
  totalPage: number;
  next?: string;
  previous?: string;
  results: ArticleResponse[];
}

export const requestArticles = (includeData?: ArticleRequestIncludableData[]): Promise<ArticleListResponse> => {
  let requestUrl = '/article/articles';
  if (includeData) {
    requestUrl = `${requestUrl}?include=${includeData.join('|')}`;
  }
  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleListResponse>>(response, { recursive: true }).data);
};

export const requestArticleWithId = (articleId: number, includeData?: ArticleRequestIncludableData[]): Promise<ArticleResponse> => {
  let requestUrl = `/article/articles/${articleId}`;
  if (includeData) {
    requestUrl = `${requestUrl}?include=${includeData.join('|')}`;
  }
  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleResponse>>(response, { recursive: true }).data);
};
