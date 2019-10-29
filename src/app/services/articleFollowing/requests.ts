import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { Article } from 'app/services/article';
import { FollowingChannel } from 'app/services/articleFollowing';
import { AxiosResponse } from 'axios';

export interface FollowingChannelListResponse {
  totalCount: number;
  results: FollowingChannel[];
}

export interface FollowingArticleListResponse {
  totalCount: number;
  results: Article[];
}

export const requestFollowingChannelList = (): Promise<FollowingChannelListResponse> => (
  request({
    url: `/article/me/followings?include=channel`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<FollowingChannelListResponse>>(response, { recursive: true }).data)
);

export const requestFollowingArticleList = (page: number): Promise<FollowingArticleListResponse> => (
  request({
    url: `/article/me/feeds`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<FollowingArticleListResponse>>(response, { recursive: true }).data)
);
