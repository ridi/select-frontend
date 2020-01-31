import React from 'react';
import { ArticleSectionChartPlaceholder } from './ArticleSectionChartPlaceholder';

export const ArticleSectionChartListPlaceholder: React.FunctionComponent = () => (
  <div className="ArticleChartList_Wrapper">
    <ol className="ArticleChartGroup">
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
    </ol>
    <ol className="ArticleChartGroup">
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
      <ArticleSectionChartPlaceholder />
    </ol>
  </div>
);
