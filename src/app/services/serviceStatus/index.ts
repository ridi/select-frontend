import produce from 'immer';
import { createAction, createReducer } from 'redux-act';

export type ErrorResponseStatus = number;
export interface ErrorResponseData {
  period: string;
  status: string;
  unavailableService: string[];
}

export const Actions = {
  setState: createAction<{
    status: ErrorResponseStatus,
    data?: ErrorResponseData,
  }>('setState'),
  resetState: createAction('resetState'),
};

export interface ServiceStatusState {
  errorResponseState?: ErrorResponseStatus;
  errorResponseData?: ErrorResponseData;
}

export const serviceStatusReducer = createReducer<ServiceStatusState>({}, {});

serviceStatusReducer.on(Actions.setState, (state, { status, data }) => produce(state, (draftState) => {
  draftState.errorResponseState = status;
  draftState.errorResponseData = data || undefined;
}));

serviceStatusReducer.on(Actions.resetState, (state) => produce(state, (draftState) => {
  draftState.errorResponseState = undefined;
  draftState.errorResponseData = undefined;
}));
