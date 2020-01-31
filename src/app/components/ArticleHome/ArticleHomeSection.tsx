import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ArticleSectionChartList } from 'app/components/ArticleSectionChartList';
import { GridArticleList } from 'app/components/GridArticleList';
import { FetchStatusFlag } from 'app/constants';
import { ArticleSectionChartListPlaceholder } from 'app/placeholder/ArticleSectionChartListPlaceholder';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { ArticleResponse } from 'app/services/article/requests';
import { Actions, ArticleHomeSectionType, ArticleSectionType } from 'app/services/articleHome';
import { RidiSelectState } from 'app/store';

interface ArticleHomeSectionProps {
  title: string;
  type: string;
  order: number;
  articleHomeSectionType: ArticleHomeSectionType;
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
  const { title, type, order, articleHomeSectionType } = props;
  const dispatch = useDispatch();
  const { sectionData, articles } = useSelector((state: RidiSelectState) => ({
    sectionData: state.articleHome[articleHomeSectionType],
    articles: state.articlesById,
  }));

  React.useEffect(() => {
    if (
      sectionData.fetchStatus === FetchStatusFlag.FETCHING ||
      (sectionData.fetchStatus === FetchStatusFlag.IDLE && sectionData.articles !== undefined)
    ) {
      return;
    }
    dispatch(Actions.loadArticleHomeSectionListRequest({ targetSection: articleHomeSectionType }));
  }, []);

  if (type === ArticleSectionType.CHART) {
    return (
      <section className="ArticleHomeSection">
        {!sectionData.articles ? (
          <>
            <ArticleSectionHeaderPlaceholder />
            <ArticleSectionChartListPlaceholder />
          </>
        ) : (
          <>
            <ArticleSectionHeader title={title} />
            <ArticleSectionChartList
              articleList={sectionData.articles && sectionData.articles.map((id) => articles[id].article!)}
              serviceTitleForTracking="select-article"
              pageTitleForTracking="home"
              uiPartTitleForTracking={`${articleHomeSectionType.replace('ArticleList', '')}`}
              miscTracking={JSON.stringify({sect_order: order})}
            />
          </>
        )}
      </section>
    );
  }
  return (
    <section className="ArticleHomeSection">
      {!sectionData.articles ? (
        <>
          <ArticleSectionHeaderPlaceholder />
          <GridArticleListPlaceholder />
        </>
      ) : (
        <>
          <ArticleSectionHeader title={title} />
          <GridArticleList
            serviceTitleForTracking="select-article"
            pageTitleForTracking="home"
            uiPartTitleForTracking={`${articleHomeSectionType.replace('ArticleList', '')}`}
            miscTracking={JSON.stringify({sect_order: order})}
            renderChannelMeta={true}
            articles={sectionData.articles && sectionData.articles.slice(0, 4).map((id) => articles[id].article!)}
          />
        </>
      )}
    </section>
  );
};
