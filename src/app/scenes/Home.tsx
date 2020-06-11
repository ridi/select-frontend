import classNames from 'classnames';
import React, { useEffect } from 'react';
import { forceCheck } from 'react-lazyload';
import { useSelector, useDispatch } from 'react-redux';
import differenceInHours from 'date-fns/differenceInHours';

import { homeActions, FetchedAt } from 'app/services/home';
import { PageTitleText } from 'app/constants';
import { HelmetWithTitle } from 'app/components';
import BigBanner from 'app/components/Home/BigBanner';
import HomeSectionList from 'app/components/Home/HomeSectionList';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';
import { Actions as CollectionActions, ReservedCollectionIds } from 'app/services/collection';
import { getFetchedAt } from 'app/services/home/selectors';
import { getCollections } from 'app/services/collection/selectors';
import { getIsUserFetching } from 'app/services/user/selectors';

const isNeedLoad = (fetchedAt: FetchedAt) =>
  !fetchedAt || Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3;

const Home: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const fetchedAt = useSelector(getFetchedAt);
  const isUserFetching = useSelector(getIsUserFetching);
  const collections = useSelector(getCollections);

  useEffect(() => {
    sendPostRobotInitialRendered();
    if (isNeedLoad(fetchedAt)) {
      dispatch(homeActions.loadHomeRequest());
      dispatch(
        CollectionActions.loadCollectionRequest({
          collectionId: ReservedCollectionIds.SPOTLIGHT,
          page: 1,
        }),
      );
    }
    forceCheck();
  }, []);

  useEffect(() => {
    if (!isUserFetching && !collections.popular?.itemListByPage[1]?.itemList) {
      dispatch(CollectionActions.loadPopularBooksRequest({ page: 1 }));
    }
  }, [isUserFetching]);

  return (
    <main
      className={classNames(
        'PageHome',
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.HOME} />
      <h1 className="a11y">리디셀렉트 홈</h1>
      <BigBanner />
      <HomeSectionList />
    </main>
  );
};

export default Home;
