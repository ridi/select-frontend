import { createSelector } from 'reselect';

import { MyReviewFetchStatus, Review, ReviewsSet } from '../reducer.state';
import { RidiSelectState } from '../../../store';
import { selectReviewsByBookId } from './common';

export const selectMyReviewId = (state: RidiSelectState, props: any): number =>
  state.reviewsByBookId[props.bookId].myReview.id || 0;

export const getMyReview = createSelector(
  [selectReviewsByBookId, selectMyReviewId],
  (reviewsSet: ReviewsSet, myReviewId: number): Review => reviewsSet.reviewsById[myReviewId] || {},
);

export const getMyRating = createSelector(
  [getMyReview],
  (myReview: Review): number => myReview.rating || 0,
);

export const getHasMyReviewContent = createSelector([getMyReview], (myReview: Review): boolean =>
  myReview.content ? myReview.content.length > 0 : false,
);

export const getMyReviewFetchStatus = createSelector(
  [selectReviewsByBookId],
  (reviewsSet: ReviewsSet): MyReviewFetchStatus => reviewsSet.myReview.fetchStatus,
);

export const getMyReviewIsBeingEdited = createSelector(
  [selectReviewsByBookId],
  (reviewsSet: ReviewsSet): boolean => reviewsSet.myReview.isBeingEdited,
);

export const getReviewFetchStatusForMyReview = createSelector(
  [getMyReview],
  (review: Review) => review.fetchStatus,
);
