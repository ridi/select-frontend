import * as classNames from 'classnames';
import * as React from 'react';

import { Actions } from 'app/services/articleFollowing';
import { RidiSelectState } from 'app/store';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { PageTitleText } from 'app/constants';
import { getPageQuery } from 'app/services/routing/selectors';

import { SlideChannelList } from 'app/components/SlideChannelList';
import { TileArticleList } from 'app/components/TileArticleList';

export const ArticleFollowing: React.FunctionComponent = () => {
  const { articleFollowing, articleChannelById, articlesById } = useSelector((state: RidiSelectState) => state);
  const page = useSelector(getPageQuery);
  const dispatch = useDispatch();

  const isFetched = () => {
    return (articleFollowing && articleFollowing.isFetched);
  };

  const isFollowingChannelFetched = () => {
    if (!isFetched()) {
      return false;
    }
    return articleFollowing.isFetched;
  };

  const isFollowingArticleFetched = () => {
    if (!isFetched()) {
      return false;
    }
    return ( articleFollowing.followingArticleList
      && articleFollowing.followingArticleList.itemListByPage[page]
      && articleFollowing.followingArticleList.itemListByPage[page].isFetched);
  };

  React.useEffect(() => {
    if (!isFollowingChannelFetched()) {
      dispatch(Actions.loadFollowingChannelListRequest());
    }

    if (!isFollowingArticleFetched()) {
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
        isFetched() && articleFollowing.followingChannelList ? (
          <SlideChannelList
            channels={
              articleFollowing
                .followingChannelList
                .map((id) => articleChannelById[Number(id)].channelMeta!)}
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
      {/* ArticleList 영역 */}
      <div className="FollowingArticleList">
      { isFollowingArticleFetched() &&
        <TileArticleList
          articles={
            articleFollowing
              .followingArticleList!
              .itemListByPage[page]
              .itemList
              .map((id) => articlesById[id].article!)}
        />
      }
      </div>
    </main>

  );
};
