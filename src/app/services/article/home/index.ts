import { FetchStatusFlag } from 'app/constants';
import { BigBanner } from 'app/services/home';
import { isRidiselectUrl } from 'app/utils/regexHelper';
import { createAction, createReducer } from 'redux-act';
import { ArticleHomeResponse } from './requests';

export const Actions = {
  loadArticleHomeRequest: createAction('loadArticleHomeRequest'),
  loadArticleHomeSuccess: createAction<{
    response: ArticleHomeResponse,
    fetchedAt: number,
    isIosInApp: boolean,
  }>('loadArticleHomeSuccess'),
  loadArticleHomeFailure: createAction('loadArticleHomeFailure'),
};

export enum ArticleSectionType {
  'CHART' = 'CHART',
  'LIST' = 'LIST',
}

export interface ArticleHomeState {
  fetchedAt: number | null;
  fetchStatus: FetchStatusFlag;
  bigBannerList: BigBanner[];
  collectionIdList: number[];
}

export const INITIAL_ARTICLE_HOME_STATE: ArticleHomeState = {
  fetchedAt: null,
  fetchStatus: FetchStatusFlag.IDLE,
  bigBannerList: [],
  collectionIdList: [],
};

export const articleHomeReducer = createReducer<typeof INITIAL_ARTICLE_HOME_STATE>({}, INITIAL_ARTICLE_HOME_STATE);

articleHomeReducer.on(Actions.loadArticleHomeRequest, (state) => {
  return {
    ...state,
    fetchStatus: FetchStatusFlag.FETCHING,
  };
});

articleHomeReducer.on(Actions.loadArticleHomeSuccess, (state, action) => {
  const { response, fetchedAt, isIosInApp } = action;

  return {
    ...state,
    fetchedAt,
    bigBannerList: isIosInApp ?
      response.bigBanners
        .filter((bigBanner) => isRidiselectUrl(bigBanner.linkUrl)) :
      response.bigBanners,
    collectionIdList: response.collections.map((collection) => collection.collectionId),
    fetchStatus: FetchStatusFlag.IDLE,
  };
});

articleHomeReducer.on(Actions.loadArticleHomeFailure, (state) => {
  return {
    ...state,
    fetchStatus: FetchStatusFlag.FETCH_ERROR,
  };
});
