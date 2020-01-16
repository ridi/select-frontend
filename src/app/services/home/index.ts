import { FetchStatusFlag } from 'app/constants';
import { isRidiselectUrl } from 'app/utils/regexHelper';
import { createAction, createReducer } from 'redux-act';
import { HomeResponse } from './requests';

export const Actions = {
  loadHomeRequest: createAction('loadHomeRequest'),
  loadHomeSuccess: createAction<{
    response: HomeResponse,
    fetchedAt: number,
    isIosInApp: boolean,
  }>('loadHomeSuccess'),
  loadHomeFailure: createAction('loadHomeFailure'),
  updateBannerIndex: createAction<{
    currentIdx: number,
  }>('updateBannerIndex'),
};

export enum CollectionType {
  'SELECTION' = 'SELECTION',
  'CHART' = 'CHART',
  'SPOTLIGHT' = 'SPOTLIGHT',
}

export interface BigBanner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export interface HomeState {
  fetchedAt: number | null;
  fetchStatus: FetchStatusFlag;
  currentIdx: number;
  bigBannerList: BigBanner[];
  collectionIdList: number[];
}

export const INITIAL_HOME_STATE: HomeState = {
  fetchedAt: null,
  fetchStatus: FetchStatusFlag.IDLE,
  currentIdx: 0,
  bigBannerList: [],
  collectionIdList: [],
};

export const homeReducer = createReducer<typeof INITIAL_HOME_STATE>({}, INITIAL_HOME_STATE);

homeReducer.on(Actions.loadHomeRequest, (state, action) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

homeReducer.on(Actions.loadHomeSuccess, (state, action) => {
  const { response, fetchedAt, isIosInApp } = action;

  return {
    ...state,
    fetchedAt,
    bigBannerList: isIosInApp
      ? response.banners.filter((banner) => isRidiselectUrl(banner.linkUrl))
      : response.banners,
    collectionIdList: response.collections.map((collection) => collection.collectionId),
    fetchStatus: FetchStatusFlag.IDLE,
  };
});

homeReducer.on(Actions.loadHomeFailure, (state, action) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

homeReducer.on(Actions.updateBannerIndex, (state, action) => {
  const { currentIdx } = action;
  return {
    ...state,
    currentIdx, 
  };
});
