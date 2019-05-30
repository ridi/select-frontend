import * as pathToRegexp from 'path-to-regexp';
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { ConnectedFooter, ConnectedGNB, ConnectedLNB } from 'app/components';
import { ConnectedSplashScreen } from 'app/components/SplashScreen';
import { ErrorResponseData, ErrorResponseStatus } from 'app/services/serviceStatus';

import history from 'app/config/history';
import {
  ConnectedAvailableBooks,
  ConnectedBookDetail,
  ConnectedCategory,
  ConnectedCharts,
  ConnectedClosingReservedBooks,
  ConnectedCollection,
  ConnectedErrorPage,
  ConnectedGuide,
  ConnectedHome,
  ConnectedIntro,
  ConnectedMaintenancePage,
  ConnectedManageSubscription,
  ConnectedMySelect,
  ConnectedMySelectHistory,
  ConnectedNewReleases,
  ConnectedOrderHistory,
  ConnectedSearchResult,
  ConnectedSetting,
  InAppIntro,
  NotAvailableBook,
} from 'app/scenes';

import { RoutePaths } from 'app/constants';
import {
  ConnectedPublicRoute,
  ConnectedScrollManager,
  NonSubscriberOnlyRoute,
  PrivateRoute,
} from 'app/hocs';
import { RidiSelectState } from 'app/store';
import { getIsAndroidInApp, selectIsInApp } from './services/environment/selectors';

export interface Props {
  isRidiApp: boolean;
  IsAndroidInApp: boolean;
  isFetching: boolean;
  isSubscribing: boolean;
  errorResponseState?: ErrorResponseStatus;
  errorResponse?: ErrorResponseData;
}

export const inAppGnbRoutes = [
  RoutePaths.HOME,
  RoutePaths.NEW_RELEASE,
  RoutePaths.CATEGORY,
  RoutePaths.MY_SELECT,
  RoutePaths.SEARCH_RESULT,
  RoutePaths.INTRO,
];

export const LNBRoutes = [
  RoutePaths.HOME,
  RoutePaths.NEW_RELEASE,
  RoutePaths.CATEGORY,
  RoutePaths.MY_SELECT,
];

export const PrimaryRoutes = [
  RoutePaths.CHARTS,
  pathToRegexp.parse(RoutePaths.COLLECTION)[0],
];

export const Routes: React.SFC<Props> = (props) => {
  const { errorResponseState, errorResponse } = props;

  if (errorResponseState) {
    return errorResponse && errorResponse.status === 'maintenance' ? <ConnectedMaintenancePage /> : <ConnectedErrorPage />;
  }

  return (
    <>
      <ConnectedSplashScreen {...props} />
      {!props.isFetching ? (
        <ConnectedRouter history={history}>
          <ConnectedScrollManager>
            <Route
              render={({ location }) => (
                (!props.isRidiApp || (inAppGnbRoutes.includes(location.pathname as RoutePaths))) && <ConnectedGNB />
              )}
            />
            <Route
              render={({ location }) => (
                (LNBRoutes.includes(location.pathname as RoutePaths)) && <ConnectedLNB />
              )}
            />
            <Switch>
              <PrivateRoute
                path={RoutePaths.HOME}
                component={ConnectedHome}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.NEW_RELEASE}
                component={ConnectedNewReleases}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.CHARTS}
                component={ConnectedCharts}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.COLLECTION}
                component={ConnectedCollection}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.CATEGORY}
                component={ConnectedCategory}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.MY_SELECT}
                component={ConnectedMySelect}
                {...props}
              />
              <ConnectedPublicRoute
                path={RoutePaths.BOOK_DETAIL}
                component={ConnectedBookDetail}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.SETTING}
                component={ConnectedSetting}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.MANAGE_SUBSCRIPTION}
                component={ConnectedManageSubscription}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.ORDER_HISTORY}
                component={ConnectedOrderHistory}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.MY_SELECT_HISTORY}
                component={ConnectedMySelectHistory}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.SEARCH_RESULT}
                component={ConnectedSearchResult}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.NOT_AVAILABLE_BOOK}
                component={NotAvailableBook}
                {...props}
              />
              <ConnectedPublicRoute
                path={RoutePaths.GUIDE}
                component={ConnectedGuide}
                {...props}
              />
              <ConnectedPublicRoute
                path={RoutePaths.AVAILABLE_BOOKS}
                component={ConnectedAvailableBooks}
                {...props}
              />
              <PrivateRoute
                path={RoutePaths.CLOSING_RESERVED_BOOKS}
                component={ConnectedClosingReservedBooks}
                {...props}
              />
              <NonSubscriberOnlyRoute
                path={RoutePaths.INTRO}
                exact={true}
                component={props.isRidiApp ? InAppIntro : ConnectedIntro}
                {...props}
              />
              <ConnectedPublicRoute
                component={ConnectedErrorPage}
                {...props}
              />
            </Switch>
            {!props.isRidiApp && <ConnectedFooter />}
          </ConnectedScrollManager>
        </ConnectedRouter>
      ) : null}
    </>
  );
};

const mapStateToProps = (rootState: RidiSelectState): Props => ({
  isRidiApp: selectIsInApp(rootState),
  IsAndroidInApp: getIsAndroidInApp(rootState),
  isFetching: rootState.user.isFetching,
  isSubscribing: rootState.user.isSubscribing,
  errorResponseState: rootState.serviceStatus.errorResponseState,
  errorResponse: rootState.serviceStatus.errorResponseData,
});

export const ConnectedRoutes = connect(mapStateToProps)(Routes);
