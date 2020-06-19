import styled from '@emotion/styled';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Article } from 'app/services/article';
import {
  getHomePopularArticleList,
  getPopularArticleListFetchStatus,
} from 'app/services/articleList/selectors';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import { FetchStatusFlag, BOOKS_HOME_POPULAR_ARTICLE_COUNT } from 'app/constants';
import { Actions as PopularArticleActions, ArticleListType } from 'app/services/articleList';
import { articleListToPath } from 'app/utils/toPath';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { ArticleSectionHeaderPlaceholder } from 'app/placeholder/ArticleSectionHeaderPlaceholder';
import { GridArticleList } from 'app/components/GridArticleList';
import { RidiSelectState } from 'app/store';
import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';

const trackingProps = {
  serviceTitleForTracking: 'select-article',
  pageTitleForTracking: 'home',
  uiPartTitleForTracking: `${ArticleListType.POPULAR.replace('ArticleList', '')}`,
  miscTracking: JSON.stringify({ sect_order: 3 }),
};

const PopularArticleSectionWrapper = styled.section`
  padding: 30px 0;
  background-color: white;
  border-bottom: 4px solid ${Colors.slategray_10};

  & .HomeSection_Header {
    padding: 0 20px;
  }

  @media ${Media.PC} {
    padding: 35px 0 0;
    margin: 0 auto;
    width: 840px;
    border-bottom: 0;
  }
`;

const PopularArticleSection: React.FunctionComponent = () => {
  const popularArticle: Article[] = useSelector((state: RidiSelectState) =>
    getHomePopularArticleList(state, { itemLimit: BOOKS_HOME_POPULAR_ARTICLE_COUNT }),
  );
  const articleFetchStatus: FetchStatusFlag = useSelector(getPopularArticleListFetchStatus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (popularArticle !== undefined || articleFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    dispatch(PopularArticleActions.loadArticleList({ type: ArticleListType.POPULAR, page: 1 }));
  }, []);

  const renderSkeleton = () => (
    <>
      <ArticleSectionHeaderPlaceholder />
      <GridArticleListPlaceholder />
    </>
  );

  const renderPopularArticle = () =>
    popularArticle ? (
      <>
        <SectionHeader
          title="인기 아티클 둘러보기"
          link={articleListToPath({ listType: 'popular' })}
        />
        <GridArticleList
          {...trackingProps}
          renderChannelMeta
          renderAuthor
          articles={popularArticle}
        />
      </>
    ) : null;

  return (
    <PopularArticleSectionWrapper>
      {articleFetchStatus === FetchStatusFlag.FETCHING ? renderSkeleton() : renderPopularArticle()}
    </PopularArticleSectionWrapper>
  );
};

export default PopularArticleSection;
