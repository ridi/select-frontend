import styled from '@emotion/styled';
import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import differenceInHours from 'date-fns/differenceInHours';

import { RidiSelectState } from 'app/store';
import { HelmetWithTitle } from 'app/components';
import { Actions } from 'app/services/articleHome';
import { ArticleListType } from 'app/services/articleList';
import BigBanner from 'app/components/Home/BigBanner';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';
import * as styles from 'app/components/ArticleHome/articleHomeSectionStyles';
import { Actions as ArticleFollowingActions } from 'app/services/articleFollowing';
import { ArticleHomeListSection } from 'app/components/ArticleHome/ArticleHomeListSection';
import { ArticleHomeChartSection } from 'app/components/ArticleHome/ArticleHomeChartSection';
import Media from 'app/styles/mediaQuery';
import { Scene } from 'app/styles/globals';

const Home = styled.main`
  ${Scene.Wrapper}
  ${Scene.WithGNB}
  ${Scene.WithLNB}
  @media ${Media.PC} {
    padding-bottom: 80px;
    background-color: initial;
  }

  .androidApp & {
    padding-bottom: 0;
  }
`;

const ArticleHome: React.FunctionComponent = () => {
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
    <Home>
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_HOME} />
      <div className="a11y">
        <h1>리디셀렉트 아티클 홈</h1>
      </div>
      <BigBanner />
      <div css={styles.articleHomePanel}>
        <ArticleHomeListSection
          title={PageTitleText.ARTICLE_RECENT}
          articleListType={ArticleListType.RECENT}
          order={0}
        />
      </div>
      <div css={styles.articleHomePanel}>
        <ArticleHomeChartSection
          title={PageTitleText.ARTICLE_POPULAR}
          articleListType={ArticleListType.POPULAR}
          order={1}
        />
      </div>
      <div css={styles.articleHomePanel}>
        <ArticleHomeListSection
          title="추천 아티클"
          articleListType={ArticleListType.RECOMMEND}
          order={2}
        />
      </div>
    </Home>
  );
};

export default ArticleHome;
