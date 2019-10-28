import * as classNames from 'classnames';
import { differenceInHours } from 'date-fns';
import * as React from 'react';
import { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { AlertForNonSubscriber } from 'app/components/AlertForNonSubscriber';
import { ConnectedBigBannerCarousel } from 'app/components/Home/BigBanner';
import { ConnectedHomeSectionList } from 'app/components/Home/HomeSectionList';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { BookState } from 'app/services/book';
import { Actions as CollectionActions, CollectionId, CollectionsState } from 'app/services/collection';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { Actions } from 'app/services/home';
import { RidiSelectState } from 'app/store';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';

interface HomeStateProps {
  isIosInApp: boolean;
  isFetching: boolean;
  isLoggedIn: boolean;
  isSubscribing: boolean;
  fetchStatus: FetchStatusFlag;
  fetchedAt: number | null;
  collectionIdList: number[];
  books: BookState;
  collections: CollectionsState;
}
interface State {
  isInitialized: boolean;
}

export class Home extends React.PureComponent<HomeStateProps & ReturnType<typeof mapDispatchToProps>, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const {
        fetchedAt,
        dispatchLoadHomeRequest,
        dispatchLoadCollectionRequest,
      } = this.props;
      sendPostRobotInitialRendered();
      if (
        !fetchedAt ||
        Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3
      ) {
        dispatchLoadHomeRequest();
        dispatchLoadCollectionRequest('spotlight');
      }
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
      forceCheck();
    });
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    const { isIosInApp, isFetching, isSubscribing } = this.props;

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
        <div className="a11y"><h1>리디셀렉트 홈</h1></div>
        <ConnectedBigBannerCarousel />
        <ConnectedHomeSectionList />
        {(!isIosInApp && !isFetching && !isSubscribing) && <AlertForNonSubscriber />}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): HomeStateProps => {
  return {
    isIosInApp: getIsIosInApp(state),
    isFetching: state.user.isFetching,
    isLoggedIn: state.user.isLoggedIn,
    isSubscribing: state.user.isSubscribing,
    fetchStatus: state.home.fetchStatus,
    fetchedAt: state.home.fetchedAt,
    collectionIdList: state.home.collectionIdList,
    collections: state.collectionsById,
    books: state.booksById,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadHomeRequest: () => dispatch(Actions.loadHomeRequest()),
    dispatchLoadCollectionRequest: (collectionId: CollectionId) => dispatch(CollectionActions.loadCollectionRequest({ collectionId, page: 1 })),
  };
};

export const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);
