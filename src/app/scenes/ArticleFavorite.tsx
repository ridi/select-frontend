import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

import { HelmetWithTitle, Pagination } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { GridArticleList } from 'app/components/GridArticleList';
import { FetchStatusFlag, MAX_WIDTH, PageTitleText, RoutePaths } from 'app/constants';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { Actions } from 'app/services/articleFavorite';
import { getFavoriteArticleList } from 'app/services/articleFavorite/selectors';
import { Actions as ArticleFollowingActions } from 'app/services/articleFollowing';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { checkCorrectPath } from 'app/utils/utils';

export const ArticleFavorite: React.FunctionComponent = () => {
  const itemCountPerPage = 12;

  const articleItems = useSelector(getFavoriteArticleList);
  const {
    page,
    isFetched,
    favoriteArticleFetchStatus,
    itemCount,
    hasAvailableTicket,
    unseenFeedsFetchStatus,
  } = useSelector((state: RidiSelectState) => {
    const pageFromQuery = getPageQuery(state);

    return {
      page: getPageQuery(state),
      isFetched: state.favoriteArticle.itemListByPage[pageFromQuery]
        ? state.favoriteArticle.itemListByPage[pageFromQuery].isFetched
        : false,
      favoriteArticleFetchStatus: state.favoriteArticle.itemListByPage[pageFromQuery]
        ? state.favoriteArticle.itemListByPage[pageFromQuery].fetchStatus
        : FetchStatusFlag.IDLE,
      itemCount:
        state.favoriteArticle && state.favoriteArticle.itemCount
          ? state.favoriteArticle.itemCount
          : 1,
      hasAvailableTicket: state.user.hasAvailableTicket,
      unseenFeedsFetchStatus: state.articleFollowing.unseenFeedsFetchStatus,
    };
  });

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (
      (favoriteArticleFetchStatus === FetchStatusFlag.IDLE || !isFetched) &&
      checkCorrectPath(RoutePaths.ARTICLE_FAVORITE)
    ) {
      dispatch(Actions.loadFavoriteArticleListRequest({ page }));
    }
    if (hasAvailableTicket && unseenFeedsFetchStatus !== FetchStatusFlag.FETCHING) {
      dispatch(ArticleFollowingActions.loadUnseenFollowingFeedsRequest());
    }
  }, [page]);

  React.useEffect(() => {
    if (hasAvailableTicket && unseenFeedsFetchStatus !== FetchStatusFlag.FETCHING) {
      dispatch(ArticleFollowingActions.loadUnseenFollowingFeedsRequest());
    }
  }, [hasAvailableTicket]);

  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
        'PageArticleFavorite',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_FAVORITE} />
      <div className="a11y">
        <h1>리디셀렉트 좋아한 아티클</h1>
      </div>

      <div className="FollowingArticleList">
        {articleItems ? (
          articleItems.length > 0 ? (
            <>
              <GridArticleList
                serviceTitleForTracking="select-article"
                pageTitleForTracking="favorite"
                uiPartTitleForTracking="article-list"
                miscTracking={JSON.stringify({ sect_page: page })}
                articles={articleItems}
                renderChannelThumbnail
                renderChannelMeta
                renderAuthor={false}
                renderPublishDate
                renderFavoriteButton
                isFullWidthAvailable
                gridListSizeClassNames="GridArticleList-large"
              />
              <MediaQuery maxWidth={MAX_WIDTH}>
                {isMobile => (
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(itemCount / itemCountPerPage)}
                    isMobile={isMobile}
                    item={{
                      el: Link,
                      getProps: (p): LinkProps => ({
                        to: `${RoutePaths.ARTICLE_FAVORITE}?page=${p}`,
                      }),
                    }}
                  />
                )}
              </MediaQuery>
            </>
          ) : (
            <ArticleEmpty iconName="document" description="좋아한 아티클이 없습니다." />
          )
        ) : (
          <GridArticleListPlaceholder gridSize="large" />
        )}
      </div>
    </main>
  );
};
