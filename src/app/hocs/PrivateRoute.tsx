import * as React from 'react';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router';
import { Route } from 'react-router-dom';

import { FetchStatusFlag, RoutePaths } from 'app/constants';
import toast from 'app/utils/toast';

export enum RouteBlockLevel {
  LOGGED_IN,
  HAS_AVAILABLE_TICKET,
}

export interface PrivateRouteProps extends RouteProps {
  isRidiApp: boolean;
  isFetching: boolean;
  isLoggedIn: boolean;
  ticketFetchStatus: FetchStatusFlag;
  hasAvailableTicket: boolean;
  routeBlockLevel?: RouteBlockLevel;
}

export const PrivateRoute: React.SFC<PrivateRouteProps & RouteComponentProps> = (props) => {
  const {
    isFetching,
    isLoggedIn,
    ticketFetchStatus,
    hasAvailableTicket,
    routeBlockLevel = RouteBlockLevel.HAS_AVAILABLE_TICKET,
    ...restProps
  } = props;

  if (isFetching || ticketFetchStatus === FetchStatusFlag.FETCHING) {
    return <div className="SplashScreen SplashScreen-whiteScreen" />;
  }

  if (
    routeBlockLevel === RouteBlockLevel.LOGGED_IN && !isLoggedIn ||
    routeBlockLevel === RouteBlockLevel.HAS_AVAILABLE_TICKET && !hasAvailableTicket
  ) {
    toast.failureMessage(
      routeBlockLevel === RouteBlockLevel.LOGGED_IN ? '로그인 후 접근할 수 있는 화면입니다.' : '이용권 결제 후 접근할 수 있는 화면입니다.',
    );
    props.history.replace({
      pathname: RoutePaths.HOME,
      search: props.location.search,
    });
    return null;
  }

  return <Route {...restProps} />;
};

export const ConnectedPrivateRoute = withRouter(PrivateRoute);
