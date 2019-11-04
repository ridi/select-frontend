import { ConnectedRouter } from 'connected-react-router';
import * as pathToRegexp from 'path-to-regexp';
import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { ConnectedFooter, ConnectedGNB, ConnectedLNB } from 'app/components';
import { ErrorResponseStatus } from 'app/services/serviceStatus';

import history from 'app/config/history';
import {
  ConnectedBookDetail,
  ConnectedCategory,
  ConnectedCharts,
  ConnectedClosingReservedBooks,
  ConnectedCollection,
  ConnectedErrorPage,
  ConnectedGuide,
  ConnectedHome,
  ConnectedManageSubscription,
  ConnectedMySelect,
  ConnectedMySelectHistory,
  ConnectedNewReleases,
  ConnectedOrderHistory,
  ConnectedSearchResult,
  ConnectedSetting,
  Intro,
  NotAvailableBook,
  Voucher,
  WrongLocation,
} from 'app/scenes';

import { RoutePaths } from 'app/constants';
import {
  ConnectedPrivateRoute,
  ConnectedScrollManager,
  RouteBlockLevel,
} from 'app/hocs';
import { RidiSelectState } from 'app/store';
import { selectIsInApp } from './services/environment/selectors';

export interface Props {
  isRidiApp: boolean;
  isFetching: boolean;
  isLoggedIn: boolean;
  isSubscribing: boolean;
  errorResponseState?: ErrorResponseStatus;
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
  const { errorResponseState } = props;

  return !errorResponseState ? (
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
          <Redirect exact={true} from={RoutePaths.ROOT} to={RoutePaths.HOME} />
          <Route
            path={RoutePaths.HOME}
            component={ConnectedHome}
            {...props}
          />
          <Route
            path={RoutePaths.NEW_RELEASE}
            component={ConnectedNewReleases}
            {...props}
          />
          <Route
            path={RoutePaths.CHARTS}
            component={ConnectedCharts}
            {...props}
          />
          <Route
            path={RoutePaths.COLLECTION}
            component={ConnectedCollection}
            {...props}
          />
          <Route
            path={RoutePaths.CATEGORY}
            component={ConnectedCategory}
            {...props}
          />
          <Route
            path={RoutePaths.MY_SELECT}
            component={ConnectedMySelect}
            {...props}
          />
          <Route
            path={RoutePaths.BOOK_DETAIL}
            component={ConnectedBookDetail}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.SETTING}
            component={ConnectedSetting}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.ORDER_HISTORY}
            component={ConnectedOrderHistory}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.MY_SELECT_HISTORY}
            component={ConnectedMySelectHistory}
            routeBlockLevel={RouteBlockLevel.LOGGED_IN}
            {...props}
          />
          <Route
            path={RoutePaths.SEARCH_RESULT}
            component={ConnectedSearchResult}
            {...props}
          />
          <Route
            path={RoutePaths.NOT_AVAILABLE_BOOK}
            component={NotAvailableBook}
            {...props}
          />
          <Route
            path={RoutePaths.GUIDE}
            component={ConnectedGuide}
            {...props}
          />
          <Route
            path={RoutePaths.CLOSING_RESERVED_BOOKS}
            component={ConnectedClosingReservedBooks}
            {...props}
          />
          <Route
            path={RoutePaths.INTRO}
            exact={true}
            component={Intro}
            {...props}
          />
          <Route
            path={RoutePaths.VOUCHER}
            exact={true}
            component={Voucher}
            {...props}
          />
          <ConnectedPrivateRoute
            path={RoutePaths.MANAGE_SUBSCRIPTION}
            component={ConnectedManageSubscription}
            routeBlockLevel={RouteBlockLevel.SUBSCRIBED}
            {...props}
          />
          <Route
            component={WrongLocation}
            {...props}
          />
        </Switch>
        {!props.isRidiApp && <ConnectedFooter />}
      </ConnectedScrollManager>
    </ConnectedRouter>
  ) : <ConnectedErrorPage />;
};

const mapStateToProps = (rootState: RidiSelectState): Props => ({
  isLoggedIn: rootState.user.isLoggedIn,
  isRidiApp: selectIsInApp(rootState),
  isFetching: rootState.user.isFetching,
  isSubscribing: rootState.user.isSubscribing,
  errorResponseState: rootState.serviceStatus.errorResponseState,
});

export const ConnectedRoutes = connect(mapStateToProps)(Routes);
