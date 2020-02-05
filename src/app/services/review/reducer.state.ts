import { FetchStatusFlag } from 'app/constants';
import { DateDTO, MaskedUId, TextWithLF } from 'app/types';

import {
  ReviewInvisibilityType,
  ReviewSortingCriteria,
  sortingCriteriaListMap,
  UserFilterType,
} from './constants';
import { Paginated } from './types';

export type ReviewId = number;
export type CommentId = number;

export interface Comment {
  fetchStatus: FetchStatusFlag;
  id: number;
  maskedUId: MaskedUId;
  commentDate: DateDTO;
  content: TextWithLF;
  isMyComment: boolean;
}

export interface MyReviewFetchStatus {
  rating: FetchStatusFlag;
  content: FetchStatusFlag;
  delete: FetchStatusFlag;
}

export interface ReviewFetchStatus {
  like: FetchStatusFlag;
  myComment: FetchStatusFlag;
}

export interface CommentsById {
  [commentId: number]: Comment;
}

export interface Review {
  fetchStatus: ReviewFetchStatus;
  commentInput: TextWithLF;
  id: number;
  maskedUId: MaskedUId;
  isBuyer: boolean;
  isMyReview: boolean;
  rating: number; // 1 ~ 5
  reviewDate: DateDTO;
  isInvisible: boolean;
  invisibilityType?: ReviewInvisibilityType;
  hasSpoiler: boolean;
  content: TextWithLF;
  likeCount: number;
  isLikedByMe: boolean;
  isReportedByMe: boolean;
  commentIdsByPage: Paginated<CommentId>;
  commentsById: CommentsById;
}

export interface MyReviewState {
  fetchStatus: MyReviewFetchStatus;
  id: number;
  isBeingEdited: boolean;
}

export interface ReviewSummary {
  buyerRatingAverage: number;
  buyerRatingDistribution: [number, number, number, number, number];
  buyerRatingCount: number;
  buyerReviewCount: number;
  totalRatingCount: number;
  totalReviewCount: number;
}

export interface ReviewIdsByUserFilterType {
  [UserFilterType.buyer]: {
    [ReviewSortingCriteria.latest]: Paginated<ReviewId>;
    [ReviewSortingCriteria.like]: Paginated<ReviewId>;
    [ReviewSortingCriteria.highRating]: Paginated<ReviewId>;
    [ReviewSortingCriteria.lowRating]: Paginated<ReviewId>;
    [index: string]: any; // for typecheck in requestReviewsSet helper
  };
  [UserFilterType.total]: {
    [ReviewSortingCriteria.latest]: Paginated<ReviewId>;
    [ReviewSortingCriteria.like]: Paginated<ReviewId>;
    [index: string]: any; // for typecheck in requestReviewsSet helper
  };
}

export interface ReviewsById {
  [reviewId: number]: Review;
}

export interface ReviewsSet {
  fetchStatus: FetchStatusFlag;
  reviewSummary: ReviewSummary;
  myReview: MyReviewState;
  userFilterType: UserFilterType;
  sortBy: ReviewSortingCriteria;
  sortingCriteriaListByUserFilterType: typeof sortingCriteriaListMap;
  reviewIdsByUserFilterType: ReviewIdsByUserFilterType;
  reviewsById: ReviewsById;
}

export interface ReviewsState {
  [bookId: number]: ReviewsSet;
}

export const initialCommentIdsByPage: Paginated<CommentId> = {
  pageCount: 0,
  itemCount: 0,
  currentPage: 1,
  size: 10,
  itemListByPage: {},
};

export const initialMyReview: MyReviewState = {
  fetchStatus: {
    rating: FetchStatusFlag.IDLE,
    content: FetchStatusFlag.IDLE,
    delete: FetchStatusFlag.IDLE,
  },
  id: 0,
  isBeingEdited: false,
};

export const initialPaginatedReviewState: Paginated<ReviewId> = {
  pageCount: 0,
  itemCount: 0,
  currentPage: 0,
  size: 10,
  itemListByPage: {},
};

export const initialReviewIdsByUserFilterType: ReviewIdsByUserFilterType = {
  [UserFilterType.buyer]: {
    [ReviewSortingCriteria.latest]: initialPaginatedReviewState,
    [ReviewSortingCriteria.like]: initialPaginatedReviewState,
    [ReviewSortingCriteria.highRating]: initialPaginatedReviewState,
    [ReviewSortingCriteria.lowRating]: initialPaginatedReviewState,
  },
  [UserFilterType.total]: {
    [ReviewSortingCriteria.latest]: initialPaginatedReviewState,
    [ReviewSortingCriteria.like]: initialPaginatedReviewState,
  },
};

export const initialReviewSummary: ReviewSummary = {
  buyerRatingAverage: 0,
  buyerRatingDistribution: [0, 0, 0, 0, 0],
  buyerRatingCount: 0,
  buyerReviewCount: 0,
  totalRatingCount: 0,
  totalReviewCount: 0,
};

export const initialReviewsSetState: ReviewsSet = {
  fetchStatus: FetchStatusFlag.IDLE,
  reviewSummary: initialReviewSummary,
  myReview: initialMyReview,
  userFilterType: UserFilterType.buyer,
  sortBy: ReviewSortingCriteria.latest,
  sortingCriteriaListByUserFilterType: sortingCriteriaListMap,
  reviewIdsByUserFilterType: initialReviewIdsByUserFilterType,
  reviewsById: {},
};

export const initialReviewsState: ReviewsState = {};
