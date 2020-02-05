import { connect, Dispatch } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';

import { StarRatingForm, StarRatingFormProps } from '../components/StarRating';
import { deleteRatingRequest, postRatingRequest } from '../actions';
import { getHasMyReviewContent, getMyRating, getMyReviewFetchStatus } from '../selectors';

export type StarRatingFormStateProps = Pick<
  StarRatingFormProps,
  'ratingFetchStatus' | 'selectedRating' | 'isRatingCancelable'
>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<
    StarRatingFormProps,
    keyof StarRatingFormStateProps | keyof StarRatingFormDispatchProps
  >,
): StarRatingFormStateProps {
  return {
    ratingFetchStatus: getMyReviewFetchStatus(state, ownProps).rating,
    selectedRating: getMyRating(state, ownProps),
    isRatingCancelable: !getHasMyReviewContent(state, ownProps),
  };
}

export type StarRatingFormDispatchProps = Pick<StarRatingFormProps, 'onSubmitRating' | 'onCancel'>;

function mapDispatchToProps(dispatch: Dispatch<RidiSelectState>): StarRatingFormDispatchProps {
  return {
    onSubmitRating: (bookId, rating) => dispatch(postRatingRequest(bookId, rating)),
    onCancel: bookId => dispatch(deleteRatingRequest(bookId)),
  };
}

export const ConnectedStarRatingForm = connect(mapStateToProps, mapDispatchToProps)(StarRatingForm);
