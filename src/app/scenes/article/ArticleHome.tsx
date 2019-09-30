import * as classNames from 'classnames';
import * as differenceInHours from 'date-fns/difference_in_hours';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ConnectedBigBannerCarousel } from 'app/components/Home/BigBanner';
import { PageTitleText } from 'app/constants';
import { Actions } from 'app/services/article/home';
import { RidiSelectState } from 'app/store';

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
    </main>
  );
};
