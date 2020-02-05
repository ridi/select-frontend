import { setFixedScrollToTop } from 'app/utils/utils';
import * as qs from 'qs';
import React from 'react';
import { connect } from 'react-redux';

import { RoutePaths } from 'app/constants';
import { CommonRoutes } from 'app/routes';
import { Actions as appActions, AppStatus } from 'app/services/app';
import { RidiSelectState } from 'app/store';
import { withRouter } from 'react-router-dom';

interface AppManagerProps {
  appStatus: AppStatus;
}
interface ScrollManagerProps {
  location: Location;
  history: History & { action: string };
}

interface QueryString {
  q?: string;
  type?: AppStatus;
}

type Props = ReturnType<typeof mapDispatchToProps> & AppManagerProps & ScrollManagerProps;

export class AppManager extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  private scrollToTopSetter() {
    window.setTimeout(() => {
      setFixedScrollToTop(true);
      window.scrollTo(0, 0);
    });
  }

  private updateAppStatus = () => {
    const { location, appStatus, dispatchUpdateAppStatus } = this.props;
    const queryString: QueryString = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    const isArticlePath = location.pathname.indexOf('/article');
    const isCommonPath = CommonRoutes.includes(location.pathname as RoutePaths);

    if (queryString.type && location.pathname === '/search') {
      dispatchUpdateAppStatus(queryString.type);
      return;
    }
    if (appStatus !== AppStatus.Common && isCommonPath) {
      dispatchUpdateAppStatus(AppStatus.Common);
    } else if (appStatus !== AppStatus.Articles && isArticlePath >= 0) {
      dispatchUpdateAppStatus(AppStatus.Articles);
    } else if (appStatus !== AppStatus.Books && !isCommonPath && isArticlePath < 0) {
      dispatchUpdateAppStatus(AppStatus.Books);
    }
  };

  public UNSAFE_componentWillMount() {
    this.scrollToTopSetter();
  }

  public shouldComponentUpdate(nextProps: ScrollManagerProps) {
    if (this.props.location === nextProps.location) {
      return true;
    }

    if (nextProps.history.action === 'PUSH') {
      this.scrollToTopSetter();
    }

    return true;
  }

  public componentDidMount() {
    window.setTimeout(() => setFixedScrollToTop(false), 300);
  }

  public componentDidUpdate() {
    this.updateAppStatus();

    window.setTimeout(() => {
      setFixedScrollToTop(false);
    }, 300);
  }

  public componentWillUnmount() {
    window.setTimeout(() => setFixedScrollToTop(false), 300);
  }

  public render() {
    return this.props.children;
  }
}

const mapStateToProps = (rootState: RidiSelectState): AppManagerProps => ({
  appStatus: rootState.app.appStatus,
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchUpdateAppStatus: (appStatus: AppStatus) =>
    dispatch(appActions.updateAppStatus({ appStatus })),
});

export const ConnectedAppManager = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(AppManager));
