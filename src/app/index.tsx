import createCache from '@emotion/cache';
import { Global, CacheProvider } from '@emotion/core';
import 'intersection-observer';
import 'requestidlecallback-polyfill';
import React from 'react';
import Helmet from 'react-helmet';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import smoothscroll from 'smoothscroll-polyfill';

import { store } from 'app/store';
import { Actions } from 'app/services/user';
import { ConnectedRoutes } from 'app/routes';
import setTabKeyFocus from 'app/config/setTabKeyFocus';
import { fetchUserInfo } from 'app/services/user/helper';
import { ConnectedEnvBadge } from 'app/components/EnvBadge';
import { initializeScrollEnd } from 'app/utils/onWindowScrollEnd';
import { setInitializeInAppEvent } from 'app/utils/inAppMessageEvents';
import { ViewportIntersectionProvider } from 'hooks/useViewportIntersection';

import { selectIsInApp } from './services/environment/selectors';
import ResponsiveManager from './ResponsiveManager';
import { GlobalStyles } from './styles/globals';

smoothscroll.polyfill();

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
  }

  public render() {
    return (
      <Provider store={store}>
        {selectIsInApp(store.getState()) && (
          <Helmet
            meta={[
              {
                name: 'viewport',
                content:
                  'width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no',
              },
            ]}
          />
        )}
        <Global styles={GlobalStyles} />
        <ResponsiveManager />
        <CacheProvider value={styleCache}>
          <ViewportIntersectionProvider>
            <ConnectedEnvBadge />
            <ConnectedRoutes />
          </ViewportIntersectionProvider>
        </CacheProvider>
      </Provider>
    );
  }
}

render(<App />, document.getElementById('app'));
