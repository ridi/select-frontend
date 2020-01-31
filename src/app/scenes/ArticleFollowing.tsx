import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle, Pagination } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { GridArticleList } from 'app/components/GridArticleList';
import { SlideChannelList } from 'app/components/SlideChannelList';
import { FetchStatusFlag, MAX_WIDTH, PageTitleText, RoutePaths } from 'app/constants';
import { GridArticleListPlaceholder } from 'app/placeholder/GridArticleListPlaceholder';
import { SlideChannelListPlaceholder } from 'app/placeholder/SlideChannelListPlaceholder';
import { Actions } from 'app/services/articleFollowing';
import { getArticleItems, getChannelItems } from 'app/services/articleFollowing/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { checkCorrectPath } from 'app/utils/utils';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

export const ArticleFollowing: React.FunctionComponent = () => {
  const itemCountPerPage = 12;

  const dispatch = useDispatch();
  const {
    page,
    channelFetchStatus,
    articleFetchStatus,
    itemCount,
    channelItems,
    articleItems,
    hasAvailableTicket,
  } = useSelector((state: RidiSelectState) => {
    const pageFromQuery = getPageQuery(state);
    const followingArticleListByPage = state.articleFollowing.followingArticleList && state.articleFollowing.followingArticleList.itemListByPage[pageFromQuery]
      ? state.articleFollowing.followingArticleList.itemListByPage[pageFromQuery]
      : null;
    const followingArticleListFetchStatus = followingArticleListByPage ? followingArticleListByPage.fetchStatus : FetchStatusFlag.IDLE;

    return {
      page: pageFromQuery,
      itemCount: state.articleFollowing.followingArticleList && state.articleFollowing.followingArticleList.itemCount ?
        state.articleFollowing.followingArticleList.itemCount : 1,
      channelFetchStatus: state.articleFollowing.fetchStatus,
      articleFetchStatus: followingArticleListFetchStatus,
      channelItems: getChannelItems(state),
      articleItems: getArticleItems(state),
      hasAvailableTicket: state.user.hasAvailableTicket,
    };
  });

  React.useEffect(() => {
    if (channelFetchStatus === FetchStatusFlag.IDLE) {
      dispatch(Actions.loadFollowingChannelListRequest());
    }
    if (articleFetchStatus === FetchStatusFlag.IDLE && checkCorrectPath(RoutePaths.ARTICLE_FOLLOWING)) {
      dispatch(Actions.loadFollowingArticleListRequest({ page }));
    }
  }, [page]);

  React.useEffect(() => {
    if (hasAvailableTicket) {
      dispatch(Actions.setUnseenFollowingFeedsToSeenRequest());
    }
  }, [hasAvailableTicket]);

  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
        'PageArticleFollowing',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_FOLLOWING} />
      <div className="a11y"><h1>리디셀렉트 아티클 팔로잉</h1></div>
      {channelItems ? (
        channelItems.length > 0 ? (
          <>
            <SlideChannelList
              channels={channelItems}
            />
            <div className="FollowingArticleList">
              {articleItems && articleItems.length > 0 ?
                <GridArticleList
                  serviceTitleForTracking="select-article"
                  pageTitleForTracking="following"
                  uiPartTitleForTracking="article-list"
                  miscTracking={JSON.stringify({ sect_page: page })}
                  articles={articleItems}
                  renderChannelThumbnail={true}
                  renderChannelMeta={true}
                  renderAuthor={false}
                  renderPublishDate={true}
                  renderFavoriteButton={true}
                  isFullWidthAvailable={true}
                  gridListSizeClassNames="GridArticleList-large"
                /> :
                <GridArticleListPlaceholder
                  gridSize={'large'}
                />
              }
            </div>
            <MediaQuery maxWidth={MAX_WIDTH}>
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
            iconName="profile"
            iconClassName="ArticleEmpty_CircleIcon"
            description="팔로잉 중인 채널이 없습니다."
            renderButton={() => (
              <Link to={RoutePaths.ARTICLE_CHANNELS} className="ArticleEmpty_Button">
              전체 채널 보기
              </Link>
            )}
          />
        )
      ) : (
        <>
          <SlideChannelListPlaceholder />
          <div className="FollowingArticleList">
            <GridArticleListPlaceholder
              gridSize={'large'}
            />
          </div>
        </>
      )
      }
    </main>
  );
};
