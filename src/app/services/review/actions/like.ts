import { Action } from 'app/services/review/types';

export const POST_REVIEW_LIKE_REQUEST = 'POST_REVIEW_LIKE_REQUEST';
export const POST_REVIEW_LIKE_SUCCESS = 'POST_REVIEW_LIKE_SUCCESS';
export const POST_REVIEW_LIKE_FAILURE = 'POST_REVIEW_LIKE_FAILURE';

export const DELETE_REVIEW_LIKE_REQUEST = 'DELETE_REVIEW_LIKE_REQUEST';
export const DELETE_REVIEW_LIKE_SUCCESS = 'DELETE_REVIEW_LIKE_SUCCESS';
export const DELETE_REVIEW_LIKE_FAILURE = 'DELETE_REVIEW_LIKE_FAILURE';

export interface ReviewLikeActionParams {
  bookId: number;
  reviewId: number;
}

export type ActionPostReviewLikeRequest = Action<
  typeof POST_REVIEW_LIKE_REQUEST,
ReviewLikeActionParams
>
export type ActionPostReviewLikeSuccess = Action<
  typeof POST_REVIEW_LIKE_SUCCESS,
ReviewLikeActionParams
>
export type ActionPostReviewLikeFailure = Action<
  typeof POST_REVIEW_LIKE_FAILURE,
ReviewLikeActionParams
>

export type ActionDeleteReviewLikeRequest = Action<
  typeof DELETE_REVIEW_LIKE_REQUEST,
ReviewLikeActionParams
>
export type ActionDeleteReviewLikeSuccess = Action<
  typeof DELETE_REVIEW_LIKE_SUCCESS,
ReviewLikeActionParams
>
export type ActionDeleteReviewLikeFailure = Action<
  typeof DELETE_REVIEW_LIKE_FAILURE,
ReviewLikeActionParams
>

export type ReviewLikeActionTypes =
  ActionPostReviewLikeRequest |
  ActionPostReviewLikeSuccess |
  ActionPostReviewLikeFailure |
  ActionDeleteReviewLikeRequest |
  ActionDeleteReviewLikeSuccess |
  ActionDeleteReviewLikeFailure;

export const postReviewLikeRequest = (
  bookId: number,
  reviewId: number,
): ActionPostReviewLikeRequest => ({ type: POST_REVIEW_LIKE_REQUEST, payload: { bookId, reviewId } });

export const postReviewLikeSuccess = (
  bookId: number,
  reviewId: number,
): ActionPostReviewLikeSuccess => ({ type: POST_REVIEW_LIKE_SUCCESS, payload: { bookId, reviewId } });

export const postReviewLikeFailure = (
  bookId: number,
  reviewId: number,
): ActionPostReviewLikeFailure => ({ type: POST_REVIEW_LIKE_FAILURE, payload: { bookId, reviewId } });

export const deleteReviewLikeRequest = (
  bookId: number,
  reviewId: number,
): ActionDeleteReviewLikeRequest => ({ type: DELETE_REVIEW_LIKE_REQUEST, payload: { bookId, reviewId } });

export const deleteReviewLikeSuccess = (
  bookId: number,
  reviewId: number,
): ActionDeleteReviewLikeSuccess => ({ type: DELETE_REVIEW_LIKE_SUCCESS, payload: { bookId, reviewId } });

export const deleteReviewLikeFailure = (
  bookId: number,
  reviewId: number,
): ActionDeleteReviewLikeFailure => ({ type: DELETE_REVIEW_LIKE_FAILURE, payload: { bookId, reviewId } });
