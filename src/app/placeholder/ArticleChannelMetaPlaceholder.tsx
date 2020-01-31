import React from 'react';

export const ArticleChannelMetaPlaceholder: React.FunctionComponent = () => (
  <li className="ArticleChannel_Skeleton">
    <div className="Channel_Info_Skeleton">
      <div className="Channel_Thumbnail_Skeleton Skeleton" />
      <div className="Channel_Meta_Skeleton">
        <span className="Channel_Title_Skeleton Skeleton" />
        <span className="Channel_Desc_Skeleton Skeleton" />
      </div>
      <div className="Channel_FollowButton_Skeleton Skeleton" />
    </div>
  </li>
);
