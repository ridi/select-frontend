import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, LinkProps, useParams } from 'react-router-dom';

import { HelmetWithTitle, Pagination, ConnectedPageHeader } from 'app/components';
import { ArticleChannelMeta } from 'app/components/ArticleChannelDetail/ArticleChannelMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { ArticleChannelDetailPlaceholder } from 'app/placeholder/ArticleChannelDetailPlaceholder';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { Actions } from 'app/services/articleChannel';
import { selectIsInApp } from 'app/services/environment/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { articleChannelToPath } from 'app/utils/toPath';
import Media from 'app/styles/mediaQuery';
import { Scene } from 'app/styles/globals';

const SceneWrapper = styled.main`
  ${Scene.Wrapper}
  margin-bottom: 40px;
`;

const ChannelArticleList = styled.div`
  @media ${Media.PC} {
    max-width: 840px;
    margin: 0 auto;
  }

  margin-bottom: 30px;
`;

const ArticleChannelDetail: React.FunctionComponent = () => {
  const { channelName } = useParams<{ channelName: string }>();
  const page = useSelector(getPageQuery);
  const articleChannelData = useSelector((state: RidiSelectState) =>
    state.articleChannelById[channelName] ? state.articleChannelById[channelName] : undefined,
  );
  const articlesById = useSelector((state: RidiSelectState) => state.articlesById);
  const isInApp = useSelector(selectIsInApp);

  const itemCountPerPage = 12;

  const dispatch = useDispatch();

  const isFetched = () => channelName && articleChannelData;
  const isFetchedChannelMeta = () => {
    if (!isFetched()) {
      return false;
    }
    return articleChannelData!.isMetaFetched;
  };
  const isFetchedChannelArticles = () => {
    if (!isFetched()) {
      return false;
    }
    return (
      articleChannelData!.itemListByPage &&
      articleChannelData!.itemListByPage[page] &&
      articleChannelData!.itemListByPage[page].isFetched
    );
  };
  React.useEffect(() => {
    if (!isFetchedChannelMeta()) {
      dispatch(Actions.loadArticleChannelDetailRequest({ channelName }));
    }
    if (!isFetchedChannelArticles()) {
      if (location.pathname === articleChannelToPath({ channelName })) {
        dispatch(Actions.loadArticleChannelArticlesRequest({ channelName, page }));
      }
    }
  }, [page]);

  return (
    <SceneWrapper>
      <HelmetWithTitle
        titleName={
          isFetchedChannelMeta() && articleChannelData
            ? articleChannelData.channelMeta!.displayName
            : ''
        }
      />
      {isInApp ? (
        <ConnectedPageHeader
          pageTitle={
            isFetchedChannelMeta() && articleChannelData
              ? articleChannelData.channelMeta!.displayName
              : ''
          }
        />
      ) : null}
      <div className="a11y">
        <h1>리디셀렉트 아티클 채널</h1>
      </div>
      {isFetchedChannelMeta() && articleChannelData ? (
        <ArticleChannelMeta {...articleChannelData.channelMeta!} />
      ) : (
        <ArticleChannelDetailPlaceholder />
      )}
      <ChannelArticleList>
        {isFetchedChannelArticles() && articleChannelData ? (
          <GridArticleList
            serviceTitleForTracking="select-article"
            pageTitleForTracking="channel-detail"
            uiPartTitleForTracking="article-list"
            miscTracking={JSON.stringify({ sect_page: page })}
            articles={articleChannelData.itemListByPage[page].itemList.map(
              articleKey => articlesById[articleKey].article!,
            )}
          />
        ) : (
          <GridArticleListPlaceholder />
        )}
        {articleChannelData && articleChannelData.itemCount! > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(articleChannelData.itemCount! / itemCountPerPage)}
            item={{
              el: Link,
              getProps: (p): LinkProps => ({
                to: `${articleChannelToPath({ channelName })}?page=${p}`,
              }),
            }}
          />
        )}
      </ChannelArticleList>
    </SceneWrapper>
  );
};

export default ArticleChannelDetail;
