import { FetchStatusFlag } from 'app/constants';

import * as actions from './actions';
import {
  changeCurrentCommentPage,
  changeSortByInState,
  changeUserFilterTab,
  deleteComment,
  deleteMyRating,
  deleteMyReview,
  initializeReviewsSet,
  postMyComment,
  reportReview,
  requestReviewsSet,
  responseReviewsToReviewsSet,
  setCommentFetchStatus,
  setMyRating,
  setMyReviewContent,
  setMyReviewFetchStatus,
  setReviewFetchError,
  setReviewFetchStatus,
  toggleLikeReview,
  toggleMyReviewEditingStatus,
  updateCommentFormContent,
} from './reducer.helpers';
import {
  initialReviewIdsByUserFilterType,
  initialReviewsState,
  ReviewsState,
} from './reducer.state';

export const reviewsReducer = (
  state = initialReviewsState || {},
  action: actions.ReviewActionTypes,
): ReviewsState => {
  if (!action.payload) {
    return state;
  }

  switch (action.type) {
    /** Reviews */
    case actions.GET_REVIEWS_REQUEST:
      return {
        ...state,
        [action.payload!.bookId]: !state[action.payload.bookId]
          ? initializeReviewsSet()
          : requestReviewsSet(state[action.payload.bookId], action.payload.params),
      };
    case actions.GET_REVIEWS_SUCCESS:
      return {
        ...state,
        [action.payload.bookId]: responseReviewsToReviewsSet(
          state,
          action.payload.bookId,
          action.payload.params,
          action.payload.response,
        ),
      };
    case actions.GET_REVIEWS_FAILURE:
      return setReviewFetchError(
        state,
        action.payload.bookId,
        action.payload.params,
      );

    case actions.RESET_REVIEW_PAGES:
      return {
        ...state,
        [action.payload.bookId]: {
          ...state[action.payload.bookId],
          reviewIdsByUserFilterType: initialReviewIdsByUserFilterType,
        },
      };

    case actions.CHANGE_USER_FILTER_TAB:
      return changeUserFilterTab(
        state,
        action.payload.bookId,
        action.payload.userFilterType,
      );
    case actions.CHANGE_SORT_BY:
      return changeSortByInState(
        state,
        action.payload.bookId,
        action.payload.sortBy,
      );

    case actions.POST_REVIEW_REQUEST:
      return setMyReviewFetchStatus(
        state,
        action.payload.bookId,
        'content',
        FetchStatusFlag.FETCHING,
      );
    case actions.POST_REVIEW_SUCCESS:
      return setMyReviewContent(
        state,
        action.payload.bookId,
        action.payload.review,
        action.payload.reviewSummary,
      );
    case actions.POST_REVIEW_FAILURE:
      return setMyReviewFetchStatus(
        state,
        action.payload.bookId,
        'content',
        FetchStatusFlag.FETCH_ERROR,
      );

    case actions.DELETE_REVIEW_REQUEST:
      return setMyReviewFetchStatus(
        state,
        action.payload.bookId,
        'delete',
        FetchStatusFlag.FETCHING,
      );
    case actions.DELETE_REVIEW_SUCCESS:
      return deleteMyReview(
        state,
        action.payload.bookId,
        action.payload.review,
        action.payload.reviewSummary,
      );
    case actions.DELETE_REVIEW_FAILURE:
      return setMyReviewFetchStatus(
        state,
        action.payload.bookId,
        'delete',
        FetchStatusFlag.FETCH_ERROR,
      );

    case actions.START_EDITING_REVIEW:
      return toggleMyReviewEditingStatus(
        state,
        action.payload.bookId,
        true,
      );
    case actions.END_EDITING_REVIEW:
      return toggleMyReviewEditingStatus(
        state,
        action.payload.bookId,
        false,
      );

    /** Rating */
    case actions.POST_RATING_REQUEST:
    case actions.DELETE_RATING_REQUEST:
      return setMyReviewFetchStatus(
        state,
        action.payload.bookId,
        'rating',
        FetchStatusFlag.FETCHING,
      );
    case actions.POST_RATING_SUCCESS:
      return setMyRating(
        state,
        action.payload.bookId,
        action.payload.review,
        action.payload.reviewSummary,
      );
    case actions.DELETE_RATING_SUCCESS:
      return deleteMyRating(
        state,
        action.payload.bookId,
        action.payload.reviewSummary,
      );
    case actions.POST_RATING_FAILURE:
    case actions.DELETE_RATING_FAILURE:
      return setMyReviewFetchStatus(
        state,
        action.payload.bookId,
        'rating',
        FetchStatusFlag.FETCH_ERROR,
      );

    /** Report */
    case actions.POST_REVIEW_REPORT_SUCCESS:
      return reportReview(
        state,
        action.payload.bookId,
        action.payload.reviewId,
      );

    /** Like */
    case actions.POST_REVIEW_LIKE_REQUEST:
    case actions.DELETE_REVIEW_LIKE_REQUEST:
      return setReviewFetchStatus(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        'like',
        FetchStatusFlag.FETCHING,
      );
    case actions.POST_REVIEW_LIKE_SUCCESS:
      return toggleLikeReview(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        true,
      );
    case actions.DELETE_REVIEW_LIKE_SUCCESS:
      return toggleLikeReview(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        false,
      );
    case actions.POST_REVIEW_LIKE_FAILURE:
    case actions.DELETE_REVIEW_LIKE_FAILURE:
      return setReviewFetchStatus(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        'like',
        FetchStatusFlag.FETCH_ERROR,
      );

    /** Comments */
    case actions.SHOW_MORE_COMMENTS:
      return changeCurrentCommentPage(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        action.payload.page,
      );

    case actions.POST_COMMENT_REQUEST:
      return setReviewFetchStatus(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        'myComment',
        FetchStatusFlag.FETCHING,
      );
    case actions.POST_COMMENT_SUCCESS:
      return postMyComment(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        action.payload.comment,
      );
    case actions.POST_COMMENT_FAILURE:
      return setReviewFetchStatus(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        'myComment',
        FetchStatusFlag.FETCH_ERROR,
      );

    case actions.DELETE_COMMENT_REQUEST:
      return setCommentFetchStatus(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        action.payload.commentId,
        FetchStatusFlag.FETCHING,
      );
    case actions.DELETE_COMMENT_SUCCESS:
      return deleteComment(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        action.payload.commentId,
      );
    case actions.DELETE_COMMENT_FAILURE:
      return setCommentFetchStatus(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        action.payload.commentId,
        FetchStatusFlag.FETCH_ERROR,
      );
    case actions.UPDATE_COMMENT_INPUT:
      return updateCommentFormContent(
        state,
        action.payload.bookId,
        action.payload.reviewId,
        action.payload.content,
      );

    default:
      return state;
  }
};
