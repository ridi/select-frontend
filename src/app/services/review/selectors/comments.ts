import { flatMap, range } from 'lodash-es';
import { createSelector } from 'reselect';

import { RidiSelectState } from 'app/store';
import { TextWithLF } from 'app/types';
import { Comment, CommentId, Review } from '../reducer.state';
import { Paginated } from '../types';
import { getReview } from './common';

export const selectReview = (state: RidiSelectState, props: any) =>
  state.reviewsByBookId[props.bookId].reviewsById[props.reviewId] || {};

export const getCommentIds = createSelector([selectReview], (review: Review): CommentId[] =>
  review.commentIdsByPage.itemCount
    ? flatMap(
        range(1, review.commentIdsByPage.currentPage + 1).reverse(),
        page =>
          !!review.commentIdsByPage.itemListByPage[page] &&
          review.commentIdsByPage.itemListByPage[page].itemList,
      )
    : [],
);

export const getCommentList = createSelector(
  [selectReview, getCommentIds],
  (review: Review, commentIds: number[]): Comment[] =>
    commentIds.map(id => review.commentsById[id]),
);

export const getPaginatedCommentIds = createSelector(
  [selectReview],
  (review: Review): Paginated<CommentId> => review.commentIdsByPage,
);

export const getCommentCurrentPage = createSelector(
  [getPaginatedCommentIds],
  (paginatedCommentIds: Paginated<CommentId>): number => paginatedCommentIds.currentPage,
);

export const getCommentNextPageCount = createSelector(
  [getPaginatedCommentIds, getCommentCurrentPage],
  (paginatedCommentIds: Paginated<CommentId>, currentPage: number): number => {
    const nextPage = currentPage + 1;
    return paginatedCommentIds.itemListByPage[nextPage]
      ? paginatedCommentIds.itemListByPage[nextPage].itemList.length
      : 0;
  },
);

export const getCommentInputContent = createSelector(
  [getReview],
  (review: Review): TextWithLF => review.commentInput,
);
