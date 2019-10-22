import { createAction, createReducer } from 'redux-act';

import { ArticleContentJSON } from '@ridi/ridi-prosemirror-editor';
import { FetchStatusFlag } from 'app/constants';
import { AuthorResponse } from 'app/services/article/requests';
import { ArticleRequestIncludableData, DateDTO } from 'app/types';

export const Actions = {
  loadArticleRequest: createAction<{
    articleId: number,
    includeData?: ArticleRequestIncludableData[],
  }>('loadArticleDetailRequest'),
  loadArticleSuccess: createAction<{
    articleId: number,
    articleResponse: ArticleStaticState,
  }>('loadArticleDetailSuccess'),
  loadArticleFailure: createAction<{
    articleId: number,
  }>('loadArticleDetailFailure'),
  updateArticleTeaserContent: createAction<{
    articleId: number,
    teaserContent: ArticleContent,
  }>('updateArticleTeaserContent'),
  updateArticleContent: createAction<{
    articleId: number,
    content: ArticleContent,
  }>('updateArticleContent'),
};

export interface ArticleContent {
  title: string;
  json: ArticleContentJSON;
}

export interface ArticleStaticState {
  id: number;
  title: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  channelId: number;
  thumbnailUrl: string;
  authorId: number;
  author?: AuthorResponse;
}

export interface ArticleItemState extends ArticleStaticState {
  recommendedArticles?: number[];
  contentFetchStatus: FetchStatusFlag;
  content?: ArticleContent;
  teaserContent?: ArticleContent;
}

export interface ArticlesState {
  [articleId: number]: ArticleItemState;
}

export const INITIAL_ARTICLE_STATE: ArticlesState = {};

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
      ...articleResponse,
      contentFetchStatus: FetchStatusFlag.IDLE,
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

articleReducer.on(Actions.updateArticleContent, (state, action) => {
  const { articleId, content } = action;

  return {
    ...state,
    [articleId]: {
      ...state[articleId],
      contentFetchStatus: FetchStatusFlag.IDLE,
      content,
    },
  };
});

articleReducer.on(Actions.updateArticleTeaserContent, (state, action) => {
  const { articleId, teaserContent } = action;

  return {
    ...state,
    [articleId]: {
      ...state[articleId],
      contentFetchStatus: FetchStatusFlag.IDLE,
      teaserContent,
    },
  };
});
