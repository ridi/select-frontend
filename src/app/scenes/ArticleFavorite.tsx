import { HelmetWithTitle } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { TileArticleList } from 'app/components/TileArticleList';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { Actions } from 'app/services/articleFavorite';
import { getFavoriteArticleList } from 'app/services/articleFavorite/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ArticleFavorite: React.FunctionComponent = () => {
  const page = useSelector(getPageQuery);
  const articleItems = useSelector(getFavoriteArticleList);

  const favoriteArticleFetchStatus = useSelector((state: RidiSelectState) => {
    if (state.favoriteArticle.itemListByPage[page]) {
      return state.favoriteArticle.itemListByPage[page].fetchStatus;
    }
    return FetchStatusFlag.IDLE;
  });

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (favoriteArticleFetchStatus === FetchStatusFlag.IDLE && !articleItems) {
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
      { articleItems ? (
          <TileArticleList
            articles={articleItems}
            pageType="favorite"
          /> ) : (
          <ArticleEmpty
            iconName="list_1"
            description="좋아한 아티클이 없습니다."
          />
        )
      }
      </div>
    </main>
  );
};
