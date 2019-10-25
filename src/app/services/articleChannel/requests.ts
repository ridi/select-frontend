import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { ArticleResponse } from 'app/services/article/requests';
import { ArticleChannel } from 'app/services/articleChannel';
import { ArticleRequestIncludableData } from 'app/types';
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

export const requestArticleChannelList = (includeData?: ArticleRequestIncludableData[]): Promise<ArticleChannelListResponse> => (
  request({
    url: `/article/channels${includeData && `/?include=${includeData.join('|')}`}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannelListResponse>>(response, { recursive : true }).data)
);

export const requestArticleChannelDetail = (channelId: number, includeData: ArticleRequestIncludableData[]): Promise<ArticleChannel> => (
  request({
    url: `/article/channels/${channelId}?include=${includeData.join('|')}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannel>>(response, { recursive : true }).data)
);

export const requestArticleChannelArticles = (channelId: number, page: number): Promise<ArticleChannelArticlesResponse> => (
  request({
    url: `/article/articles?channel_id=${channelId}&page=${page}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannelArticlesResponse>>(response, { recursive: true }).data)
);

export const requestArticleChannelFollowing = (channelId: number, method: Method): Promise<ArticleChannelFollowingResponse> => (
  request({
    url: `/article/me/followings/${channelId}`,
    method,
  }).then((response) => camelize<AxiosResponse<ArticleChannelFollowingResponse>>(response, { recursive: true }).data)
);
