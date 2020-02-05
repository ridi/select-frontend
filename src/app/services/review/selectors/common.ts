import { flatMap, get } from 'lodash-es';
import { createSelector } from 'reselect';

import { FetchStatusFlag } from 'app/constants';
import { RidiSelectState } from 'app/store';
import { getNextPageCount } from 'app/utils/getNextPageCount';

import {
  ReviewId,
  ReviewIdsByUserFilterType,
  ReviewsSet,
  ReviewSummary,
  Review,
  ReviewFetchStatus,
} from '../reducer.state';
import { ReviewSortingCriteria, UserFilterType } from '../constants';

import { Page, Paginated } from '../types';

export const selectReviewsByBookId = (state: RidiSelectState, props: any): ReviewsSet =>
  state.reviewsByBookId[props.bookId] || {};

export const selectReviewId = (state: RidiSelectState, props: any): number =>
  props.reviewId || (props.review && props.review.id);

export const selectReviewIdsByUserFilterType = (state: RidiSelectState, props: any) =>
  state.reviewsByBookId[props.bookId].reviewIdsByUserFilterType;

export const getReviewsSetFetchStatus = createSelector(
  [selectReviewsByBookId],
  (reviewsSet: ReviewsSet): FetchStatusFlag => reviewsSet.fetchStatus,
);

export const getReview = createSelector(
  [selectReviewsByBookId, selectReviewId],
  (reviewsSet: ReviewsSet, reviewId: number): Review => reviewsSet.reviewsById[reviewId],
);

export const getReviewFetchStatus = createSelector(
  [getReview],
  (review: Review): ReviewFetchStatus => review.fetchStatus,
);

export const getReviewUserFilterType = createSelector(
  selectReviewsByBookId,
  (reviewsSet: ReviewsSet): UserFilterType => reviewsSet.userFilterType,
);

export const getReviewSortBy = createSelector(
  selectReviewsByBookId,
  (reviewsSet: ReviewsSet): ReviewSortingCriteria => reviewsSet.sortBy,
);

export const getReviewIds = createSelector(
  [selectReviewIdsByUserFilterType, getReviewUserFilterType, getReviewSortBy],
  (
    reviewIdsByUserFilterType: ReviewIdsByUserFilterType,
    userFilterType: UserFilterType,
    sortBy: ReviewSortingCriteria,
  ): ReviewId[] =>
    flatMap(
      reviewIdsByUserFilterType[userFilterType][sortBy].itemListByPage,
      (page: Page<ReviewId>) => page.itemList,
    ),
);

export const getReviewList = createSelector(
  [selectReviewsByBookId, getReviewIds],
  (reviewsSet: ReviewsSet, reviewIds: ReviewId[]): Review[] =>
    reviewIds.map(id => reviewsSet.reviewsById[id]),
);

export const getReviewCurrentPaginatedIds = createSelector(
  [selectReviewIdsByUserFilterType, getReviewUserFilterType, getReviewSortBy],
  (
    reviewIdsByUserFilterType: ReviewIdsByUserFilterType,
    userFilterType: UserFilterType,
    sortBy: ReviewSortingCriteria,
  ): Paginated<ReviewId> => reviewIdsByUserFilterType[userFilterType][sortBy],
);

export const getReviewCurrentPage = createSelector(
  [getReviewCurrentPaginatedIds],
  (paginatedReviewIds: Paginated<ReviewId>): number => paginatedReviewIds.currentPage,
);

export const getReviewNextPage = createSelector(
  [getReviewCurrentPage],
  (currentPage): number => currentPage + 1,
);

export const getReviewTotalCount = createSelector(
  [getReviewCurrentPaginatedIds],
  (paginatedReviewIds: Paginated<ReviewId>): number => paginatedReviewIds.itemCount,
);

export const getReviewPageSize = createSelector(
  [getReviewCurrentPaginatedIds],
  (paginatedReviewIds: Paginated<ReviewId>): number => paginatedReviewIds.size,
);

export const getReviewNextPageCount = createSelector(
  [getReviewCurrentPage, getReviewTotalCount, getReviewPageSize],
  (currentPage: number, itemCount: number, size: number): number =>
    getNextPageCount(currentPage, itemCount, size),
);

export const getCurrentReviewPage = createSelector(
  [selectReviewIdsByUserFilterType, getReviewUserFilterType, getReviewSortBy, getReviewCurrentPage],
  (
    reviewIdsByUserFilterType: ReviewIdsByUserFilterType,
    userFilterType: UserFilterType,
    sortBy: ReviewSortingCriteria,
    currentPage: number,
  ): Page<ReviewId> =>
    reviewIdsByUserFilterType[userFilterType][sortBy].itemListByPage[currentPage],
);

export const getReviewPageFetchStatus = createSelector(
  [getCurrentReviewPage],
  (currentPage: Page<ReviewId>): FetchStatusFlag =>
    currentPage ? currentPage.fetchStatus : FetchStatusFlag.IDLE,
);

export const getReviewSummary = createSelector(
  [selectReviewsByBookId],
  (reviewsSet: ReviewsSet): ReviewSummary => reviewsSet.reviewSummary,
);

export const getCurrentReviewSortingCriteriaList = createSelector(
  [selectReviewsByBookId, getReviewUserFilterType],
  (reviewsSet: ReviewsSet, userFilterType: UserFilterType): ReviewSortingCriteria[] =>
    reviewsSet.sortingCriteriaListByUserFilterType[userFilterType],
);
