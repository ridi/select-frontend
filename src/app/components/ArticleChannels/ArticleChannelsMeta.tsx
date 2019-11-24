import { Method } from 'axios';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { ArticleChannelFollowButton } from 'app/components/ArticleChannels/ArticleChannelFollowButton';
import { Actions } from 'app/services/articleChannel';
import { ArticleChannel } from 'app/services/articleChannel';
import { articleChannelToPath } from 'app/utils/toPath';

export const ArticleChannelsMeta: React.FunctionComponent<ArticleChannel> = (props) => {
  const { id, name, thumbnailUrl, displayName, description, isFollowing } = props;
  const dispatch = useDispatch();

  return (
    <div className="Channel_Info">
      <Link className="Channel_Link" to={articleChannelToPath({ channelName: name })}>
        <div className="Channel_Thumbnail">
          <img src={thumbnailUrl} className="Channel_Image" />
        </div>
      </Link>
      <div className="Channel_Meta">
        <Link className="Channel_Link" to={articleChannelToPath({ channelName: name })}>
          <span className="Channel_Title">{displayName}</span>
        </Link>
        <span className="Channel_Desc">{description}</span>
      </div>
      <ArticleChannelFollowButton
        channelId={id}
        channelName={name}
      />
    </div>
  );
};
