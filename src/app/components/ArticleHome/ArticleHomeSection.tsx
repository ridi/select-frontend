import * as React from 'react';

import { ArticleSectionChartList } from 'app/components/ArticleSectionChartList';
import { GridArticleList } from 'app/components/GridArticleList';
import { ArticleResponse } from 'app/services/article/request';
import { ArticleSectionType } from 'app/services/articleHome';
import { ArticleChartList } from 'app/utils/mock';

interface ArticleHomeSectionProps {
  title: string;
  type: string;
  articleList?: ArticleResponse[];
  articleChartList?: ArticleResponse[];
}

interface ArticleSectionHeaderProps {
  title: string;
}

export const ArticleSectionHeader: React.FunctionComponent<ArticleSectionHeaderProps> = (props) => {
  const { title } = props;

  return (
    <div className="ArticleSection_Header">
      <h2 className="ArticleSection_Title reset-heading">
        {title}
      </h2>
    </div>
  );
};

export const ArticleHomeSection: React.FunctionComponent<ArticleHomeSectionProps> = (props) => {
  const { title, type, articleList, articleChartList } = props;
  if (type === ArticleSectionType.CHART) {
    return (
      <section className="ArticleHomeSection">
        <ArticleSectionHeader title={title} />
        {/* 아티클 리스트 */}
        <ArticleSectionChartList articleList={articleChartList} />
      </section>
    );
  }
  return !articleList ? null : (
    <section className="ArticleHomeSection">
      <ArticleSectionHeader title={title} />
      {/* 아티클 리스트 */}
      <GridArticleList
        pageTitleForTracking="article-home"
        uiPartTitleForTracking="article-home-section"
        articles={articleList.slice(0, 4)}
      />
    </section>
  );
};
