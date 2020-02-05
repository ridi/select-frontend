import { MAX_WIDTH } from 'app/constants';
import React from 'react';
import MediaQuery from 'react-responsive';
import { ConnectedPageHeader, PageHeaderOwnProps } from './PageHeader';

export const PCPageHeader: React.SFC<PageHeaderOwnProps> = props => (
  <MediaQuery maxWidth={MAX_WIDTH + 1}>
    {isMobile =>
      isMobile ? <h1 className="a11y">{props.pageTitle}</h1> : <ConnectedPageHeader {...props} />
    }
  </MediaQuery>
);
