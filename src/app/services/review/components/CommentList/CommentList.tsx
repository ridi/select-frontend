import React from 'react';

import { Icon } from '@ridi/rsg';

import { Comment } from '../../reducer.state';
import { CommentItem } from './CommentItem';

export interface CommentListProps {
  bookId: number;
  reviewId: number;
  commentList: Comment[];
  currentPage: number;
  nextPageCount: number;
  deleteComment: (bookId: number, reviewId: number, commentId: number) => void;
  showPageComments: (bookId: number, reviewId: number, page: number) => void;
}

export const CommentList: React.SFC<CommentListProps> = (props) => {
  const {
    bookId,
    reviewId,
    commentList,
    currentPage,
    nextPageCount,
    deleteComment,
    showPageComments,
  } = props;

  return (
    <>
      {!!nextPageCount && (
        <button
          type="button"
          className="CommentList_ShowMoreButton"
          onClick={() => showPageComments(bookId, reviewId, currentPage + 1)}
        >
          댓글 {nextPageCount}개 더보기
          <Icon
            name="arrow_1_down"
            className="CommentList_ShowMoreButton_Icon"
          />
        </button>
      )}
      <ul className="CommentList">
        {commentList.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={(commentId: number) => deleteComment(bookId, reviewId, commentId)}
          />
        ))}
      </ul>
    </>
  );
};
