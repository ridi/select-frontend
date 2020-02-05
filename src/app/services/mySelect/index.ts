import { AxiosError } from 'axios';
import { produce } from 'immer';
import { createAction, createReducer } from 'redux-act';

import { FetchErrorFlag, FetchStatusFlag } from 'app/constants';
import { Book } from 'app/services/book';
import {
  BookIdsPair,
  MySelectListResponse,
  UserRidiSelectBookResponse,
} from 'app/services/mySelect/requests';
import { BookId, Paginated } from 'app/types';

export const Actions = {
  loadMySelectRequest: createAction<{
    page: number;
  }>('loadMySelectRequest'),
  loadMySelectSuccess: createAction<{
    response: MySelectListResponse;
    page: number;
  }>('loadMySelectSuccess'),
  loadMySelectFailure: createAction<{
    page: number;
    error: AxiosError;
  }>('loadMySelectFailure'),
  deleteMySelectRequest: createAction<{
    page: number;
    deleteBookIdPairs: BookIdsPair[];
    isEveryBookChecked: boolean;
  }>('deleteMySelectRequest'),
  deleteMySelectSuccess: createAction<{
    deleteBookIdPairs: BookIdsPair[];
  }>('deleteMySelectSuccess'),
  deleteMySelectFailure: createAction('deleteMySelectFailure'),
  addMySelectRequest: createAction<{
    bookId: BookId;
  }>('addMySelectRequest'),
  addMySelectSuccess: createAction<{
    userRidiSelectResponse: UserRidiSelectBookResponse;
  }>('addMySelectSuccess'),
  addMySelectFailure: createAction('addMySelectFailure'),
  resetMySelectPageFetchedStatus: createAction<{
    page: number;
  }>('resetMySelectPageFetchedStatus'),
};

export interface MySelectBook extends Book {
  mySelectBookId: number;
  startDate: string;
  endDate: string;
  expire?: string;
}

export interface PaginatedMySelectBooks extends Paginated<MySelectBook> {
  size: number;
}

export interface MySelectState {
  deletionFetchStatus: FetchStatusFlag;
  additionFetchStatus: FetchStatusFlag;
  replacementFetchStatus: FetchStatusFlag;
  mySelectBooks: PaginatedMySelectBooks;
  isReSubscribed: boolean;
}

export const INITIAL_MYSELECT_STATE: MySelectState = {
  deletionFetchStatus: FetchStatusFlag.IDLE,
  additionFetchStatus: FetchStatusFlag.IDLE,
  replacementFetchStatus: FetchStatusFlag.IDLE,
  mySelectBooks: {
    itemListByPage: {},
    size: 0,
  },
  isReSubscribed: false,
};

export const userRidiSelectBookToMySelectBook = (
  userRidiSelectbook: UserRidiSelectBookResponse,
): MySelectBook => ({
  ...userRidiSelectbook.book,
  startDate: userRidiSelectbook.startDate,
  endDate: userRidiSelectbook.endDate,
  mySelectBookId: userRidiSelectbook.id,
  expire: userRidiSelectbook.expire,
});

export const mySelectReducer = createReducer<MySelectState>({}, INITIAL_MYSELECT_STATE);

mySelectReducer.on(Actions.loadMySelectRequest, (state, { page }) =>
  produce(state, draftState => {
    draftState.mySelectBooks.itemListByPage[page] = {
      ...draftState.mySelectBooks.itemListByPage[page],
      fetchStatus: FetchStatusFlag.FETCHING,
    };
  }),
);

mySelectReducer.on(Actions.loadMySelectSuccess, (state, { response, page }) =>
  produce(state, draftState => {
    draftState.isReSubscribed = response.reSubscribed;
    draftState.mySelectBooks.itemCount = response.totalCount;
    draftState.mySelectBooks.size = response.size;
    draftState.mySelectBooks.itemListByPage[page].fetchStatus = FetchStatusFlag.IDLE;
    draftState.mySelectBooks.itemListByPage[page].itemList = response.userRidiSelectBooks.map(
      userRidiSelectBookToMySelectBook,
    );
    draftState.mySelectBooks.itemListByPage[page].isFetched = true;
  }),
);

mySelectReducer.on(Actions.loadMySelectFailure, (state, { page }) =>
  produce(state, draftState => {
    draftState.mySelectBooks.itemListByPage[page].fetchStatus = FetchStatusFlag.FETCH_ERROR;
  }),
);

mySelectReducer.on(Actions.deleteMySelectRequest, state =>
  produce(state, draftState => {
    draftState.deletionFetchStatus = FetchStatusFlag.FETCHING;
  }),
);

mySelectReducer.on(Actions.deleteMySelectSuccess, state =>
  produce(state, draftState => {
    draftState.deletionFetchStatus = FetchStatusFlag.IDLE;
  }),
);

mySelectReducer.on(Actions.deleteMySelectFailure, state =>
  produce(state, draftState => {
    draftState.deletionFetchStatus = FetchStatusFlag.FETCH_ERROR;
  }),
);

mySelectReducer.on(Actions.addMySelectRequest, state =>
  produce(state, draftState => {
    draftState.additionFetchStatus = FetchStatusFlag.FETCHING;
  }),
);

mySelectReducer.on(Actions.addMySelectSuccess, state =>
  produce(state, draftState => {
    draftState.additionFetchStatus = FetchStatusFlag.IDLE;
  }),
);

mySelectReducer.on(Actions.addMySelectFailure, state =>
  produce(state, draftState => {
    draftState.additionFetchStatus = FetchStatusFlag.FETCH_ERROR;
  }),
);

mySelectReducer.on(Actions.resetMySelectPageFetchedStatus, (state, { page }) =>
  produce(state, draftState => {
    draftState.mySelectBooks.itemListByPage[page].isFetched = false;
  }),
);
