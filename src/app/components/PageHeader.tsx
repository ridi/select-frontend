import { ConnectedWebActionBar } from 'app/components/CustomHistory/WebActionBar';
import { RoutePaths } from 'app/constants';
import { inAppGnbRoutes } from 'app/routes';
import { selectIsInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { Location } from 'history';
import React from 'react';
import { connect } from 'react-redux';
import { PageTitle } from './PageTitle';

export interface PageHeaderStateProps {
  isInApp: boolean;
  location: Location;
}

export interface PageHeaderOwnProps {
  underline?: boolean;
  pageTitle?: string;
}

export type PageHeaderProps = PageHeaderStateProps & PageHeaderOwnProps;

export const PageHeader: React.SFC<PageHeaderProps> = ({
  isInApp,
  location,
  underline,
  pageTitle,
  children,
}) => {
  if ((!pageTitle && !children)) {
    return null;
  }

  if (
    isInApp &&
    !inAppGnbRoutes.includes(location.pathname as RoutePaths)
  ) {
    return (
      <>
        {pageTitle && <ConnectedWebActionBar>{pageTitle}</ConnectedWebActionBar>}
        {!!children && <div className="PageHeader">{children}</div>}
      </>
    );
  }

  return (
    <div className="PageHeader">
      {pageTitle && <PageTitle underline={underline}>{pageTitle}</PageTitle>}
      {children}
    </div>
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  isInApp: selectIsInApp(rootState),
  location: rootState.router.location,
});

export const ConnectedPageHeader = connect(mapStateToProps)(PageHeader);
