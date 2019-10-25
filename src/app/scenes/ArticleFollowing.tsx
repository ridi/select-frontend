import { HelmetWithTitle } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { SlideChannelList } from 'app/components/SlideChannelList';
import { PageTitleText } from 'app/constants';
import { Actions } from 'app/services/articleFollowing';
import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ArticleFollowing: React.FunctionComponent = () => {
  const { articleFollowing, articleChannelById } = useSelector((state: RidiSelectState) => state);
  const dispatch = useDispatch();

  const isFetched = () => {
    return (articleFollowing && articleFollowing.isFetched);
  };

  React.useEffect(() => {
    if (!isFetched()) {
      dispatch(Actions.loadFollowingChannelListRequest());
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
          <SlideChannelList channels={articleFollowing.followingChannelList.map((id) => articleChannelById[Number(id)].channelMeta!)} />
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
    </main>

  );
};
