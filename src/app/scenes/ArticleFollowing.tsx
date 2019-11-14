import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle, Pagination } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { GridArticleList } from 'app/components/GridArticleList';
import { SlideChannelList } from 'app/components/SlideChannelList';
import { FetchStatusFlag, PageTitleText, RoutePaths } from 'app/constants';
import { Actions } from 'app/services/articleFollowing';
import { getArticleItems, getChannelItems } from 'app/services/articleFollowing/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

export const ArticleFollowing: React.FunctionComponent = () => {
  const itemCountPerPage = 24;

  const dispatch = useDispatch();
  const page = useSelector(getPageQuery);
  const channelItems = useSelector(getChannelItems);
  const articleItems = useSelector(getArticleItems);
  const { channelFetchStatus, articleFetchStatus, itemCount } = useSelector((state: RidiSelectState) => ({
    itemCount: state.articleFollowing.itemCount ? state.articleFollowing.itemCount : 1,
    channelFetchStatus: state.articleFollowing.fetchStatus,
    articleFetchStatus:
      state.articleFollowing.followingArticleList && state.articleFollowing.followingArticleList.itemListByPage[page]
        ? state.articleFollowing.followingArticleList.itemListByPage[page].fetchStatus
        : FetchStatusFlag.IDLE,
  }));

  React.useEffect(() => {
    if (channelFetchStatus === FetchStatusFlag.IDLE) {
      dispatch(Actions.loadFollowingChannelListRequest());
    }
    if (articleFetchStatus === FetchStatusFlag.IDLE) {
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
      {channelItems && channelItems.length > 0 ? (
        <>
          <SlideChannelList
            channels={channelItems}
          />
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
          <MediaQuery maxWidth={840}>
            {(isMobile) => (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(itemCount / itemCountPerPage)}
                isMobile={isMobile}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `${RoutePaths.ARTICLE_FOLLOWING}?page=${p}`,
                  }),
                }}
              />
            )}
          </MediaQuery>
        </>
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
      )}
    </main>

  );
};
