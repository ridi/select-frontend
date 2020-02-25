import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';
import React from 'react';
import Helmet from 'react-helmet';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import createCache from '@emotion/cache';
import { css, CacheProvider } from '@emotion/core';

import { store } from 'app/store';
import { Actions } from 'app/services/user';
import { ConnectedRoutes } from 'app/routes';
import { loadFonts } from 'app/config/fonts';
import setTabKeyFocus from 'app/config/setTabKeyFocus';
import { fetchUserInfo } from 'app/services/user/helper';
import { ConnectedEnvBadge } from 'app/components/EnvBadge';
import PageLoadingSpinner from 'app/components/PageLoadingSpinner';
import { initializeScrollEnd } from 'app/utils/onWindowScrollEnd';
import { setInitializeInAppEvent } from 'app/utils/inAppMessageEvents';
import { selectIsInApp } from './services/environment/selectors';

// Show browser input focused outline when tab key is pressed
setTabKeyFocus();

// initialize ScrollEnd Event listener for imperssion tracking
initializeScrollEnd();

setInitializeInAppEvent();

const styleCache = createCache();

class App extends React.Component {
  public componentDidMount() {
    fetchUserInfo()
      .then(user => {
        store.dispatch(Actions.initializeUser({ userDTO: user }));
      })
      .finally(() => {
        store.dispatch(Actions.fetchUserInfo({ isFetching: false }));
      });
    loadFonts();
  }

  public render() {
    return (
      <Provider store={store}>
        <Helmet
          meta={[
            {
              name: 'viewport',
              content: `width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover${
                selectIsInApp(store.getState()) ? ', maximum-scale=1, user-scalable=no' : ''
              }`,
            },
          ]}
        />
        <CacheProvider value={styleCache}>
          <React.Suspense fallback={<PageLoadingSpinner />}>
            <ConnectedEnvBadge />
            <ConnectedRoutes />
          </React.Suspense>
        </CacheProvider>
      </Provider>
    );
  }
}

render(<App />, document.getElementById('app'));
