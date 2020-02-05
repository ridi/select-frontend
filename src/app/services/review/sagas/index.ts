import { Dispatch } from 'react-redux';
import { all } from 'redux-saga/effects';

import { RidiSelectState } from 'app/store';
import {
  watchCommentFailure,
  watchDeleteCommentRequest,
  watchPostCommentRequest,
  watchPostCommentSuccess,
} from './comments';
import { watchDeleteLike, watchLikeFailure, watchPostLike } from './like';
import { watchDeleteRating, watchPostRating, watchRatingFailure } from './rating';
import {
  watchChangeSortBy,
  watchChangeUserFilterTab,
  watchDeleteReviewRequest,
  watchDeleteReviewSuccess,
  watchGetReviews,
  watchPostReviewRequest,
  watchPostReviewSuccess,
  watchReviewFailure,
} from './reviews';

export function* reviewRootSaga(dispatch: Dispatch<RidiSelectState>) {
  yield all([
    watchGetReviews(dispatch),
    watchPostReviewRequest(dispatch),
    watchPostReviewSuccess(dispatch),
    watchDeleteReviewRequest(dispatch),
    watchDeleteReviewSuccess(dispatch),
    watchReviewFailure(dispatch),
    watchChangeUserFilterTab(),
    watchChangeSortBy(),
    watchDeleteLike(dispatch),
    watchPostLike(dispatch),
    watchLikeFailure(dispatch),
    watchDeleteRating(dispatch),
    watchPostRating(dispatch),
    watchRatingFailure(dispatch),
    watchDeleteCommentRequest(dispatch),
    watchPostCommentRequest(dispatch),
    watchPostCommentSuccess(dispatch),
    watchCommentFailure(dispatch),
  ]);
}

export * from './like';
export * from './rating';
export * from './reviews';
export * from './comments';
