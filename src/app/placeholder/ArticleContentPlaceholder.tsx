import React from 'react';

export const ArticleContentPlaceholder: React.FunctionComponent = () => (
  <div className="ArticleContent_ContentWrapper">
    <div className="ArticleContent_Text_Skeleton Skeleton" />
    <div className="ArticleContent_Text_Skeleton Skeleton" />
    <div className="ArticleContent_Text_Skeleton Skeleton" />
    <div className="ArticleContent_LastText_Skeleton Skeleton" />
  </div>
);
