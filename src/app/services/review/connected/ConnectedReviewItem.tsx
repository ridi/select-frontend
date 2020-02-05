import { connect, Dispatch } from 'react-redux';

import { getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import {
  deleteReviewLikeRequest,
  postReviewLikeRequest,
  postReviewReportSuccess,
} from 'app/services/review/actions';
import { ReviewItem, ReviewItemProps } from 'app/services/review/components/ReviewList/ReviewItem';
import { getReviewFetchStatus } from 'app/services/review/selectors';
import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';

export type ReviewItemStateProps = Pick<ReviewItemProps, 'fetchStatus' | 'isInApp' | 'isIosInApp'>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<ReviewItemProps, keyof ReviewItemStateProps | keyof ReviewItemDispatchProps>,
): ReviewItemStateProps {
  return {
    isInApp: selectIsInApp(state),
    isIosInApp: getIsIosInApp(state),
    fetchStatus: getReviewFetchStatus(state, ownProps),
  };
}

export type ReviewItemDispatchProps = Pick<
  ReviewItemProps,
  'submitReport' | 'postLike' | 'deleteLike'
>;

function mapDispatchToProps(dispatch: Dispatch<RidiSelectState>): ReviewItemDispatchProps {
  return {
    submitReport: (bookId: number, reviewId: number) =>
      dispatch(postReviewReportSuccess(bookId, reviewId)),
    postLike: (bookId: number, reviewId: number) =>
      dispatch(postReviewLikeRequest(bookId, reviewId)),
    deleteLike: (bookId: number, reviewId: number) =>
      dispatch(deleteReviewLikeRequest(bookId, reviewId)),
  };
}

export const ConnectedReviewItem = connect(mapStateToProps, mapDispatchToProps)(ReviewItem);
