import { FetchStatusFlag } from 'app/constants';
import { Article } from 'app/services/article';
import { FavoriteArticleListResponse } from 'app/services/articleFavorite/requests';
import { ArticleKey, Paginated } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';
import { Method } from 'axios';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadFavoriteArticleListRequest : createAction<{
    page: number,
  }>('loadArticleChannelListRequest'),
  loadFavoriteArticleListSuccess : createAction<{
    page: number,
    response: FavoriteArticleListResponse,
  }>('loadFavoriteArticleListSuccess'),
  loadFavoriteArticleListFailure : createAction<{
    page: number,
  }>('loadFavoriteArticleListFailure'),
  favoriteArticleActionRequest: createAction<FavoriteArticleAction>('favoriteArticleActionRequest'),
};

interface FavoriteArticleAction {
  articleId: number;
  method: Method;
}

export interface FavoriteArticle {
  id: number;
  articleId: number;
  article: Article;
}

export interface FavoriteArticleListState extends Paginated<ArticleKey> {}

export const INITIAL_STATE: FavoriteArticleListState = {
  itemListByPage: {},
};
export const favoriteArticleListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

favoriteArticleListReducer.on(Actions.loadFavoriteArticleListRequest, (state, action) => {
  const { page } = action;
  return {
    ...state,
    itemListByPage: {
      ...state.itemListByPage,
      [page]: {
        ...state.itemListByPage[page],
        fetchStatus: FetchStatusFlag.FETCHING,
        isFetched: false,
      },
    },
  };
});

favoriteArticleListReducer.on(Actions.loadFavoriteArticleListSuccess, (state, action) => {
  const { page, response } = action;
  return {
    ...state,
    itemListByPage: {
      ...state.itemListByPage,
      itemCount: response.totalCount,
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: response.results.map((data) => getArticleKeyFromData(data.article)),
        isFetched: true,
      },
    },
  };
});

favoriteArticleListReducer.on(Actions.loadFavoriteArticleListFailure, (state, action) => {
  const { page } = action;
  return {
    ...state,
    itemListByPage: {
      ...state.itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        itemList: [],
        isFetched: false,
      },
    },
  };
});
