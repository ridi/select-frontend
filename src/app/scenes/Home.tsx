import styled from '@emotion/styled';
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
import Media from 'app/styles/mediaQuery';
import { Scene } from 'app/styles/globals';

const isNeedLoad = (fetchedAt: FetchedAt) =>
  !fetchedAt || Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3;

const BooksHome = styled.main`
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
    if (!isUserFetching && !collections.popularBooks?.itemListByPage[1]?.itemList) {
      dispatch(CollectionActions.loadPopularBooksRequest({ page: 1 }));
    }
  }, [isUserFetching]);

  return (
    <BooksHome>
      <HelmetWithTitle titleName={PageTitleText.HOME} />
      <h1 className="a11y">리디셀렉트 홈</h1>
      <BigBanner />
      <HomeSectionList />
    </BooksHome>
  );
};

export default Home;
