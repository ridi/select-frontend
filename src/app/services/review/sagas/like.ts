import { Dispatch } from 'react-redux';
import { call, take } from 'redux-saga/effects';

import { RidiSelectState } from 'app/store';
import toast from 'app/utils/toast';
import {
  ActionDeleteReviewLikeFailure,
  ActionDeleteReviewLikeRequest,
  ActionPostReviewLikeFailure,
  ActionPostReviewLikeRequest,
  DELETE_REVIEW_LIKE_FAILURE,
  DELETE_REVIEW_LIKE_REQUEST,
  deleteReviewLikeFailure,
  deleteReviewLikeSuccess,
  POST_REVIEW_LIKE_FAILURE,
  POST_REVIEW_LIKE_REQUEST,
  postReviewLikeFailure,
  postReviewLikeSuccess,
} from '../actions/like';
import { requestCancelReviewLike, requestLikeReview } from '../requests';

export function postLike(dispatch: Dispatch<RidiSelectState>, bookId: number, reviewId: number) {
  requestLikeReview(bookId, reviewId)
    .then(response => {
      if (response.status === 200) {
        dispatch(postReviewLikeSuccess(bookId, reviewId));
      } else {
        dispatch(postReviewLikeFailure(bookId, reviewId));
      }
    })
    .catch(() => dispatch(postReviewLikeFailure(bookId, reviewId)));
}

export function* watchPostLike(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionPostReviewLikeRequest = yield take(POST_REVIEW_LIKE_REQUEST);
    yield call(postLike, dispatch, payload.bookId, payload.reviewId);
  }
}

export function deleteLike(dispatch: Dispatch<RidiSelectState>, bookId: number, reviewId: number) {
  requestCancelReviewLike(bookId, reviewId)
    .then(response => {
      if (response.status === 200) {
        dispatch(deleteReviewLikeSuccess(bookId, reviewId));
      } else {
        dispatch(deleteReviewLikeFailure(bookId, reviewId));
      }
    })
    .catch(() => dispatch(deleteReviewLikeFailure(bookId, reviewId)));
}

export function* watchDeleteLike(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionDeleteReviewLikeRequest = yield take(DELETE_REVIEW_LIKE_REQUEST);
    yield call(deleteLike, dispatch, payload.bookId, payload.reviewId);
  }
}

export function* watchLikeFailure(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionPostReviewLikeFailure | ActionDeleteReviewLikeFailure = yield take([
      POST_REVIEW_LIKE_FAILURE,
      DELETE_REVIEW_LIKE_FAILURE,
    ]);
    toast.failureMessage();
  }
}
