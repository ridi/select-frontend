import * as React from 'react';
import { useSelector } from 'react-redux';

import { Icon } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';

export const ArticleCannelInfoHeader: React.FunctionComponent<{ channelId: number }> = (props) => {
  const channelState = useSelector((state: RidiSelectState) => state.articleChannelById[props.channelId]);

  return channelState.channelMeta ? (
    <div className="ChannelInfoHeader_Wrapper">
      <div className="ChannelInfoHeader_Thumbnail">
        <img src={channelState.channelMeta.thumbnailUrl} className="ChannelInfoHeader_ThumbnailImage" />
      </div>
      <div className="ChannelInfoHeader_Meta">
        <span className="ChannelInfoHeader_Title">{channelState.channelMeta.displayName}</span>
        <span className="ChannelInfoHeader_Desc">{channelState.channelMeta.description}</span>
      </div>
      <button className="ChannelInfoHeader_Follow">
        <Icon name="plus_1" className="ChannelInfoHeader_FollowIcon" />
        팔로우
      </button>
    </div>
  ) : null;
};
