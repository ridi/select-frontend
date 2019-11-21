import { FetchStatusFlag } from 'app/constants';
import { BigBanner } from 'app/services/home';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadArticleBannerRequest: createAction('loadArticleBannerRequest'),
  loadArticleBannerSuccess: createAction<{
    fetchedAt: number,
    response: BigBanner[],
  }>('loadArticleBannerSuccess'),
  loadArticleBannerFailure: createAction('loadArticleBannerFailure'),
  loadArticleHomeSectionListRequest: createAction<{
    targetSection: ArticleHomeSectionType,
  }>('loadArticleHomeSectionListRequest'),
  loadArticleHomeSectionListSuccess: createAction<{
    targetSection: ArticleHomeSectionType,
    articles: string[],
  }>('loadArticleHomeSectionListSuccess'),
  loadArticleHomeSectionListFailure: createAction<{
    targetSection: ArticleHomeSectionType,
  }>('loadArticleHomeSectionListFailure'),
};

export enum ArticleSectionType {
  'CHART' = 'CHART',
  'LIST' = 'LIST',
}

export enum ArticleHomeSectionType {
  RECENT = 'recentArticleList',
  POPULAR = 'popularArticleList',
  RECOMMEND = 'recommendArticleList',
}

interface ArticleHomeSectionList {
  fetchStatus: FetchStatusFlag;
  articles?: number[];
}

export interface ArticleHomeState {
  fetchStatus: FetchStatusFlag;
  fetchedAt: number | null;
  bigBannerList: BigBanner[];
  recentArticleList: ArticleHomeSectionList;
  popularArticleList: ArticleHomeSectionList;
  recommendArticleList: ArticleHomeSectionList;
}

export const INITIAL_ARTICLE_HOME_STATE: ArticleHomeState = {
  fetchStatus: FetchStatusFlag.IDLE,
  fetchedAt: null,
  bigBannerList: [],
  recentArticleList: {
    fetchStatus: FetchStatusFlag.IDLE,
  },
  popularArticleList: {
    fetchStatus: FetchStatusFlag.IDLE,
  },
  recommendArticleList: {
    fetchStatus: FetchStatusFlag.IDLE,
  },
};

export const articleHomeReducer = createReducer<ArticleHomeState>({}, INITIAL_ARTICLE_HOME_STATE);

articleHomeReducer.on(Actions.loadArticleHomeSectionListRequest, (state = INITIAL_ARTICLE_HOME_STATE, action) => {
  const { targetSection } = action;

  return {
    ...state,
    [targetSection]: {
      ...state[targetSection],
      fetchStatus: FetchStatusFlag.FETCHING,
    },
  };
});

articleHomeReducer.on(Actions.loadArticleHomeSectionListSuccess, (state = INITIAL_ARTICLE_HOME_STATE, action) => {
  const { articles, targetSection } = action;

  return {
    ...state,
    [targetSection]: {
      ...state[targetSection],
      fetchStatus: FetchStatusFlag.IDLE,
      articles,
    },
  };
});

articleHomeReducer.on(Actions.loadArticleHomeSectionListFailure, (state = INITIAL_ARTICLE_HOME_STATE, action) => {
  const { targetSection } = action;

  return {
    ...state,
    [targetSection]: {
      ...state[targetSection],
      fetchStatus: FetchStatusFlag.FETCH_ERROR,
    },
  };
});

articleHomeReducer.on(Actions.loadArticleBannerRequest, (state) => {
  return {
    ...state,
    fetchStatus: FetchStatusFlag.FETCHING,
  };
});

articleHomeReducer.on(Actions.loadArticleBannerSuccess, (state, action) => {
  const { response, fetchedAt } = action;

  return {
    ...state,
    bigBannerList: response,
    fetchedAt,
    fetchStatus: FetchStatusFlag.IDLE,
  };
});

articleHomeReducer.on(Actions.loadArticleBannerFailure, (state) => {
  return {
    ...state,
    fetchStatus: FetchStatusFlag.FETCH_ERROR,
  };
});
