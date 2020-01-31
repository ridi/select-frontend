import React from 'react';

export const ArticleChannelDetailPlaceholder: React.FunctionComponent = () => (
  <div className="ArticleChannelMeta_Wrap">
    <div className="ArticleChannel_Thumbnail_Skeleton Skeleton" />
    <div className="ArticleChannel_Meta">
      <div className="ArticleChannel_Meta_Title_Skeleton Skeleton" />
      <div className="ArticleChannel_Meta_Desc_Skeleton Skeleton" />
      <div className="ArticleChannel_Meta_Serial_Skeleton Skeleton" />
      <div className="ArticleChannel_Meta_Following_Skeleton Skeleton" />
      <div className="ArticleChannel_Follow_Button_Skeleton Skeleton" />
    </div>
  </div>
);
