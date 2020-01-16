import { createAction, createReducer } from 'redux-act';

import env from 'app/config/env';
import { produce } from 'immer';

const INITIAL_STATE = {
  ...env,
};

export const Actions = {
  setAppEnvironment: createAction<{
    platform: string,
    version: string,
  }>('setAppEnvironment'),
};

export type EnvironmentState = typeof INITIAL_STATE;

export const environmentReducer = createReducer<EnvironmentState>({}, INITIAL_STATE);

environmentReducer.on(Actions.setAppEnvironment, (state, { platform, version }) => produce(state, (draftState) => {
  const isIos = /iphone|ipad|ipod|ios/i.test(platform);
  const isAndroid = /android/i.test(platform);

  draftState.platform.isIos = isIos;
  draftState.platform.isAndroid = isAndroid;
  draftState.platform.isRidibooks = isIos || isAndroid;
  draftState.platform.appVersion = version;
}));
