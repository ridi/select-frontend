import { createAction, createReducer } from 'redux-act';

import { localStorageManager } from 'app/services/app/sagas';

export const Actions = {
  updateAppStatus: createAction<{
    appStatus: AppStatus;
  }>('updateAppStatus'),
};

export enum AppStatus {
  Books = 'Books',
  Articles = 'Articles',
  Common = 'Common',
}

export interface AppState {
  appStatus: AppStatus;
}

export const INITIAL_STATE: AppState = {
  appStatus:
    localStorageManager.load() === AppStatus.Articles ? AppStatus.Articles : AppStatus.Books,
};

export const appReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

appReducer.on(Actions.updateAppStatus, (state, action) => ({
  ...state,
  appStatus: action.appStatus,
}));
