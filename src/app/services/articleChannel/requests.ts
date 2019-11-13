import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { ArticleResponse } from 'app/services/article/requests';
import { ArticleChannel } from 'app/services/articleChannel';

import { ArticleRequestQueries } from 'app/types';
import { buildArticleRequestQueriesToString } from 'app/utils/request';

import { AxiosResponse, Method } from 'axios';

export interface ArticleChannelListResponse {
  totalCount: number;
  results: ArticleChannel[];
}

export interface ArticleChannelArticlesResponse {
  totalCount: number;
  results: ArticleResponse[];
}

export interface ArticleChannelFollowingResponse {
  channelId: number;
  isFollowing: boolean;
}

export const requestArticleChannelList = (requestQueries?: ArticleRequestQueries): Promise<ArticleChannelListResponse> => {
  const requestUrl = `/article/channels${buildArticleRequestQueriesToString(requestQueries)}`;

  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannelListResponse>>(response, { recursive : true }).data);
};

export const requestArticleChannelDetail = (channelId: number, requestQueries?: ArticleRequestQueries): Promise<ArticleChannel> => {
  const requestUrl = `/article/channels/${channelId}${buildArticleRequestQueriesToString(requestQueries)}`;

  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannel>>(response, { recursive : true }).data);
};

export const requestArticleChannelArticles = (channelId: number, page: number): Promise<ArticleChannelArticlesResponse> => (
  request({
    url: `/article/articles?channel_id=${channelId}&page=${page}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannelArticlesResponse>>(response, { recursive: true }).data)
);

export const requestArticleChannelFollowing = (channelId: number, method: Method): Promise<ArticleChannelFollowingResponse> => (
  request({
    url: '/article/me/followings',
    method,
    data: {
      channel_id: channelId,
    },
  }).then((response) => camelize<AxiosResponse<ArticleChannelFollowingResponse>>(response, { recursive: true }).data)
);
