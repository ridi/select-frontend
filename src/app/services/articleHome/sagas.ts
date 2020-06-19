import { all, call, put, select, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { Actions } from 'app/services/articleHome';
import { BigBanner } from 'app/services/home/states';
import { requestBanner } from 'app/services/home/requests';
import showMessageForRequestError from 'app/utils/toastHelper';

import { getIsIosInApp } from '../environment/selectors';

function* loadArticleBanner() {
  try {
    const response: BigBanner[] = yield call(requestBanner, 'article');
    const isIosInApp: boolean = yield select(s => getIsIosInApp(s));

    yield put(
      Actions.loadArticleBannerSuccess({
        response,
        fetchedAt: Date.now(),
        isIosInApp,
      }),
    );
  } catch (e) {
    yield put(Actions.loadArticleBannerFailure());
    if (e && e.response && e.response.data && e.response.data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchLoadArticleBanner() {
  yield takeLeading(Actions.loadArticleBannerRequest.getType(), loadArticleBanner);
}

export function* articleHomeRootSaga() {
  yield all([watchLoadArticleBanner()]);
}
