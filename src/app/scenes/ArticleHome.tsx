import * as classNames from 'classnames';
import { differenceInHours } from 'date-fns';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ArticleHomeSection } from 'app/components/ArticleHome/ArticleHomeSection';
import { ConnectedBigBannerCarousel } from 'app/components/Home/BigBanner';
import { PageTitleText } from 'app/constants';
import { Actions, ArticleSectionType } from 'app/services/articleHome';
import { RidiSelectState } from 'app/store';
import { ArticleChartsMockUp, ArticleListMockUp } from 'app/utils/mock';

export const ArticleHome: React.FunctionComponent = () => {
  const fetchedAt = useSelector((state: RidiSelectState) => state.articleHome.fetchedAt);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!fetchedAt || Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3) {
      dispatch(Actions.loadArticleHomeRequest());
    }
  }, []);
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
    <div className="a11y"><h1>리디셀렉트 아티클 홈</h1></div>
    <ConnectedBigBannerCarousel />
    <div className="ArticleHome_Panel">
      <ArticleHomeSection
        title={'최근 추가된 아티클'}
        type={ArticleSectionType.LIST}
        articleList={ArticleListMockUp}
      />
    </div>
    <div className="ArticleHome_Panel">
      <ArticleHomeSection
        title={'실시간 인기 아티클'}
        type={ArticleSectionType.CHART}
        articleChartList={ArticleChartsMockUp}
      />
    </div>
    <div className="ArticleHome_Panel">
      <ArticleHomeSection
        title={'추천 아티클'}
        type={ArticleSectionType.LIST}
        articleList={ArticleListMockUp}
      />
    </div>
    </main>
  );
};
