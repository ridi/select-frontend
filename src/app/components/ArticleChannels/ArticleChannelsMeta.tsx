import * as React from 'react';

import { Icon } from '@ridi/rsg';
import { Actions } from 'app/services/articleChannel';
import { ArticleChannel } from 'app/services/articleChannel';
import { articleChannelToPath } from 'app/utils/toPath';
import { Method } from 'axios';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export const ArticleChannelsMeta: React.FunctionComponent<ArticleChannel> = (props) => {
  const { id, thumbnailUrl, displayName, description, isFollowing } = props;
  const dispatch = useDispatch();

  const handleButtonClick = (method: Method) => {
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId: id, method }));
  };

  return (
    <div className="Channel_Info">
      <Link className="Channel_Link" to={articleChannelToPath({ channelId: id })}>
        <div className="Channel_Thumbnail">
          <img src={thumbnailUrl} className="Channel_Image" />
        </div>
      </Link>
      <div className="Channel_Meta">
        <Link className="Channel_Link" to={articleChannelToPath({ channelId: id })}>
          <span className="Channel_Title">{displayName}</span>
        </Link>
        <span className="Channel_Desc">{description}</span>
      </div>
      {isFollowing ? (
        <button className="Channel_Follow" onClick={() => handleButtonClick('DELETE')}>
          팔로잉
        </button>
      ) : (
        <button className="Channel_Follow FollowButton" onClick={() => handleButtonClick('POST')}>
          <Icon name="plus_1" className="Follow_Icon" />
          팔로우
        </button>
      )}
    </div>
  );
};
