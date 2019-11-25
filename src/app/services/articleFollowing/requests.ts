import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { Article } from 'app/services/article';
import { FollowingChannel } from 'app/services/articleFollowing';
import { ArticleRequestQueries } from 'app/types';
import { buildArticleRequestQueriesToString } from 'app/utils/request';
import { AxiosResponse } from 'axios';

export interface FollowingChannelListResponse {
  totalCount: number;
  results: FollowingChannel[];
}

export interface FollowingArticleListResponse {
  totalCount: number;
  results: Article[];
}

export const requestFollowingChannelList = (requestQueries?: ArticleRequestQueries): Promise<FollowingChannelListResponse> => (
  request({
    url: `/article/me/followings${buildArticleRequestQueriesToString(requestQueries)}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<FollowingChannelListResponse>>(response, { recursive: true }).data)
);

export const requestFollowingArticleList = (page: number): Promise<FollowingArticleListResponse> => (
  request({
    url: `/article/me/feeds?size=12&page=${page}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<FollowingArticleListResponse>>(response, { recursive: true }).data)
);
