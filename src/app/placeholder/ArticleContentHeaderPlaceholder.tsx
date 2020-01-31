import { ArticleChannelInfoHeaderPlaceholder } from 'app/placeholder/ArticleChannelInfoHeaderPlaceholder';
import React from 'react';

export const ArticleContentHeaderPlaceholder: React.FunctionComponent = () => (
  <>
    <div className="ArticleContent_Title_Skeleton Skeleton" />
    <ArticleChannelInfoHeaderPlaceholder />
  </>
);
