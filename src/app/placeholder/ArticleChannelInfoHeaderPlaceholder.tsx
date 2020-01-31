import React from 'react';

export const ArticleChannelInfoHeaderPlaceholder: React.FunctionComponent = () => (
  <div className="ChannelInfoHeader_Wrapper">
    <span className="ChannelInfoHeader_Thumbnail_Skeleton Skeleton" />
    <span className="ChannelInfoHeader_Title_Skeleton Skeleton" />
    <span className="ChannelInfoHeader_Desc_Skeleton Skeleton" />
    <span className="ChannelInfoHeader_Button_Skeleton Skeleton" />
  </div>
);
