import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle, Pagination } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { GridArticleList } from 'app/components/GridArticleList';
import { FetchStatusFlag, PageTitleText, RoutePaths } from 'app/constants';
import { Actions } from 'app/services/articleFavorite';
import { getFavoriteArticleList } from 'app/services/articleFavorite/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

export const ArticleFavorite: React.FunctionComponent = () => {
  const itemCountPerPage = 24;

  const page = useSelector(getPageQuery);
  const articleItems = useSelector(getFavoriteArticleList);
  const { favoriteArticleFetchStatus, itemCount } = useSelector((state: RidiSelectState) => ({
    favoriteArticleFetchStatus: state.favoriteArticle.itemListByPage[page] ? state.favoriteArticle.itemListByPage[page].fetchStatus : FetchStatusFlag.IDLE,
    itemCount: state.favoriteArticle && state.favoriteArticle.itemCount ? state.favoriteArticle.itemCount : 1,
  }));

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (favoriteArticleFetchStatus === FetchStatusFlag.IDLE) {
      dispatch(Actions.loadFavoriteArticleListRequest({ page }));
    }
  }, []);

  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_FAVORITE} />
      <div className="a11y"><h1>리디셀렉트 좋아한 아티클</h1></div>

      <div className="FollowingArticleList">
        {articleItems && articleItems.length > 0 ? (
          <>
            <GridArticleList
              articles={articleItems}
              renderChannelMeta={true}
              renderAuthor={false}
              renderRegDate={true}
              renderFavoriteButton={true}
              isFullWidthAvailable={true}
            />
            <MediaQuery maxWidth={840}>
              {(isMobile) => (
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
          <ArticleEmpty
            iconName="list_1"
            description="좋아한 아티클이 없습니다."
          />
        )}
      </div>
    </main>
  );
};
