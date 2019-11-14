import { createAction, createReducer } from 'redux-act';

export const Actions = {
  updateAppStatus: createAction<{
    appStatus: AppStatus,
  }>('updateAppStatus'),
};

export enum AppStatus {
  Books = 'Books',
  Article = 'Articles',
}

export interface AppState {
  appStatus: AppStatus;
}

export const INITIAL_STATE: AppState = {
  appStatus: AppStatus.Books,
};

export const appReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

appReducer.on(Actions.updateAppStatus, (state, action) => ({
  ...state,
  appStatus: action.appStatus,
}));
