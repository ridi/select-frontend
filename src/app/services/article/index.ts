import { createAction, createReducer } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/request';
import { ArticleRequestIncludableData } from 'app/types';

export const Actions = {
  loadArticleRequest: createAction<{
    articleId: number,
    includeData?: ArticleRequestIncludableData[],
  }>('loadArticleDetailRequest'),
  loadArticleSuccess: createAction<{
    articleId: number,
    articleResponse: ArticleResponse,
  }>('loadArticleDetailSuccess'),
  loadArticleFailure: createAction<{
    articleId: number,
  }>('loadArticleDetailFailure'),
};

export interface ArticleStateItem {
  article?: ArticleResponse;
  recommendedArticle?: ArticleResponse[];
  contentFetchStatus: FetchStatusFlag;
}

export interface ArticleState {
  [articleId: number]: ArticleStateItem;
}

export const INITIAL_ARTICLE_STATE: ArticleState = {};

export const articleReducer = createReducer<typeof INITIAL_ARTICLE_STATE>({}, INITIAL_ARTICLE_STATE);

articleReducer.on(Actions.loadArticleRequest, (state, action) => {
  const { articleId } = action;

  return {
    ...state,
    [articleId]: {
      ...state[articleId],
      contentFetchStatus: FetchStatusFlag.FETCHING,
    },
  };
});

articleReducer.on(Actions.loadArticleSuccess, (state, action) => {
  const { articleId, articleResponse } = action;

  return {
    ...state,
    [articleId]: {
      ...state[articleId],
      contentFetchStatus: FetchStatusFlag.IDLE,
      article: {
        ...state[articleId].article,
        ...articleResponse,
      },
    },
  };
});

articleReducer.on(Actions.loadArticleFailure, (state, action) => {
  const { articleId } = action;

  return {
    ...state,
    [articleId]: {
      ...state[articleId],
      contentFetchStatus: FetchStatusFlag.FETCH_ERROR,
    },
  };
});
