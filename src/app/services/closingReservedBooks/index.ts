import { AxiosError } from 'axios';
import { createAction, createReducer } from 'redux-act';

import { FetchErrorFlag, FetchStatusFlag } from 'app/constants';
import { Book } from 'app/services/book';
import {
  ClosingReservedBooksResponse,
  closingReservedTermType,
} from 'app/services/closingReservedBooks/requests';
import { Paginated } from 'app/types';
import { responseCommentsToCommentIdListByPage } from '../review/reducer.helpers';

export type ClosingReservedBooksTermState = Paginated<Book>
export interface ClosingReservedBooksState {
  [termType: string]: ClosingReservedBooksTermState;
}

export const Actions = {
  loadClosingReservedBooksRequest: createAction<{
    termType: closingReservedTermType,
    page: number,
  }>('loadClosingReservedBooksRequest'),
  loadClosingReservedBooksSuccess: createAction<{
    termType: closingReservedTermType,
    page: number,
    response: ClosingReservedBooksResponse,
  }>('loadClosingReservedBooksSuccess'),
  loadClosingReservedBooksFailure: createAction<{
    termType: closingReservedTermType,
    page: number,
    error: AxiosError,
  }>('loadClosingReservedBooksFailure'),
};

export const INITIAL_STATE: ClosingReservedBooksState = {
  thisMonth: {
    itemListByPage: {},
  },
  nextMonth: {
    itemListByPage: {},
  },
};

export const closingReservedBooksReducer = createReducer<ClosingReservedBooksState>({}, INITIAL_STATE);

closingReservedBooksReducer.on(Actions.loadClosingReservedBooksRequest, (state = INITIAL_STATE, { termType, page }) => ({
  ...state,
  [termType]: {
    ...state[termType],
    itemCount: 0,
    itemListByPage: {
      ...(state[termType] && state[termType].itemListByPage),
      [page]: {
        fetchStatus: FetchStatusFlag.FETCHING,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));

closingReservedBooksReducer.on(Actions.loadClosingReservedBooksSuccess, (state = INITIAL_STATE, { termType, page, response }) => ({
  ...state,
  [termType]: {
    ...state[termType],
    itemCount: response.totalCount,
    itemListByPage: {
      ...state[termType].itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: response.books,
        isFetched: true,
      },
    },
  },
}));

closingReservedBooksReducer.on(Actions.loadClosingReservedBooksFailure, (state = INITIAL_STATE, { termType, page }) => ({
  ...state,
  [termType]: {
    ...state[termType],
    itemListByPage: {
      ...state[termType].itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));
