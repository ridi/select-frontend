import { ErrorStatus } from 'app/constants/index';
import { Actions } from 'app/services/articleHome';
import { ArticleHomeResponse, requestArticleHome } from 'app/services/articleHome/requests';
import { getIsIosInApp } from 'app/services/environment/selectors';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, select, takeLeading } from 'redux-saga/effects';

function* loadArticleHome() {
  try {
    const response: ArticleHomeResponse = yield call(requestArticleHome);
    const isIosInApp = yield select(getIsIosInApp);

    yield put(Actions.loadArticleHomeSuccess({
      response,
      fetchedAt: Date.now(),
      isIosInApp,
    }));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadArticleHomeFailure());
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchLoadArticleHome() {
  yield takeLeading(Actions.loadArticleHomeRequest.getType(), loadArticleHome);
}

export function* articleHomeRootSaga() {
  yield all([
    watchLoadArticleHome(),
  ]);
}
