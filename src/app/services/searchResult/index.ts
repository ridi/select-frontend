import { createAction, createReducer } from 'redux-act';

import { FetchErrorFlag, FetchStatusFlag } from 'app/constants';
import { Book } from 'app/services/book';
import { SearchResultReponse } from 'app/services/searchResult/requests';
import { BookId, Paginated } from 'app/types';
import { AxiosError } from 'axios';

export const Actions = {
  queryKeywordRequest: createAction<{
    keyword: string,
    page: number,
  }>('queryKeywordRequest'),
  queryKeywordSuccess: createAction<{
    keyword: string,
    page: number,
    response: SearchResultReponse,
  }>('queryKeywordSuccess'),
  queryKeywordFailure: createAction<{
    keyword: string,
    page: number,
    error: AxiosError & FetchErrorFlag,
  }>('queryKeywordFailure'),
};

export interface SearchResultHighlight {
  title?: string;
  subTitle?: string;
  author?: string;
  translator?: string;
  publisher?: string;
}

export interface SearchResultItem {
  bookId: BookId;
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  };
}

export interface SearchResultBook extends Book {
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  };
}

export interface KeywordSearchResult extends Paginated<SearchResultItem> {}

export interface SearchResultState {
  [keyword: string]: KeywordSearchResult;
}

export const INITIAL_STATE: SearchResultState = {};

export const searchResultReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);
searchResultReducer.on(Actions.queryKeywordRequest, (state, action) => {
  const { page, keyword } = action;
  return {
    ...state,
    [keyword]: {
      ...state[keyword],
      itemCount: state[keyword] ? state[keyword].itemCount : undefined,
      itemListByPage: {
        ...(state[keyword] && state[keyword].itemListByPage),
        [page]: {
          fetchStatus: FetchStatusFlag.FETCHING,
          itemList: [],
          isFetched: false,
        },
      },
    },
  };
});
searchResultReducer.on(Actions.queryKeywordSuccess, (state, action) => {
  const { keyword, response, page } = action;
  return {
    ...state,
    [keyword]: {
      ...state[keyword],
      itemListByPage: {
        ...state[keyword].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.IDLE,
          itemList: response.books.map((book: SearchResultBook) => ({
            bookId: book.id,
            highlight: book.highlight,
            publisher: book.publisher,
          })),
          isFetched: true,
        },
      },
      itemCount: response.totalCount,
    },
  };
});
searchResultReducer.on(Actions.queryKeywordFailure, (state, action) => {
  const { keyword, page } = action;
  return {
    ...state,
    [keyword]: {
      ...state[keyword],
      itemListByPage: {
        ...state[keyword].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.FETCH_ERROR,
          itemList: [],
          isFetched: true,
        },
      },
    },
  };
});
