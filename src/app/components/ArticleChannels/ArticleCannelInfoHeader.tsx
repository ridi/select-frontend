import { Icon } from '@ridi/rsg';
import * as React from 'react';

export const ArticleCannelInfoHeader: React.FunctionComponent = () => {
  return (
    <div className="ChannelInfoHeader_Wrapper">
      <div className="ChannelInfoHeader_Thumbnail">
        <img src={''} className="ChannelInfoHeader_ThumbnailImage" />
      </div>
      <div className="ChannelInfoHeader_Meta">
        <span className="ChannelInfoHeader_Title">이코노미스트</span>
        <span className="ChannelInfoHeader_Desc">다양하고 유익한 경제정보</span>
      </div>
      <button className="ChannelInfoHeader_Follow">
        <Icon name="plus_1" className="ChannelInfoHeader_FollowIcon" />
        팔로우
      </button>
    </div>
  );
};
