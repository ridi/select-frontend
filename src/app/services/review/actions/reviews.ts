import { Action } from 'app/services/review/types';
import { TextWithLF } from 'app/types';

import { AxiosError } from 'axios';
import { ReviewSortingCriteria, UserFilterType } from '../constants';
import { ReviewSummary } from '../reducer.state';
import { RequestReviewsParameters, ResponseReview, ResponseReviews } from '../requests';
import { ActionEndEditingReview, ActionStartEditingReview } from './reviews';

export const GET_REVIEWS_REQUEST = 'GET_REVIEWS_REQUEST';
export const GET_REVIEWS_SUCCESS = 'GET_REVIEWS_SUCCESS';
export const GET_REVIEWS_FAILURE = 'GET_REVIEWS_FAILURE';

export const RESET_REVIEW_PAGES = 'RESET_REVIEW_PAGES';

export const CHANGE_USER_FILTER_TAB = 'CHANGE_USER_FILTER_TAB';
export const CHANGE_SORT_BY = 'CHANGE_SORT_BY';

export const POST_REVIEW_REQUEST = 'POST_REVIEW_REQUEST';
export const POST_REVIEW_SUCCESS = 'POST_REVIEW_SUCCESS';
export const POST_REVIEW_FAILURE = 'POST_REVIEW_FAILURE';

export const DELETE_REVIEW_REQUEST = 'DELETE_REVIEW_REQUEST';
export const DELETE_REVIEW_SUCCESS = 'DELETE_REVIEW_SUCCESS';
export const DELETE_REVIEW_FAILURE = 'DELETE_REVIEW_FAILURE';

export const START_EDITING_REVIEW = 'START_EDITING_REVIEW';
export const END_EDITING_REVIEW = 'END_EDITING_REVIEW';

export type ActionGetReviewsRequest = Action<
  typeof GET_REVIEWS_REQUEST,
  {
    bookId: number;
    params: RequestReviewsParameters;
  }
>;
export type ActionGetReviewsSuccess = Action<
  typeof GET_REVIEWS_SUCCESS,
  {
    bookId: number;
    params: RequestReviewsParameters;
    response: ResponseReviews;
  }
>;
export type ActionGetReviewsFailure = Action<
  typeof GET_REVIEWS_FAILURE,
  {
    bookId: number;
    params: RequestReviewsParameters;
  }
>;

export type ActionResetReviewPages = Action<
  typeof RESET_REVIEW_PAGES,
  {
    bookId: number;
  }
>;

export type ActionChangeUserFilterTab = Action<
  typeof CHANGE_USER_FILTER_TAB,
  {
    bookId: number;
    userFilterType: UserFilterType;
  }
>;
export type ActionChangeSortBy = Action<
  typeof CHANGE_SORT_BY,
  {
    bookId: number;
    sortBy: ReviewSortingCriteria;
  }
>;

export type ActionPostReviewRequest = Action<
  typeof POST_REVIEW_REQUEST,
  {
    bookId: number;
    content: TextWithLF;
    hasSpoiler: boolean;
  }
>;
export type ActionPostReviewSuccess = Action<
  typeof POST_REVIEW_SUCCESS,
  {
    bookId: number;
    review: ResponseReview;
    reviewSummary: ReviewSummary;
  }
>;
export type ActionPostReviewFailure = Action<
  typeof POST_REVIEW_FAILURE,
  {
    bookId: number;
    error?: AxiosError;
  }
>;

export type ActionDeleteReviewRequest = Action<
  typeof DELETE_REVIEW_REQUEST,
  {
    bookId: number;
  }
>;
export type ActionDeleteReviewSuccess = Action<
  typeof DELETE_REVIEW_SUCCESS,
  {
    bookId: number;
    review: ResponseReview;
    reviewSummary: ReviewSummary;
  }
>;
export type ActionDeleteReviewFailure = Action<
  typeof DELETE_REVIEW_FAILURE,
  {
    bookId: number;
    error?: AxiosError;
  }
>;

export type ActionStartEditingReview = Action<
  typeof START_EDITING_REVIEW,
  {
    bookId: number;
  }
>;
export type ActionEndEditingReview = Action<
  typeof END_EDITING_REVIEW,
  {
    bookId: number;
  }
>;

export type ReviewsActionTypes =
  | ActionGetReviewsRequest
  | ActionGetReviewsSuccess
  | ActionGetReviewsFailure
  | ActionResetReviewPages
  | ActionChangeUserFilterTab
  | ActionChangeSortBy
  | ActionPostReviewRequest
  | ActionPostReviewSuccess
  | ActionPostReviewFailure
  | ActionDeleteReviewRequest
  | ActionDeleteReviewSuccess
  | ActionDeleteReviewFailure
  | ActionStartEditingReview
  | ActionEndEditingReview;

export const getReviewsRequest = (
  bookId: number,
  params: RequestReviewsParameters,
): ActionGetReviewsRequest => ({ type: GET_REVIEWS_REQUEST, payload: { bookId, params } });

export const getReviewsSuccess = (
  bookId: number,
  params: RequestReviewsParameters,
  response: ResponseReviews,
): ActionGetReviewsSuccess => ({
  type: GET_REVIEWS_SUCCESS,
  payload: { bookId, params, response },
});

export const getReviewsFailure = (
  bookId: number,
  params: RequestReviewsParameters,
): ActionGetReviewsFailure => ({ type: GET_REVIEWS_FAILURE, payload: { bookId, params } });

export const resetReviews = (bookId: number): ActionResetReviewPages => ({
  type: RESET_REVIEW_PAGES,
  payload: { bookId },
});

export const changeUserFilterTab = (
  bookId: number,
  userFilterType: UserFilterType,
): ActionChangeUserFilterTab => ({
  type: CHANGE_USER_FILTER_TAB,
  payload: { bookId, userFilterType },
});

export const changeSortBy = (
  bookId: number,
  sortBy: ReviewSortingCriteria,
): ActionChangeSortBy => ({ type: CHANGE_SORT_BY, payload: { bookId, sortBy } });

export const postReviewRequest = (
  bookId: number,
  content: TextWithLF,
  hasSpoiler: boolean,
): ActionPostReviewRequest => ({
  type: POST_REVIEW_REQUEST,
  payload: { bookId, content, hasSpoiler },
});

export const postReviewSuccess = (
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
): ActionPostReviewSuccess => ({
  type: POST_REVIEW_SUCCESS,
  payload: { bookId, review, reviewSummary },
});

export const postReviewFailure = (bookId: number, error?: AxiosError): ActionPostReviewFailure => ({
  type: POST_REVIEW_FAILURE,
  payload: { bookId, error },
});

export const deleteReviewRequest = (bookId: number): ActionDeleteReviewRequest => ({
  type: DELETE_REVIEW_REQUEST,
  payload: { bookId },
});

export const deleteReviewSuccess = (
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
): ActionDeleteReviewSuccess => ({
  type: DELETE_REVIEW_SUCCESS,
  payload: { bookId, review, reviewSummary },
});

export const deleteReviewFailure = (
  bookId: number,
  error?: AxiosError,
): ActionDeleteReviewFailure => ({ type: DELETE_REVIEW_FAILURE, payload: { bookId, error } });

export const startEditingReview = (bookId: number): ActionStartEditingReview => ({
  type: START_EDITING_REVIEW,
  payload: { bookId },
});

export const endEditingReview = (bookId: number): ActionEndEditingReview => ({
  type: END_EDITING_REVIEW,
  payload: { bookId },
});
