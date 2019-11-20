import * as classNames from 'classnames';
import * as React from 'react';

import { HelmetWithTitle } from 'app/components';
import { ArticleHomeSection } from 'app/components/ArticleHome/ArticleHomeSection';
import { ConnectedBigBannerCarousel } from 'app/components/Home/BigBanner';
import { PageTitleText } from 'app/constants';
import { ArticleHomeSectionType, ArticleSectionType } from 'app/services/articleHome';
import { Actions } from 'app/services/articleHome';
import { RidiSelectState } from 'app/store';
import { useDispatch, useSelector } from 'react-redux';

export const ArticleHome: React.FunctionComponent = () => {
  const { bigBannerList } = useSelector((state: RidiSelectState) => state.articleHome);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (bigBannerList.length <= 0) {
      dispatch(Actions.loadArticleBannerRequest());
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
        articleHomeSectionType={ArticleHomeSectionType.RECENT}
      />
    </div>
    <div className="ArticleHome_Panel">
      <ArticleHomeSection
        title={'인기 아티클'}
        type={ArticleSectionType.CHART}
        articleHomeSectionType={ArticleHomeSectionType.POPULAR}
      />
    </div>
    <div className="ArticleHome_Panel">
      <ArticleHomeSection
        title={'추천 아티클'}
        type={ArticleSectionType.LIST}
        articleHomeSectionType={ArticleHomeSectionType.RECOMMEND}
      />
    </div>
    </main>
  );
};
