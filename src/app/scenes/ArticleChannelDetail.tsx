import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Actions } from 'app/services/articleChannel';
import { getPageQuery } from 'app/services/routing/selectors';

import { HelmetWithTitle } from 'app/components';
import { ArticleChannelMeta } from 'app/components/ArticleChannelDetail/ArticleChannelMeta';
import { GridArticleList } from 'app/components/GridArticleList';

export const ArticleChannelDetail: React.FunctionComponent = () => {
  const channelId = Number(useParams<{ channelId: string }>().channelId);
  const page = useSelector((state: RidiSelectState) => getPageQuery(state));
  const { articleChannelById } = useSelector((state: RidiSelectState) => state);
  const { articlesById } = useSelector((state: RidiSelectState) => state);
  const dispatch = useDispatch();

  const isFetched = () => {
    return (channelId && articleChannelById && articleChannelById[channelId]);
  };
  const isFetchedChannelMeta = () => {
    if (!isFetched()) { return false; }
    return articleChannelById[channelId].isMetaFetched;
  };
  const isFetchedChannelArticles = () => {
    if (!isFetched()) { return false; }
    return (
      articleChannelById[channelId].itemListByPage &&
      articleChannelById[channelId].itemListByPage[page] &&
      articleChannelById[channelId].itemListByPage[page].isFetched
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

  return (
    <main
      className={classNames(
        'SceneWrapper',
      )}
    >
      <HelmetWithTitle titleName={articleChannelById[channelId].channelMeta!.name} />
      <div className="a11y"><h1>리디셀렉트 아티클 채널</h1></div>
      {
        isFetchedChannelMeta() &&
        <ArticleChannelMeta {...articleChannelById[channelId].channelMeta!} />
      }
      <div className="Channel_ArticleList">
        {
          isFetchedChannelArticles() &&
          <GridArticleList
            pageTitleForTracking="article-channel-detail"
            uiPartTitleForTracking="article-channel-detail-articles"
            renderAuthor={false}
            articles={
              articleChannelById[channelId]
                .itemListByPage[page]
                .itemList
                .map((id) => articlesById[id].article!)
            }
          />

        }
      </div>
    </main>
  );
};
