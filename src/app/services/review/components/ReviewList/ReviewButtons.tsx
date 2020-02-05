import classNames from 'classnames';
import React from 'react';

import { Button, Icon } from '@ridi/rsg';
import { FetchStatusFlag } from 'app/constants';

export interface ReviewButtonsProps {
  isCommentSectionOpen: boolean;
  commentCount: number;
  toggleCommentSection: () => void;
  isLikedByMe: boolean;
  likeCount: number;
  toggleLike: () => void;
  likeButtonFetchStatus: FetchStatusFlag;
}

export const ReviewButtons: React.SFC<ReviewButtonsProps> = props => {
  const {
    isCommentSectionOpen,
    commentCount,
    toggleCommentSection,
    isLikedByMe,
    likeCount,
    toggleLike,
    likeButtonFetchStatus,
  } = props;

  return (
    <ul className="ReviewButtons_List">
      <li className="ReviewButtons_OpenCommentsButtonItem">
        <Button
          color="gray"
          size="small"
          outline
          className={classNames([
            'ReviewButtons_OpenCommentsButton',
            { pressed: isCommentSectionOpen },
          ])}
          onClick={toggleCommentSection}
        >
          <>
            <Icon name="speechbubble_2" className="ReviewButtons_CommentIcon" />
            <span className="ReviewButtons_CommentLabel">댓글</span>
            {!!commentCount && <span className="ReviewButtons_CommentCount">{commentCount}</span>}
          </>
        </Button>
      </li>
      <li className="ReviewButtons_LikeButtonItem">
        <Button
          color="gray"
          size="small"
          outline
          spinner={likeButtonFetchStatus === FetchStatusFlag.FETCHING}
          className={classNames(['ReviewButtons_LikeButton', { pressed: isLikedByMe }])}
          onClick={toggleLike}
        >
          <>
            <Icon name="thumb_up_1" className="ReviewButtons_LikeIcon RUIButton_SVGIcon" />
            <span className="ReviewButtons_LikeCount">{likeCount}</span>
          </>
        </Button>
      </li>
    </ul>
  );
};
