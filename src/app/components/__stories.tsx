import { storiesOf } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { ConnectedPageHeader } from 'app/components';
import 'dist/main.css';
import { ConnectedFooter } from '.';

storiesOf('Common Components', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('PageTitle', () => (
    <>
      <ConnectedPageHeader pageTitle="이용 방법" />
      <br/><br/><br/><br/><br/><br/>
      <ConnectedPageHeader pageTitle="이용 방법" underline={true}/>
    </>
  ))
  .add('Footer', () => (
    <ConnectedFooter />
  ));
