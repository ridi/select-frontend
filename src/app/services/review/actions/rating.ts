import { Action } from 'app/services/review/types';

import { AxiosError } from 'axios';
import { ReviewSummary } from '../reducer.state';
import { ResponseReview } from '../requests';

export const POST_RATING_REQUEST = 'POST_RATING_REQUEST';
export const POST_RATING_SUCCESS = 'POST_RATING_SUCCESS';
export const POST_RATING_FAILURE = 'POST_RATING_FAILURE';

export const DELETE_RATING_REQUEST = 'DELETE_RATING_REQUEST';
export const DELETE_RATING_SUCCESS = 'DELETE_RATING_SUCCESS';
export const DELETE_RATING_FAILURE = 'DELETE_RATING_FAILURE';

export type ActionPostRatingRequest = Action<
  typeof POST_RATING_REQUEST,
  {
    bookId: number;
    rating: number;
  }
>;
export type ActionPostRatingSuccess = Action<
  typeof POST_RATING_SUCCESS,
  {
    bookId: number;
    review: ResponseReview;
    reviewSummary: ReviewSummary;
  }
>;
export type ActionPostRatingFailure = Action<
  typeof POST_RATING_FAILURE,
  {
    bookId: number;
    error?: AxiosError;
  }
>;

export type ActionDeleteRatingRequest = Action<
  typeof DELETE_RATING_REQUEST,
  {
    bookId: number;
  }
>;
export type ActionDeleteRatingSuccess = Action<
  typeof DELETE_RATING_SUCCESS,
  {
    bookId: number;
    reviewSummary: ReviewSummary;
  }
>;
export type ActionDeleteRatingFailure = Action<
  typeof DELETE_RATING_FAILURE,
  {
    bookId: number;
    error?: AxiosError;
  }
>;

export type RatingActionTypes =
  | ActionPostRatingRequest
  | ActionPostRatingSuccess
  | ActionPostRatingFailure
  | ActionDeleteRatingRequest
  | ActionDeleteRatingSuccess
  | ActionDeleteRatingFailure;

export const postRatingRequest = (bookId: number, rating: number): ActionPostRatingRequest => ({
  type: POST_RATING_REQUEST,
  payload: { bookId, rating },
});

export const postRatingSuccess = (
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
): ActionPostRatingSuccess => ({
  type: POST_RATING_SUCCESS,
  payload: { bookId, review, reviewSummary },
});

export const postRatingFailure = (bookId: number, error?: AxiosError): ActionPostRatingFailure => ({
  type: POST_RATING_FAILURE,
  payload: { bookId, error },
});

export const deleteRatingRequest = (bookId: number): ActionDeleteRatingRequest => ({
  type: DELETE_RATING_REQUEST,
  payload: { bookId },
});

export const deleteRatingSuccess = (
  bookId: number,
  reviewSummary: ReviewSummary,
): ActionDeleteRatingSuccess => ({
  type: DELETE_RATING_SUCCESS,
  payload: { bookId, reviewSummary },
});

export const deleteRatingFailure = (
  bookId: number,
  error?: AxiosError,
): ActionDeleteRatingFailure => ({ type: DELETE_RATING_FAILURE, payload: { bookId, error } });
