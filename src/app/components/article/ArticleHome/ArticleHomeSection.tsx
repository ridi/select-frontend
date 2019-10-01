import { ArticleSectionType } from 'app/services/article/home';
import { ArticleChartList, ArticleList } from 'app/utils/mockup';
import * as React from 'react';
import MediaQuery from 'react-responsive';

interface ArticleHomeSectionProps {
  title: string;
  type: string;
  articleList: ArticleList[] | ArticleChartList[];
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
  const { title, type } = props;

  // if(type === ArticleSectionType.LIST) {

  // }

  // if (type === ArticleSectionType.CHART) {

  // }

  return (
    <section className="ArticleHomeSection">
      <ArticleSectionHeader title={title} />
      {/* 아티클 리스트 */}
    </section>
  );
};
