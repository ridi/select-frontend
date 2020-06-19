import { createAction, createReducer } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { BigBanner } from 'app/services/home/states';
import { isRidiselectUrl } from 'app/utils/regexHelper';

export const Actions = {
  loadArticleBannerRequest: createAction('loadArticleBannerRequest'),
  loadArticleBannerSuccess: createAction<{
    fetchedAt: number;
    response: BigBanner[];
    isIosInApp: boolean;
  }>('loadArticleBannerSuccess'),
  loadArticleBannerFailure: createAction('loadArticleBannerFailure'),
  updateBannerIndex: createAction<{
    currentIdx: number;
  }>('updateBannerIndex'),
};

export interface ArticleHomeState {
  fetchStatus: FetchStatusFlag;
  fetchedAt: number | null;
  currentIdx: number;
  bigBannerList: BigBanner[];
}

export const INITIAL_ARTICLE_HOME_STATE: ArticleHomeState = {
  fetchStatus: FetchStatusFlag.IDLE,
  fetchedAt: null,
  currentIdx: 0,
  bigBannerList: [],
};

export const articleHomeReducer = createReducer<ArticleHomeState>({}, INITIAL_ARTICLE_HOME_STATE);

articleHomeReducer.on(Actions.loadArticleBannerRequest, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

articleHomeReducer.on(Actions.loadArticleBannerSuccess, (state, action) => {
  const { response, fetchedAt, isIosInApp } = action;

  return {
    ...state,
    bigBannerList: isIosInApp
      ? response.filter(banner => isRidiselectUrl(banner.linkUrl))
      : response,
    fetchedAt,
    fetchStatus: FetchStatusFlag.IDLE,
  };
});

articleHomeReducer.on(Actions.loadArticleBannerFailure, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

articleHomeReducer.on(Actions.updateBannerIndex, (state, action) => {
  const { currentIdx } = action;
  return {
    ...state,
    currentIdx,
  };
});
