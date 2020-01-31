import React from 'react';

interface GridArticlePlaceholderProps {
  gridSize?: string;
}

export const GridArticlePlaceholder: React.FunctionComponent<GridArticlePlaceholderProps> = (props) => (
  <li className="GridArticleItem">
    <div className="ArticleThumbnail_Wrapper">
      <div className="ArticleThumbnail_Skeleton Skeleton" />
    </div>
    <div className="GridArticleItem_Meta">
      {props.gridSize === 'large' && <div className="GridArticleItem_ChannelThumbnail_Skeleton Skeleton" />}
      <div className="GridArticleItem_Meta_InnerWrapper">
        <div className="GridArticleItem_Title_Skeleton Skeleton" />
        {props.gridSize === 'large' ? 
          <div className="GridArticleItem_ChannelName_Skeleton Skeleton" /> : 
          <div className="GridArticleItem_Title_Skeleton Skeleton" />
        }
      </div>
    </div>
  </li>
);
