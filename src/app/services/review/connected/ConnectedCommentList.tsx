import { connect, Dispatch } from 'react-redux';

import { deleteCommentRequest, showMoreComments } from 'app/services/review/actions';
import { CommentList, CommentListProps } from 'app/services/review/components/CommentList';
import {
  getCommentCurrentPage,
  getCommentList,
  getCommentNextPageCount,
} from 'app/services/review/selectors/comments';
import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';

export type CommentListStateProps = Pick<
  CommentListProps,
  'commentList' | 'nextPageCount' | 'currentPage'
>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<CommentListProps, keyof CommentListStateProps | keyof CommentListDispatchProps>,
): CommentListStateProps {
  return {
    commentList: getCommentList(state, ownProps),
    currentPage: getCommentCurrentPage(state, ownProps),
    nextPageCount: getCommentNextPageCount(state, ownProps),
  };
}

export type CommentListDispatchProps = Pick<CommentListProps, 'deleteComment' | 'showPageComments'>;

function mapDispatchToProps(dispatch: Dispatch<RidiSelectState>): CommentListDispatchProps {
  return {
    deleteComment: (bookId: number, reviewId: number, commentId: number) =>
      dispatch(deleteCommentRequest(bookId, reviewId, commentId)),
    showPageComments: (bookId: number, reviewId: number, page: number) =>
      dispatch(showMoreComments(bookId, reviewId, page)),
  };
}

export const ConnectedCommentList = connect(mapStateToProps, mapDispatchToProps)(CommentList);
