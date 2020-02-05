import { storiesOf } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { ConnectedPageHeader, ConnectedFooter } from 'app/components';
import 'dist/main.css';

storiesOf('Common Components', module)
  .addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  .add('PageTitle', () => (
    <>
      <ConnectedPageHeader pageTitle="이용 방법" />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <ConnectedPageHeader pageTitle="이용 방법" underline />
    </>
  ))
  .add('Footer', () => <ConnectedFooter />);
