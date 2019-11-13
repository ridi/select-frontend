import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { GridArticleList } from 'app/components/GridArticleList';
import { SlideChannelList } from 'app/components/SlideChannelList';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { Actions } from 'app/services/articleFollowing';
import { getArticleItems, getChannelItems } from 'app/services/articleFollowing/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';

export const ArticleFollowing: React.FunctionComponent = () => {
  const page = useSelector(getPageQuery);
  const channelItems = useSelector(getChannelItems);
  const articleItems = useSelector(getArticleItems);
  const channelFetchStatus = useSelector((state: RidiSelectState) => state.articleFollowing.fetchStatus);
  const articleFetchStatus = useSelector((state: RidiSelectState) => {
    if (state.articleFollowing.followingArticleList && state.articleFollowing.followingArticleList.itemListByPage[page]) {
      return state.articleFollowing.followingArticleList.itemListByPage[page].fetchStatus;
    }
    return FetchStatusFlag.IDLE;
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (channelFetchStatus === FetchStatusFlag.IDLE && channelItems.length === 0) {
      dispatch(Actions.loadFollowingChannelListRequest());
    }
    if (articleFetchStatus === FetchStatusFlag.IDLE && articleItems.length === 0) {
      dispatch(Actions.loadFollowingArticleListRequest({ page }));
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
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_FOLLOWING} />
      <div className="a11y"><h1>리디셀렉트 아티클 팔로잉</h1></div>
      {
        channelItems && channelItems.length > 0 ? (
          <SlideChannelList
            channels={channelItems}
          />
        ) : (
          <ArticleEmpty
            iconName="account_1"
            iconClassName="ArticleEmpty_CircleIcon"
            description="팔로잉 중인 채널이 없습니다."
            renderButton={() => (
              <button className="ArticleEmpty_Button">
                전체 채널 보기
              </button>
            )}
          />
        )
      }
      <div className="FollowingArticleList">
        {articleItems &&
          <GridArticleList
            articles={articleItems}
            renderChannelMeta={true}
            renderAuthor={false}
            renderRegDate={true}
            isFullWidthAvailable={true}
          />
        }
      </div>
    </main>

  );
};
