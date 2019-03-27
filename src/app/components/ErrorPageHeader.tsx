import * as React from 'react';
import { connect } from 'react-redux';

import { Icon } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';

interface ErrorPageHeaderStateProps {
  selectUrl: string;
}

export const ErrorPageHeader: React.SFC<ErrorPageHeaderStateProps> = (props) => (
  <header className="PageError_Header">
    <a className="PageError_Header_Link" href={props.selectUrl}>
      <Icon
        name="logo_ridiselect_1"
        className="PageError_Header_Logo"
      />
    </a>
  </header>
);

const mapStateToProps = (state: RidiSelectState): ErrorPageHeaderStateProps => {
  return {
    selectUrl: state.environment.SELECT_URL,
  };
};

export const ConnectedErrorPageHeader = connect(mapStateToProps, null)(ErrorPageHeader);
