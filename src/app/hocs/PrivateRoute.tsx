import React from 'react';
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
  ticketFetchStatus: FetchStatusFlag;
  isLoggedIn: boolean;
  BASE_URL_STORE: string;
  hasAvailableTicket: boolean;
  routeBlockLevel?: RouteBlockLevel;
}

export const PrivateRoute: React.SFC<PrivateRouteProps & RouteComponentProps> = (props) => {
  const {
    isFetching,
    isLoggedIn,
    BASE_URL_STORE,
    ticketFetchStatus,
    hasAvailableTicket,
    routeBlockLevel = RouteBlockLevel.HAS_AVAILABLE_TICKET,
    ...restProps
  } = props;

  if (isFetching || ticketFetchStatus === FetchStatusFlag.FETCHING) {
    return <div className="SplashScreen SplashScreen-whiteScreen" />;
  }

  if (routeBlockLevel === RouteBlockLevel.LOGGED_IN && !isLoggedIn) {
    window.location.replace(`${BASE_URL_STORE}/account/oauth-authorize?fallback=login&return_url=${window.location.href}`);
    return null;
  }

  if (
    routeBlockLevel === RouteBlockLevel.HAS_AVAILABLE_TICKET && !hasAvailableTicket
  ) {
    toast.failureMessage('이용권 결제 후 접근할 수 있는 화면입니다.');
    props.history.replace({
      pathname: RoutePaths.HOME,
      search: props.location.search,
    });
    return null;
  }

  return <Route {...restProps} />;
};

export const ConnectedPrivateRoute = withRouter(PrivateRoute);
