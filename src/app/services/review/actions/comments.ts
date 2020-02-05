import { Action } from 'app/services/review/types';
import { TextWithLF } from 'app/types';

import { ResponseComment } from 'app/services/review/requests';

export const SHOW_MORE_COMMENTS = 'SHOW_MORE_COMMENTS';

export const POST_COMMENT_REQUEST = 'POST_COMMENT_REQUEST';
export const POST_COMMENT_SUCCESS = 'POST_COMMENT_SUCCESS';
export const POST_COMMENT_FAILURE = 'POST_COMMENT_FAILURE';

export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE';

export const UPDATE_COMMENT_INPUT = 'UPDATE_COMMENT_INPUT';

export type ActionShowMoreComments = Action<
  typeof SHOW_MORE_COMMENTS,
  {
    bookId: number;
    reviewId: number;
    page: number;
  }
>;

export type ActionPostCommentRequest = Action<
  typeof POST_COMMENT_REQUEST,
  {
    bookId: number;
    reviewId: number;
    content: TextWithLF;
  }
>;
export type ActionPostCommentSuccess = Action<
  typeof POST_COMMENT_SUCCESS,
  {
    bookId: number;
    reviewId: number;
    comment: ResponseComment;
  }
>;
export type ActionPostCommentFailure = Action<
  typeof POST_COMMENT_FAILURE,
  {
    bookId: number;
    reviewId: number;
  }
>;

export type ActionDeleteCommentRequest = Action<
  typeof DELETE_COMMENT_REQUEST,
  {
    bookId: number;
    reviewId: number;
    commentId: number;
  }
>;
export type ActionDeleteCommentSuccess = Action<
  typeof DELETE_COMMENT_SUCCESS,
  {
    bookId: number;
    reviewId: number;
    commentId: number;
  }
>;
export type ActionDeleteCommentFailure = Action<
  typeof DELETE_COMMENT_FAILURE,
  {
    bookId: number;
    reviewId: number;
    commentId: number;
  }
>;

export type ActionUpdateCommentInput = Action<
  typeof UPDATE_COMMENT_INPUT,
  {
    bookId: number;
    reviewId: number;
    content: TextWithLF;
  }
>;

export type CommentsActionTypes =
  | ActionShowMoreComments
  | ActionPostCommentRequest
  | ActionPostCommentSuccess
  | ActionPostCommentFailure
  | ActionDeleteCommentRequest
  | ActionDeleteCommentSuccess
  | ActionDeleteCommentFailure
  | ActionUpdateCommentInput;

export const showMoreComments = (
  bookId: number,
  reviewId: number,
  page: number,
): ActionShowMoreComments => ({
  type: SHOW_MORE_COMMENTS,
  payload: { bookId, reviewId, page },
});

export const postCommentRequest = (
  bookId: number,
  reviewId: number,
  content: TextWithLF,
): ActionPostCommentRequest => ({
  type: POST_COMMENT_REQUEST,
  payload: {
    bookId,
    reviewId,
    content,
  },
});

export const postCommentSuccess = (
  bookId: number,
  reviewId: number,
  comment: ResponseComment,
): ActionPostCommentSuccess => ({
  type: POST_COMMENT_SUCCESS,
  payload: { bookId, reviewId, comment },
});

export const postCommentFailure = (bookId: number, reviewId: number): ActionPostCommentFailure => ({
  type: POST_COMMENT_FAILURE,
  payload: { bookId, reviewId },
});

export const deleteCommentRequest = (
  bookId: number,
  reviewId: number,
  commentId: number,
): ActionDeleteCommentRequest => ({
  type: DELETE_COMMENT_REQUEST,
  payload: {
    bookId,
    reviewId,
    commentId,
  },
});

export const deleteCommentSuccess = (
  bookId: number,
  reviewId: number,
  commentId: number,
): ActionDeleteCommentSuccess => ({
  type: DELETE_COMMENT_SUCCESS,
  payload: { bookId, reviewId, commentId },
});

export const deleteCommentFailure = (
  bookId: number,
  reviewId: number,
  commentId: number,
): ActionDeleteCommentFailure => ({
  type: DELETE_COMMENT_FAILURE,
  payload: { bookId, reviewId, commentId },
});

export const updateCommentInput = (
  bookId: number,
  reviewId: number,
  content: TextWithLF,
): ActionUpdateCommentInput => ({
  type: UPDATE_COMMENT_INPUT,
  payload: { bookId, reviewId, content },
});
