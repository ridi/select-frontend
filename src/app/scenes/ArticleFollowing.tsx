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

import { getArticleItems, getChannelItems } from 'app/services/articleFollowing/selectors';

export const ArticleFollowing: React.FunctionComponent = () => {
  const page = useSelector(getPageQuery);
  const channelItems = useSelector(getChannelItems);
  const articleItems = useSelector(getArticleItems);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (channelItems.length <= 0) {
      dispatch(Actions.loadFollowingChannelListRequest());
    }
    if (articleItems.length <= 0) {
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
        channelItems ? (
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
      {/* ArticleList 영역 */}
      <div className="FollowingArticleList">
      { articleItems &&
        <TileArticleList
          articles={articleItems}
        />
      }
      </div>
    </main>

  );
};
