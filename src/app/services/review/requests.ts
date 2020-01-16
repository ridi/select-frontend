import { camelize, CamelizeOpts, decamelize } from '@ridi/object-case-converter';
import { AxiosResponse } from 'axios';
import { snakeCase } from 'lodash-es';

import request from 'app/config/axios';
import { Omit, TextWithLF } from 'app/types';

import env from 'app/config/env';
import {
  ReviewSortingCriteria,
  UserFilterType,
} from './constants';
import { Comment, Review, ReviewSummary } from './reducer.state';

export interface RequestReviewsParameters {
  userFilterType: UserFilterType;
  sortBy: ReviewSortingCriteria;
  page: number;
}

export interface ResponseDataReview {
  my: {
    review: ResponseReview;
  };
  reviewSummary: ReviewSummary;
}

export interface DeleteRatingResponseDataReview extends Omit<ResponseDataReview, 'my'> {
  my: {
    review: null;
  };
}

export type ResponseComment = Omit<Comment, 'fetchStatus'>;

export interface ResponseComments {
  totalCount: number;
  size: number;
  comments: ResponseComment[];
}

export interface ResponseReviewDiff {
  commentTotalCount: number;
  size: number;
  comments: ResponseComment[];
  content: TextWithLF | null;
}

export type ResponseReview = Omit<
Review,
'commentIdsByPage' | 'commentsById' | 'fetchStatus' | 'commentInput' | 'content'
> & ResponseReviewDiff;

export interface ResponseReviews {
  totalCount: number;
  size: number;
  reviews: ResponseReview[];
  my: {
    review: ResponseReview;
  };
  reviewSummary: ReviewSummary;
}

export const camelizeOptions: CamelizeOpts = {
  recursive: true,
};

export const requestGetReviews = (
  bookId: number,
  params: RequestReviewsParameters,
): Promise<AxiosResponse<ResponseReviews>> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews`,
  method: 'GET',
  params: decamelize({
    page: params.page,
    sort: snakeCase(params.sortBy),
    buyerOnly: params.userFilterType === UserFilterType.buyer,
  }),
}).then((response: AxiosResponse<object>) =>
  camelize<AxiosResponse<ResponseReviews>>(response, camelizeOptions));

export const requestPostReview = (
  bookId: number,
  content: TextWithLF,
  hasSpoiler: boolean,
): Promise<AxiosResponse<ResponseDataReview>> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/my/content`,
  method: 'POST',
  data: decamelize({ content, hasSpoiler }),
}).then((response: AxiosResponse<object>) =>
  camelize<AxiosResponse<ResponseDataReview>>(response, camelizeOptions));

export const requestDeleteReview = (
  bookId: number,
): Promise<AxiosResponse<ResponseDataReview>> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/my/content`,
  method: 'DELETE',
}).then((response: AxiosResponse<object>) =>
  camelize<AxiosResponse<ResponseDataReview>>(response, camelizeOptions));

export const requestPostRating = (
  bookId: number,
  rating: number,
): Promise<AxiosResponse<ResponseDataReview>> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/my/rating`,
  method: 'POST',
  data: decamelize({ rating }),
}).then((response: AxiosResponse<object>) =>
  camelize<AxiosResponse<ResponseDataReview>>(response, camelizeOptions));

export const requestDeleteRating = (
  bookId: number,
): Promise<AxiosResponse<DeleteRatingResponseDataReview>> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/my/rating`,
  method: 'DELETE',
}).then((response: AxiosResponse<object>) =>
  camelize<AxiosResponse<DeleteRatingResponseDataReview>>(response, camelizeOptions));

export const requestReportReview = (
  bookId: number,
  reviewId: number,
  reason: number,
): Promise<AxiosResponse> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/${reviewId}/report`,
  method: 'POST',
  data: decamelize({ reason }),
});

export const requestLikeReview = (
  bookId: number,
  reviewId: number,
): Promise<AxiosResponse> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/${reviewId}/like`,
  method: 'POST',
});

export const requestCancelReviewLike = (
  bookId: number,
  reviewId: number,
): Promise<AxiosResponse> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/${reviewId}/like`,
  method: 'DELETE',
});

export const requestPostComment = (
  bookId: number,
  reviewId: number,
  content: TextWithLF,
): Promise<AxiosResponse<ResponseComment>> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/${reviewId}/comments`,
  method: 'POST',
  data: decamelize({ content }),
}).then((response: AxiosResponse<object>) =>
  camelize<AxiosResponse<ResponseComment>>(response, camelizeOptions));

export const requestDeleteComment = (
  bookId: number,
  reviewId: number,
  commentId: number,
): Promise<AxiosResponse> => request({
  url: `${env.STORE_API}/api/select/books/${bookId}/reviews/${reviewId}/comments/${commentId}`,
  method: 'DELETE',
});
