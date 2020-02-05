import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps, useParams } from 'react-router-dom';

import { HelmetWithTitle, Pagination, ConnectedPageHeader } from 'app/components';

import { ArticleChannelMeta } from 'app/components/ArticleChannelDetail/ArticleChannelMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { MAX_WIDTH } from 'app/constants';
import { ArticleChannelDetailPlaceholder } from 'app/placeholder/ArticleChannelDetailPlaceholder';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { Actions } from 'app/services/articleChannel';
import { selectIsInApp } from 'app/services/environment/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { articleChannelToPath } from 'app/utils/toPath';

export const ArticleChannelDetail: React.FunctionComponent = () => {
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
    <main className="SceneWrapper PageArticleChannelDetail">
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
      <div className="Channel_ArticleList">
        {isFetchedChannelArticles() && articleChannelData ? (
          <GridArticleList
            serviceTitleForTracking="select-article"
            pageTitleForTracking="channel-detail"
            uiPartTitleForTracking="article-list"
            miscTracking={JSON.stringify({ sect_page: page })}
            renderAuthor={false}
            articles={articleChannelData.itemListByPage[page].itemList.map(
              articleKey => articlesById[articleKey].article!,
            )}
          />
        ) : (
          <GridArticleListPlaceholder />
        )}
        {articleChannelData && articleChannelData.itemCount! > 0 && (
          <MediaQuery maxWidth={MAX_WIDTH}>
            {isMobile => (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(articleChannelData.itemCount! / itemCountPerPage)}
                isMobile={isMobile}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `${articleChannelToPath({ channelName })}?page=${p}`,
                  }),
                }}
              />
            )}
          </MediaQuery>
        )}
      </div>
    </main>
  );
};
