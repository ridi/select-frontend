import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps, useParams } from 'react-router-dom';

import { HelmetWithTitle, Pagination } from 'app/components';
import { ArticleChannelMeta } from 'app/components/ArticleChannelDetail/ArticleChannelMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { Actions } from 'app/services/articleChannel';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { articleChannelToPath } from 'app/utils/toPath';

export const ArticleChannelDetail: React.FunctionComponent = () => {
  const channelName = useParams<{ channelName: string }>().channelName;
  const page = useSelector(getPageQuery);
  const itemCountPerPage = 12;
  const { articleChannelData, articlesById } = useSelector((state: RidiSelectState) => ({
    articleChannelData: state.articleChannelById[channelName] ? state.articleChannelById[channelName] : undefined,
    articlesById: state.articlesById,
  }));
  const dispatch = useDispatch();

  const isFetched = () => {
    return (channelName && articleChannelData);
  };
  const isFetchedChannelMeta = () => {
    if (!isFetched()) { return false; }
    return articleChannelData!.isMetaFetched;
  };
  const isFetchedChannelArticles = () => {
    if (!isFetched()) { return false; }
    return (
      articleChannelData!.itemListByPage &&
      articleChannelData!.itemListByPage[page] &&
      articleChannelData!.itemListByPage[page].isFetched
    );
  };
  React.useEffect(() => {
    if (!isFetchedChannelMeta()) {
      dispatch(Actions.loadArticleChannelDetailRequest({channelName}));
    }
    if (!isFetchedChannelArticles()) {
      dispatch(Actions.loadArticleChannelArticlesRequest({channelName, page}));
    }
  }, [page]);
  return articleChannelData && articleChannelData.channelMeta ? (
    <main
      className={classNames(
        'SceneWrapper',
      )}
    >
      <HelmetWithTitle titleName={isFetchedChannelMeta() ? articleChannelData.channelMeta!.displayName : ''} />
      <div className="a11y"><h1>리디셀렉트 아티클 채널</h1></div>
      {
        isFetchedChannelMeta() &&
        <ArticleChannelMeta {...articleChannelData.channelMeta!} />
      }
      <div className="Channel_ArticleList">
        {isFetchedChannelArticles() &&
          <GridArticleList
            pageTitleForTracking="article-channel-detail"
            uiPartTitleForTracking="article-channel-detail-articles"
            renderAuthor={false}
            articles={
              articleChannelData
                .itemListByPage[page]
                .itemList
                .map((articleKey) => articlesById[articleKey].article!)
            }
          />
        }
        {articleChannelData.itemCount! > 0 &&
          <MediaQuery maxWidth={840}>
            {(isMobile) => (
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
        }
      </div>
    </main>
  ) : null;
};
