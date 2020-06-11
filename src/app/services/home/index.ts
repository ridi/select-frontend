import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';

import { FetchStatusFlag } from 'app/constants';
import { ReservedCollectionIds } from 'app/services/collection';

export interface BigBanner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export type FetchedAt = number | null;
export type CollectionId = number | ReservedCollectionIds;
export interface HomeResponse {
  fetchedAt: FetchedAt;
  bigBannerList: BigBanner[];
  collectionIdList: CollectionId[];
}

export interface HomeState extends HomeResponse {
  fetchStatus: FetchStatusFlag;
  currentIdx: number;
}

export const INITIAL_HOME_STATE: HomeState = {
  fetchedAt: null,
  fetchStatus: FetchStatusFlag.IDLE,
  currentIdx: 0,
  bigBannerList: [],
  collectionIdList: [],
};

class HomeReducer extends ImmerReducer<HomeState> {
  loadHomeRequest() {
    this.draftState.fetchStatus = FetchStatusFlag.FETCHING;
  }

  loadHomeSuccess(homeResponse: HomeResponse) {
    this.draftState = {
      ...this.draftState,
      ...homeResponse,
      fetchStatus: FetchStatusFlag.IDLE,
    };
  }

  loadHomeFailure() {
    this.draftState.fetchStatus = FetchStatusFlag.FETCH_ERROR;
  }

  updateBannerIndex({ currentIdx }: { currentIdx: number }) {
    this.draftState.currentIdx = currentIdx;
  }
}

export const homeActions = createActionCreators(HomeReducer);
export const homeReducer = createReducerFunction(HomeReducer, INITIAL_HOME_STATE);
