import { createAction, createReducer } from 'redux-act';

import { ArticleContentJSON } from '@ridi/ridi-prosemirror-editor';
import { FetchStatusFlag } from 'app/constants';
import { AuthorResponse } from 'app/services/article/requests';
import { ArticleChannel } from 'app/services/articleChannel';
import { ArticleRequestQueries, DateDTO } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';

export const Actions = {
  loadArticleRequest: createAction<{
    channelName: string;
    contentIndex: number;
    requestQueries?: ArticleRequestQueries,
  }>('loadArticleDetailRequest'),
  loadArticleSuccess: createAction<{
    channelName: string;
    contentIndex: number;
    articleResponse: Article,
  }>('loadArticleDetailSuccess'),
  loadArticleFailure: createAction<{
    channelName: string;
    contentIndex: number;
  }>('loadArticleDetailFailure'),
  updateArticleTeaserContent: createAction<{
    channelName: string;
    contentIndex: number;
    teaserContent: ArticleContent,
  }>('updateArticleTeaserContent'),
  updateArticleContent: createAction<{
    channelName: string;
    contentIndex: number;
    content: ArticleContent,
  }>('updateArticleContent'),
  updateArticles: createAction<{
    articles: Article[],
  }>('updateArticles'),
  updateFavoriteArticleStatus: createAction<{
    channelName: string;
    contentIndex: number;
    isFavorite: boolean,
  }>('updateFavoriteArticleStatus'),
};

export interface ArticleContent {
  title: string;
  json: ArticleContentJSON;
}

export interface Article {
  id: number;
  title: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  channelId: number;
  contentId: number;
  url: string;
  thumbnailUrl: string;
  channel: ArticleChannel;
  authorId?: number;
  author?: AuthorResponse;
  isFavorite?: boolean;
}

export interface StaticArticleState {
  article?: Article;
  content?: ArticleContent;
  teaserContent?: ArticleContent;
  recommendedArticles?: Article[];
}

export interface ArticleItemState extends StaticArticleState {
  contentFetchStatus: FetchStatusFlag;
}

export interface ArticlesState {
  [contentKey: string]: ArticleItemState;
}

export const INITIAL_ARTICLE_STATE: ArticlesState = {};

export const articleReducer = createReducer<typeof INITIAL_ARTICLE_STATE>({}, INITIAL_ARTICLE_STATE);

articleReducer.on(Actions.loadArticleRequest, (state, action) => {
  const { channelName, contentIndex } = action;
  const contentKey = `@${channelName}/${contentIndex}`;

  return {
    ...state,
    [contentKey]: {
      ...state[contentKey],
      contentFetchStatus: FetchStatusFlag.FETCHING,
    },
  };
});

articleReducer.on(Actions.loadArticleSuccess, (state, action) => {
  const { channelName, contentIndex, articleResponse } = action;
  const contentKey = `@${channelName}/${contentIndex}`;

  return {
    ...state,
    [contentKey]: {
      ...state[contentKey],
      ...articleResponse,
      contentFetchStatus: FetchStatusFlag.IDLE,
    },
  };
});

articleReducer.on(Actions.loadArticleFailure, (state, action) => {
  const { channelName, contentIndex } = action;
  const contentKey = `@${channelName}/${contentIndex}`;

  return {
    ...state,
    [contentKey]: {
      ...state[contentKey],
      contentFetchStatus: FetchStatusFlag.FETCH_ERROR,
    },
  };
});

articleReducer.on(Actions.updateArticleContent, (state, action) => {
  const { channelName, contentIndex, content } = action;
  const contentKey = `@${channelName}/${contentIndex}`;

  return {
    ...state,
    [contentKey]: {
      ...state[contentKey],
      contentFetchStatus: FetchStatusFlag.IDLE,
      content,
    },
  };
});

articleReducer.on(Actions.updateArticleTeaserContent, (state, action) => {
  const { channelName, contentIndex, teaserContent } = action;
  const contentKey = `@${channelName}/${contentIndex}`;

  return {
    ...state,
    [contentKey]: {
      ...state[contentKey],
      contentFetchStatus: FetchStatusFlag.IDLE,
      teaserContent,
    },
  };
});

articleReducer.on(Actions.updateArticles, (state, action) => {
  const { articles = [] } = action;
  const newState: ArticlesState = articles.reduce((prev, article) => {
    const contentKey = getArticleKeyFromData(article);
    prev[contentKey] = {
      ...state[contentKey],
      article: !!state[contentKey] ? { ...state[contentKey].article, ...article } : article,
    };
    return prev;
  }, state);
  return newState;
});

articleReducer.on(Actions.updateFavoriteArticleStatus, (state, action) => {
  const { channelName, contentIndex, isFavorite } = action;
  const contentKey = `@${channelName}/${contentIndex}`;
  return {
    ...state,
    [contentKey]: {
      ...state[contentKey],
      article: {
        ...state[contentKey].article!,
        isFavorite,
      },
    },
  };
});
