import { Dispatch } from 'react-redux';
import { call, put, take } from 'redux-saga/effects';

import { RidiSelectState } from 'app/store';
import { TextWithLF } from 'app/types';
import toast from 'app/utils/toast';

import {
  ActionDeleteCommentRequest,
  ActionPostCommentRequest,
  ActionPostCommentSuccess,
  DELETE_COMMENT_FAILURE,
  DELETE_COMMENT_REQUEST,
  deleteCommentFailure,
  deleteCommentSuccess,
  POST_COMMENT_FAILURE,
  POST_COMMENT_REQUEST,
  POST_COMMENT_SUCCESS,
  postCommentFailure,
  postCommentSuccess,
  updateCommentInput,
} from '../actions';
import { requestDeleteComment, requestPostComment } from '../requests';

export function postComment(
  dispatch: Dispatch<RidiSelectState>,
  bookId: number,
  reviewId: number,
  content: TextWithLF,
) {
  requestPostComment(bookId, reviewId, content)
    .then(response => {
      if (response.status === 200) {
        dispatch(postCommentSuccess(bookId, reviewId, response.data));
      } else {
        dispatch(postCommentFailure(bookId, reviewId));
      }
    })
    .catch(() => dispatch(postCommentFailure(bookId, reviewId)));
}

export function* watchPostCommentRequest(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionPostCommentRequest = yield take(POST_COMMENT_REQUEST);
    yield call(postComment, dispatch, payload.bookId, payload.reviewId, payload.content);
  }
}

export function* watchPostCommentSuccess(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionPostCommentSuccess = yield take(POST_COMMENT_SUCCESS);
    yield put(updateCommentInput(payload.bookId, payload.reviewId, ''));
  }
}

export function deleteComment(
  dispatch: Dispatch<RidiSelectState>,
  bookId: number,
  reviewId: number,
  commentId: number,
) {
  requestDeleteComment(bookId, reviewId, commentId)
    .then(response => {
      if (response.status === 200) {
        dispatch(deleteCommentSuccess(bookId, reviewId, commentId));
      } else {
        dispatch(deleteCommentFailure(bookId, reviewId, commentId));
      }
    })
    .catch(() => dispatch(deleteCommentFailure(bookId, reviewId, commentId)));
}

export function* watchDeleteCommentRequest(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionDeleteCommentRequest = yield take(DELETE_COMMENT_REQUEST);
    yield call(deleteComment, dispatch, payload.bookId, payload.reviewId, payload.commentId);
  }
}

export function* watchCommentFailure(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    yield take([POST_COMMENT_FAILURE, DELETE_COMMENT_FAILURE]);
    toast.failureMessage();
  }
}
