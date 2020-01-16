import {
  flow,
  keyBy,
  mapValues,
  omit,
} from 'lodash-es';
import Immutable from 'object-path-immutable';

import { FetchStatusFlag } from 'app/constants';
import { Omit } from 'app/types';

import {
  COMMENT_PAGE_SIZE,
  ReviewSortingCriteria,
  sortingCriteriaListMap,
  UserFilterType,
} from '../constants';
import {
  initialMyReview,
  initialReviewsSetState,
  MyReviewFetchStatus,
  MyReviewState,
  Review,
  ReviewFetchStatus,
  ReviewId,
  ReviewsById,
  ReviewsSet,
  ReviewsState,
  ReviewSummary,
} from '../reducer.state';
import {
  RequestReviewsParameters,
  ResponseReview,
  ResponseReviewDiff,
  ResponseReviews,
} from '../requests';
import { Paginated } from '../types';
import {
  commentListToCommentsById,
  responseCommentsToCommentIdListByPage,
} from './comments';

export function initializeReviewsSet() {
  return Immutable(initialReviewsSetState)
    .set('fetchStatus', FetchStatusFlag.FETCHING)
    .set([
      'reviewIdsByUserFilterType',
      UserFilterType.buyer,
      ReviewSortingCriteria.latest,
    ], {
      currentPage: 1,
      itemListByPage: {
        1: {
          fetchStatus: FetchStatusFlag.FETCHING,
          itemList: [],
        },
      },
    })
    .value();
}

export function getAvailableSortBy(
  sortBy: ReviewSortingCriteria,
  userFilterType: UserFilterType,
) {
  if (sortingCriteriaListMap[userFilterType].includes(sortBy)) {
    return sortBy;
  }
  return ReviewSortingCriteria.latest;
}

export function requestReviewsSet(
  formerReviewsSet: ReviewsSet,
  params: RequestReviewsParameters,
) {
  const { userFilterType, sortBy, page } = params;
  return Immutable(formerReviewsSet || initialReviewsSetState)
    .set(['userFilterType'], userFilterType)
    .set(['sortBy'], getAvailableSortBy(sortBy, userFilterType))
    .set(['reviewIdsByUserFilterType', userFilterType, sortBy, 'currentPage'], page)
    .set(['reviewIdsByUserFilterType', userFilterType, sortBy, 'itemListByPage', `${page}`,
    ], {
      fetchStatus: FetchStatusFlag.FETCHING,
      itemList: [],
    })
    .value();
}

export function responseReviewToCommentIdsByPage(responseReview: ResponseReview, size: number) {
  const { commentTotalCount } = responseReview;
  const currentPage = 1;
  return {
    pageCount: Math.ceil(commentTotalCount / size),
    itemCount: commentTotalCount,
    size,
    currentPage,
    itemListByPage: responseCommentsToCommentIdListByPage(
      responseReview.comments,
      size,
      commentTotalCount,
    ),
  };
}

export function responseReviewsToPaginatedReviewIds(
  page: number,
  statePaginatedReview: Paginated<ReviewId>,
  responseReviews: ResponseReviews,
): Paginated<ReviewId> {
  const { totalCount, size, reviews } = responseReviews;
  return {
    pageCount: Math.ceil(totalCount / size),
    itemCount: totalCount,
    currentPage: page,
    size,
    itemListByPage: {
      ...statePaginatedReview.itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: reviews.map((review) => review.id),
      },
    },
  };
}

export function responseReviewToStateReview(responseReview: ResponseReview): Review {
  const comm = omit(responseReview, ['comments', 'commentsTotalCount', 'content']) as Omit<
  ResponseReview,
  keyof ResponseReviewDiff
  >;
  return {
    ...comm,
    content: responseReview.content || '',
    fetchStatus: {
      like: FetchStatusFlag.IDLE,
      myComment: FetchStatusFlag.IDLE,
    },
    commentInput: '',
    commentIdsByPage: responseReviewToCommentIdsByPage(responseReview, COMMENT_PAGE_SIZE),
    commentsById: commentListToCommentsById(responseReview.comments),
  };
}

export function responseReviewToStateMyReview(responseReview: ResponseReview | undefined): MyReviewState {
  if (!responseReview) {
    return initialMyReview;
  }

  return {
    ...initialMyReview,
    id: responseReview.id,
  };
}

export function responseReviewsToReviewsById(
  responseReviewList: ResponseReview[],
): ReviewsById {
  return flow(
    (list: ResponseReview[]) => keyBy(list, 'id'),
    (dic) => mapValues(dic, responseReviewToStateReview),
  )(responseReviewList);
}

export function responseReviewsToReviewsSet(
  state: ReviewsState,
  bookId: number,
  params: RequestReviewsParameters,
  responseReviews: ResponseReviews,
): ReviewsSet {
  return {
    ...state[bookId],
    fetchStatus: FetchStatusFlag.IDLE,
    reviewSummary: responseReviews.reviewSummary,
    myReview: responseReviewToStateMyReview(responseReviews.my.review),
    reviewIdsByUserFilterType: {
      ...state[bookId].reviewIdsByUserFilterType,
      [params.userFilterType]: {
        ...state[bookId].reviewIdsByUserFilterType[params.userFilterType],
        [params.sortBy]: responseReviewsToPaginatedReviewIds(
          params.page,
          state[bookId].reviewIdsByUserFilterType[params.userFilterType][params.sortBy],
          responseReviews,
        ),
      },
    },
    reviewsById: {
      ...state[bookId].reviewsById,
      ...(responseReviews.my.review
            && responseReviews.my.review.id
            && responseReviewsToReviewsById([responseReviews.my.review])),
      ...responseReviewsToReviewsById(responseReviews.reviews),
    },
  };
}

export function setReviewFetchError(
  state: ReviewsState,
  bookId: number,
  params: RequestReviewsParameters,
): ReviewsState {
  if (state[bookId].fetchStatus === FetchStatusFlag.FETCHING) {
    return Immutable(state)
      .set([
        `${bookId}`,
        'fetchStatus',
      ],
      FetchStatusFlag.FETCH_ERROR,
      )
      .value();
  }
  return Immutable(state)
    .set([
      `${bookId}`,
      'reviewIdsByUserFilterType',
      params.userFilterType,
      params.sortBy,
      `${params.page}`,
    ], FetchStatusFlag.FETCH_ERROR)
    .value();
}

export function setMyReviewFetchStatus(
  state: ReviewsState,
  bookId: number,
  type: keyof MyReviewFetchStatus,
  fetchStatus: FetchStatusFlag,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'myReview',
      'fetchStatus',
      type,
    ], fetchStatus)
    .value();
}

export function setMyReviewContent(
  state: ReviewsState,
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'myReview',
      'fetchStatus',
      'content',
    ], FetchStatusFlag.IDLE)
    .set([
      `${bookId}`,
      'myReview',
      'id',
    ], review.id)
    .set([
      `${bookId}`,
      'reviewsById',
      `${review.id}`,
    ], responseReviewToStateReview(review))
    .set([
      `${bookId}`,
      'reviewSummary',
    ], reviewSummary)
    .value();
}

export function deleteMyReview(
  state: ReviewsState,
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'myReview',
      'fetchStatus',
      'delete',
    ], FetchStatusFlag.IDLE)
    .set([
      `${bookId}`,
      'myReview',
      'id',
    ], review.id)
    .set([
      `${bookId}`,
      'reviewsById',
      `${review.id}`,
    ], responseReviewToStateReview(review))
    .set([
      `${bookId}`,
      'reviewSummary',
    ], reviewSummary)
    .value();
}

export function setMyRating(
  state: ReviewsState,
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'myReview',
      'fetchStatus',
      'rating',
    ], FetchStatusFlag.IDLE)
    .set([
      `${bookId}`,
      'myReview',
      'id',
    ], review.id)
    .set([
      `${bookId}`,
      'reviewsById',
      `${review.id}`,
    ], responseReviewToStateReview(review))
    .set([
      `${bookId}`,
      'reviewSummary',
    ], reviewSummary)
    .value();
}

export function deleteMyRating(
  state: ReviewsState,
  bookId: number,
  reviewSummary: ReviewSummary,
) {
  const formerReviewId = state[bookId].myReview!.id;
  return Immutable(state)
    .set([
      `${bookId}`,
      'myReview',
      'fetchStatus',
      'rating',
    ], FetchStatusFlag.IDLE)
    .set([
      `${bookId}`,
      'myReview',
      'id',
    ], 0)
    .del([
      `${bookId}`,
      'reviewsById',
      `${formerReviewId}`,
    ])
    .set([
      `${bookId}`,
      'reviewSummary',
    ], reviewSummary)
    .value();
}

export function setReviewFetchStatus(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
  type: keyof ReviewFetchStatus,
  fetchStatus: FetchStatusFlag,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'reviewsById',
      `${reviewId}`,
      'fetchStatus',
      type,
    ], fetchStatus)
    .value();
}

export function reportReview(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'reviewsById',
      `${reviewId}`,
      'fetchStatus',
      'report',
    ], FetchStatusFlag.IDLE)
    .set([
      `${bookId}`,
      'reviewsById',
      `${reviewId}`,
      'isReportedByMe',
    ], true)
    .value();
}

export function toggleLikeReview(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
  like: boolean,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'reviewsById',
      `${reviewId}`,
      'fetchStatus',
      'like',
    ], FetchStatusFlag.IDLE)
    .set([
      `${bookId}`,
      'reviewsById',
      `${reviewId}`,
      'isLikedByMe',
    ], like)
    .update([
      `${bookId}`,
      'reviewsById',
      `${reviewId}`,
      'likeCount',
    ], (count: number) => like ? count + 1 : count - 1)
    .value();
}

export function changeUserFilterTab(
  state: ReviewsState,
  bookId: number,
  userFilterType: UserFilterType,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'userFilterType',
    ], userFilterType)
    .set([
      `${bookId}`,
      'sortBy',
    ], getAvailableSortBy(state[bookId].sortBy, userFilterType))
    .value();
}

export function changeSortByInState(
  state: ReviewsState,
  bookId: number,
  sortBy: ReviewSortingCriteria,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'sortBy',
    ], sortBy)
    .value();
}

export function toggleMyReviewEditingStatus(
  state: ReviewsState,
  bookId: number,
  isBeingEdited: boolean,
) {
  return Immutable(state)
    .set([
      `${bookId}`,
      'myReview',
      'isBeingEdited',
    ], isBeingEdited)
    .value();
}
