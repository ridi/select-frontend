import React from 'react';

export const SlideChannelListPlaceholder: React.FunctionComponent = () => (
  <section className="FollowingChannel_ListWrap">
    <ul className="FollowingChannel_List">
      <li className="FollowingChannel_Item">
        <div className="FollowingChannel_Item_InnerWrapper">
          <div className="ChannelThumbnail_Skeleton Skeleton" />
          <span className="ChannelName_Skeleton Skeleton" />
        </div>
      </li>
      <li className="FollowingChannel_Item">
        <div className="FollowingChannel_Item_InnerWrapper">
          <div className="ChannelThumbnail_Skeleton Skeleton" />
          <span className="ChannelName_Skeleton Skeleton" />
        </div>
      </li>
      <li className="FollowingChannel_Item">
        <div className="FollowingChannel_Item_InnerWrapper">
          <div className="ChannelThumbnail_Skeleton Skeleton" />
          <span className="ChannelName_Skeleton Skeleton" />
        </div>
      </li>
    </ul>
  </section>
);
