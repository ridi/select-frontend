import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';

import { FetchStatusFlag } from 'app/constants';

import { HomeState, HomeResponse, INITIAL_HOME_STATE } from './states';

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
