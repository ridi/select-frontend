import { ArticleChannelFollowButton } from 'app/components/ArticleChannels/ArticleChannelFollowButton';
import { ArticleChannel } from 'app/services/articleChannel';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { articleChannelToPath } from 'app/utils/toPath';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArticleChannelThumbnail } from './ArticleChannelThumbnail';

export interface SectionProps {
  section?: string;
  idx?: number;
}

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannel & SectionProps> = props => {
  const { id, name, thumbnailUrl, displayName, description, section, idx = 0 } = props;
  const dispatch = useDispatch();

  const trackingClick = (index: number, trackingId: string) => {
    if (!section) {
      return;
    }

    const trackingParams: DefaultTrackingParams = {
      section,
      index,
      id: trackingId,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  return (
    <div className="ArticleChannelMeta_Wrapper">
      <ArticleChannelThumbnail
        channelName={name}
        imageUrl={thumbnailUrl}
        linkUrl={articleChannelToPath({ channelName: name })}
        onLinkClick={() => trackingClick(idx, `ch:${id}`)}
      />
      <Link
        className="ArticleChannelMeta_Link"
        to={articleChannelToPath({ channelName: name })}
        onClick={() => trackingClick(idx, `ch:${id}`)}
      >
        <span className="ArticleChannelMeta_Title">{displayName}</span>
        <span className="ArticleChannelMeta_Desc">{description}</span>
      </Link>
      <div className="ArticleChannelMeta_FollowButton">
        <ArticleChannelFollowButton channelId={id} channelName={name} />
      </div>
    </div>
  );
};
