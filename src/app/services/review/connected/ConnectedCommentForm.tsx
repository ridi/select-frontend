import { connect, Dispatch } from 'react-redux';

import { FetchStatusFlag } from 'app/constants';
import { postCommentRequest, updateCommentInput } from 'app/services/review/actions';
import {
  CommentForm,
  CommentFormProps,
} from 'app/services/review/components/CommentList';
import { getReviewFetchStatus } from 'app/services/review/selectors';
import {
  getCommentInputContent,
} from 'app/services/review/selectors/comments';
import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';

export type CommentFormStateProps = Pick<
CommentFormProps,
'content' | 'isSubmitting'
>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<CommentFormProps, keyof CommentFormStateProps | keyof CommentFormDispatchProps>,
): CommentFormStateProps {
  return {
    content: getCommentInputContent(state, ownProps),
    isSubmitting: (getReviewFetchStatus(state, ownProps) || {}).myComment === FetchStatusFlag.FETCHING,
  };
}

export type CommentFormDispatchProps = Pick<
CommentFormProps,
'onChange' | 'onSubmit'
>;

function mapDispatchToProps(
  dispatch: Dispatch<RidiSelectState>,
): CommentFormDispatchProps {
  return {
    onChange: (bookId: number, reviewId: number, content: string) =>
      dispatch(updateCommentInput(bookId, reviewId, content)),
    onSubmit: (bookId: number, reviewId: number, content: string) =>
      dispatch(postCommentRequest(bookId, reviewId, content)),
  };
}

export const ConnectedCommentForm =
  connect(mapStateToProps, mapDispatchToProps)(CommentForm);
