import { FetchStatusFlag } from 'app/constants';
import { produce } from 'immer';
import { createAction, createReducer } from 'redux-act';

export type ErrorResponseStatus = number;
export interface ErrorResponseData {
  status: string;
  period?: string;
  unavailableService?: string[];
}

export const Actions = {
  setState: createAction<{
    status: ErrorResponseStatus,
    data?: ErrorResponseData,
  }>('setState'),
  resetState: createAction('resetState'),
  loadMaintenanceData: createAction('loadMaintenanceData'),
};

export interface ServiceStatusState {
  fetchStatus: FetchStatusFlag;
  errorResponseState?: ErrorResponseStatus;
  errorResponseData?: ErrorResponseData;
}

export const serviceStatusReducer = createReducer<ServiceStatusState>({}, {
  fetchStatus: FetchStatusFlag.IDLE,
});

serviceStatusReducer.on(Actions.setState, (state, { status, data }) => produce(state, (draftState) => {
  draftState.fetchStatus = FetchStatusFlag.IDLE;
  draftState.errorResponseState = status;
  draftState.errorResponseData = data || undefined;
}));

serviceStatusReducer.on(Actions.resetState, (state) => produce(state, (draftState) => {
  draftState.fetchStatus = FetchStatusFlag.IDLE;
  draftState.errorResponseState = undefined;
  draftState.errorResponseData = undefined;
}));

serviceStatusReducer.on(Actions.loadMaintenanceData, (state) => produce(state, (draftState) => {
  draftState.fetchStatus = FetchStatusFlag.FETCHING;
}));
