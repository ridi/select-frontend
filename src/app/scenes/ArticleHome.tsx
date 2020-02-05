import classNames from 'classnames';
import { differenceInHours } from 'date-fns';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ArticleHomeSection } from 'app/components/ArticleHome/ArticleHomeSection';
import { ConnectedBigBannerCarousel } from 'app/components/Home/BigBanner';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { Actions as ArticleFollowingActions } from 'app/services/articleFollowing';
import { Actions, ArticleHomeSectionType, ArticleSectionType } from 'app/services/articleHome';

import { RidiSelectState } from 'app/store';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';

export const ArticleHome: React.FunctionComponent = () => {
  const { fetchedAt, hasAvailableTicket, unseenFeedsFetchStatus } = useSelector(
    (state: RidiSelectState) => ({
      fetchedAt: state.articleHome.fetchedAt,
      hasAvailableTicket: state.user.hasAvailableTicket,
      unseenFeedsFetchStatus: state.articleFollowing.unseenFeedsFetchStatus,
    }),
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!fetchedAt || Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3) {
      dispatch(Actions.loadArticleBannerRequest());
    }
    sendPostRobotInitialRendered();
  }, []);

  React.useEffect(() => {
    if (hasAvailableTicket && unseenFeedsFetchStatus !== FetchStatusFlag.FETCHING) {
      dispatch(ArticleFollowingActions.loadUnseenFollowingFeedsRequest());
    }
  }, [hasAvailableTicket]);

  return (
    <main
      className={classNames(
        'PageHome',
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_HOME} />
      <div className="a11y">
        <h1>리디셀렉트 아티클 홈</h1>
      </div>
      <ConnectedBigBannerCarousel />
      <div className="ArticleHome_Panel">
        <ArticleHomeSection
          title="최근 추가된 아티클"
          type={ArticleSectionType.LIST}
          articleHomeSectionType={ArticleHomeSectionType.RECENT}
          order={0}
        />
      </div>
      <div className="ArticleHome_Panel">
        <ArticleHomeSection
          title="인기 아티클"
          type={ArticleSectionType.CHART}
          articleHomeSectionType={ArticleHomeSectionType.POPULAR}
          order={1}
        />
      </div>
      <div className="ArticleHome_Panel">
        <ArticleHomeSection
          title="추천 아티클"
          type={ArticleSectionType.LIST}
          articleHomeSectionType={ArticleHomeSectionType.RECOMMEND}
          order={2}
        />
      </div>
    </main>
  );
};
