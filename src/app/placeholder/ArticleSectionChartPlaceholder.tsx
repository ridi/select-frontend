import * as React from 'react';

export const ArticleSectionChartPlaceholder: React.FunctionComponent = () => (
  <li className="ArticleChartList_Article">
    <span className="ArticleChartList_Rank_Skeleton Skeleton" />
    <div className="ArticleThumbnail_Wrapper">
      <div className="ArticleChartThumbnail_Skeleton Skeleton" />
    </div>
    <div className="ArticleChartList_Meta">
      <div className="ArticleChartList_Meta_Title_Skeleton Skeleton" />
      <div className="ArticleChartList_Meta_Channel_Skeleton Skeleton" />
    </div>
  </li>
);
