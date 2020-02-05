import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { Article } from 'app/services/article';
import { FollowingChannel } from 'app/services/articleFollowing';
import { ArticleRequestQueries, DateDTO } from 'app/types';
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

export interface UnseenFollowingFeedsResponse {
  totalPage: number;
  totalCount: number;
  results: number[];
}

export interface SetAllFollowingFeedsToSeenResponse {
  feedLastSeenTime: DateDTO;
}

export const requestFollowingChannelList = (
  requestQueries?: ArticleRequestQueries,
): Promise<FollowingChannelListResponse> =>
  request({
    url: `/article/me/following${buildArticleRequestQueriesToString(requestQueries)}&size=100`,
    method: 'GET',
  }).then(
    response =>
      camelize<AxiosResponse<FollowingChannelListResponse>>(response, { recursive: true }).data,
  );

export const requestFollowingArticleList = (
  page: number,
  requestQueries?: ArticleRequestQueries,
): Promise<FollowingArticleListResponse> =>
  request({
    url: `/article/me/feeds${buildArticleRequestQueriesToString(
      requestQueries,
    )}&size=12&page=${page}`,
    method: 'GET',
  }).then(
    response =>
      camelize<AxiosResponse<FollowingArticleListResponse>>(response, { recursive: true }).data,
  );

export const requestUnseenFollowingFeeds = (): Promise<UnseenFollowingFeedsResponse> =>
  request({
    url: '/article/me/feeds/unseen',
    method: 'GET',
  }).then(
    response =>
      camelize<AxiosResponse<UnseenFollowingFeedsResponse>>(response, { recursive: true }).data,
  );

export const requestUnseenFollowingFeedsToSeen = (): Promise<SetAllFollowingFeedsToSeenResponse> =>
  request({
    url: '/article/me/feeds/unseen',
    method: 'POST',
  }).then(
    response =>
      camelize<AxiosResponse<SetAllFollowingFeedsToSeenResponse>>(response, { recursive: true })
        .data,
  );
