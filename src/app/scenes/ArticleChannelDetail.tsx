import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, LinkProps, useParams } from 'react-router-dom';

import { Actions } from 'app/services/articleChannel';
import { getPageQuery } from 'app/services/routing/selectors';

import { HelmetWithTitle, Pagination } from 'app/components';
import { ArticleChannelMeta } from 'app/components/ArticleChannelDetail/ArticleChannelMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { articleChannelToPath } from 'app/utils/toPath';
import MediaQuery from 'react-responsive';

export const ArticleChannelDetail: React.FunctionComponent = () => {
  const channelId = Number(useParams<{ channelId: string }>().channelId);
  const page = useSelector(getPageQuery);
  const itemCountPerPage = 24;
  const { articleChannelData, articlesById } = useSelector((state: RidiSelectState) => ({
    articleChannelData: state.articleChannelById[channelId] ? state.articleChannelById[channelId] : undefined,
    articlesById: state.articlesById,
  }));
  const dispatch = useDispatch();

  const isFetched = () => {
    return (channelId && articleChannelData);
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
      dispatch(Actions.loadArticleChannelDetailRequest({channelId}));
    }
    if (!isFetchedChannelArticles()) {
      dispatch(Actions.loadArticleChannelArticlesRequest({channelId, page}));
    }
  }, []);
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
                .map((id) => articlesById[id].article!)
            }
          />
        }
        {articleChannelData.itemCount &&
          <MediaQuery maxWidth={840}>
            {(isMobile) => (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(articleChannelData.itemCount! / itemCountPerPage)}
                isMobile={isMobile}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `${articleChannelToPath({ channelId })}?page=${p}`,
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
