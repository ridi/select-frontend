import { connect, Dispatch } from 'react-redux';

import { RidiSelectState } from 'app/store';

import { selectIsInApp } from 'app/services/environment/selectors';
import {
  deleteReviewLikeRequest,
  deleteReviewRequest,
  endEditingReview,
  postReviewLikeRequest,
  postReviewRequest,
  startEditingReview,
} from 'app/services/review/actions';
import {
  getMyRating,
  getMyReview,
  getMyReviewFetchStatus,
  getMyReviewIsBeingEdited,
  getReviewFetchStatusForMyReview,
} from 'app/services/review/selectors';
import { Omit } from 'app/types';
import { MyReview, MyReviewProps } from '../components/MyReview';

export type MyReviewStateProps = Pick<
  MyReviewProps,
  | 'review'
  | 'fetchStatus'
  | 'myReviewFetchStatus'
  | 'selectedRating'
  | 'isBeingEdited'
  | 'isDisabled'
>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<MyReviewProps, keyof MyReviewStateProps | keyof MyReviewDispatchProps>,
): MyReviewStateProps {
  return {
    review: getMyReview(state, ownProps),
    fetchStatus: getReviewFetchStatusForMyReview(state, ownProps),
    myReviewFetchStatus: getMyReviewFetchStatus(state, ownProps),
    selectedRating: getMyRating(state, ownProps),
    isBeingEdited: getMyReviewIsBeingEdited(state, ownProps),
    isDisabled: !state.user.isLoggedIn && selectIsInApp(state),
  };
}

export type MyReviewDispatchProps = Pick<
  MyReviewProps,
  'submitReview' | 'deleteReview' | 'postLike' | 'deleteLike' | 'startEditing' | 'endEditing'
>;

function mapDispatchToProps(dispatch: Dispatch<RidiSelectState>): MyReviewDispatchProps {
  return {
    submitReview: (bookId: number, content: string, hasSpoiler: boolean) =>
      dispatch(postReviewRequest(bookId, content, hasSpoiler)),
    deleteReview: (bookId: number) => dispatch(deleteReviewRequest(bookId)),
    postLike: (bookId: number, reviewId: number) =>
      dispatch(postReviewLikeRequest(bookId, reviewId)),
    deleteLike: (bookId: number, reviewId: number) =>
      dispatch(deleteReviewLikeRequest(bookId, reviewId)),
    startEditing: (bookId: number) => dispatch(startEditingReview(bookId)),
    endEditing: (bookId: number) => dispatch(endEditingReview(bookId)),
  };
}

export const ConnectedMyReview = connect(mapStateToProps, mapDispatchToProps)(MyReview);
