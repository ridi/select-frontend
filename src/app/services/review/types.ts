import { Action as ReduxAction } from 'redux';

import { FetchStatusFlag } from 'app/constants';

export interface Action<T extends string, P = undefined> extends ReduxAction {
  type: T;
  payload: P;
}

export interface Page<Item> {
  fetchStatus: FetchStatusFlag;
  itemList: Item[];
}

export interface Paginated<Item> {
  pageCount: number;
  itemCount: number;
  currentPage: number;
  size: number;
  itemListByPage: {
    [pageNumber: number]: Page<Item>;
  };
}
