import classNames from 'classnames';
import { differenceInHours } from 'date-fns';
import React from 'react';
import { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ConnectedBigBannerCarousel } from 'app/components/Home/BigBanner';
import { ConnectedHomeSectionList } from 'app/components/Home/HomeSectionList';
import { PageTitleText } from 'app/constants';
import { Actions as CollectionActions, CollectionId } from 'app/services/collection';
import { Actions } from 'app/services/home';
import { RidiSelectState } from 'app/store';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';

interface HomeStateProps {
  fetchedAt: number | null;
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
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): HomeStateProps => ({
  fetchedAt: state.home.fetchedAt,
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchLoadHomeRequest: () => dispatch(Actions.loadHomeRequest()),
  dispatchLoadCollectionRequest: (collectionId: CollectionId) => dispatch(CollectionActions.loadCollectionRequest({ collectionId, page: 1 })),
});

export const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);
