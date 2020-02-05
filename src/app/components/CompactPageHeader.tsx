import React from 'react';
import { connect } from 'react-redux';

import { Icon } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';

interface CompactPageHeaderStateProps {
  selectUrl: string;
}

export const CompactPageHeader: React.FunctionComponent<CompactPageHeaderStateProps> = props => (
  <header className="CompactPageHeader">
    <a className="CompactPageHeader_Link" href={props.selectUrl}>
      <Icon name="logo_ridiselect_1" className="CompactPageHeader_Logo" />
    </a>
  </header>
);

const mapStateToProps = (state: RidiSelectState): CompactPageHeaderStateProps => ({
  selectUrl: state.environment.SELECT_URL,
});

export const ConnectedCompactPageHeader = connect(mapStateToProps, null)(CompactPageHeader);
