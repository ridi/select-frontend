import classNames from 'classnames';
import React from 'react';

import { NewlineToBr } from 'app/components/NewlineToBr';
import { FetchStatusFlag } from 'app/constants';
import { Comment } from 'app/services/review';
import { buildDateAndTimeFormat } from 'app/utils/formatDate';

export interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: number) => void;
}

export const CommentItem: React.SFC<CommentItemProps> = (props) => {
  const { onDelete } = props;
  const { id, content, maskedUId, commentDate, isMyComment, fetchStatus } = props.comment;

  return (
    <li className="CommentItem">
      <div className="CommentItem_Content">
        <NewlineToBr text={content} />
      </div>
      <div className="CommentItem_Metadata">
        <span className="CommentItem_MaskedUId">
          <span className="a11y">작성자</span>
          {maskedUId}
        </span>
        <span className="CommentItem_CommentDate">
          <span className="a11y">작성일</span>
          {buildDateAndTimeFormat(commentDate)}
        </span>
        {isMyComment && (
          <button
            className={classNames([
              'CommentItem_DeletButton',
              { spinner: fetchStatus === FetchStatusFlag.FETCHING },
            ])}
            onClick={() => {
              if (confirm('댓글을 삭제하시겠습니까?')) {
                onDelete(id);
              }
            }}
          >
            삭제
          </button>
        )}
      </div>
    </li>
  );
};
