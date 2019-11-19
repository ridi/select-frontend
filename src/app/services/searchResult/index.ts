import { AxiosError } from 'axios';
import { createAction, createReducer } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { Article } from 'app/services/article';
import { Book } from 'app/services/book';
import { SearchResultResponse } from 'app/services/searchResult/requests';
import { BookId, Paginated } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';

export const Actions = {
  queryKeywordRequest: createAction<{
    keyword: string,
    page: number,
    type: string,
  }>('queryKeywordRequest'),
  queryKeywordSuccess: createAction<{
    keyword: string,
    page: number,
    type: string,
    response: SearchResultResponse,
  }>('queryKeywordSuccess'),
  queryKeywordFailure: createAction<{
    keyword: string,
    page: number,
    type: string,
    error: AxiosError,
  }>('queryKeywordFailure'),
};

export interface SearchResultHighlight {
  webTitleTitle?: string;
  title?: string;
  subTitle?: string;
  author?: string;
  translator?: string;
  publisher?: string;
  channelDisplayName?: string;
}

export interface SearchResultItem {
  bookId: BookId;
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  };
}
export interface ArticleSearchResultItem {
  contentKey: string;
  highlight: SearchResultHighlight;
}

export interface SearchResultBook extends Book {
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  };
}
export interface SearchResultArticle extends Article {
  highlight: SearchResultHighlight;
}

export interface KeywordSearchResult extends Paginated<SearchResultItem> {}
export interface ArticleKeywordSearchResult extends Paginated<ArticleSearchResultItem> {}

export interface SearchResultState {
  books: {
    [keyword: string]: KeywordSearchResult;
  };
  articles: {
    [keyword: string]: ArticleKeywordSearchResult;
  };
}

export const INITIAL_STATE: SearchResultState = {
  books: {},
  articles: {},
};

export const searchResultReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);
searchResultReducer.on(Actions.queryKeywordRequest, (state, action) => {
  const { page, keyword, type } = action;
  const searchType = type === 'book' ? 'books' : 'articles';
  return {
    ...state,
    [searchType]: {
      ...state[searchType],
      [keyword]: {
        ...state[searchType][keyword],
        itemCount: state[searchType][keyword] ? state[searchType][keyword].itemCount : undefined,
        itemListByPage: {
          ...(state[searchType][keyword] && state[searchType][keyword].itemListByPage),
          [page]: {
            fetchStatus: FetchStatusFlag.FETCHING,
            itemList: [],
            isFetched: false,
          },
        },
      },
    },
  };
});

searchResultReducer.on(Actions.queryKeywordSuccess, (state, action) => {
  const { keyword, response, page, type } = action;
  const searchType = type === 'book' ? 'books' : 'articles';
  return {
    ...state,
    [searchType]: {
      ...state[searchType],
      [keyword]: {
        ...state[searchType][keyword],
        itemListByPage: {
          ...state[searchType][keyword].itemListByPage,
          [page]: {
            fetchStatus: FetchStatusFlag.IDLE,
            itemList: searchType === 'books' ? response.books!.map((book: SearchResultBook) => ({
              bookId: book.id,
              highlight: book.highlight,
              publisher: book.publisher,
            })) : response.articles!.map((article: SearchResultArticle) => ({
              contentKey: getArticleKeyFromData(article),
              highlight: article.highlight,
            })),
            isFetched: true,
          },
        },
        itemCount: response.totalCount,
      },
    },
  };
});

searchResultReducer.on(Actions.queryKeywordFailure, (state, action) => {
  const { keyword, page, type } = action;
  const searchType = type === 'book' ? 'books' : 'articles';
  return {
    ...state,
    [searchType]: {
      ...state[searchType],
      [keyword]: {
        ...state[searchType][keyword],
        itemListByPage: {
          ...state[searchType][keyword].itemListByPage,
          [page]: {
            fetchStatus: FetchStatusFlag.FETCH_ERROR,
            itemList: [],
            isFetched: true,
          },
        },
      },
    },
  };
});
