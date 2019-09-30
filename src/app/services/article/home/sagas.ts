import { ErrorStatus } from 'app/constants/index';
import { Actions } from 'app/services/article/home';
import { ArticleHomeResponse, requestArticleHome } from 'app/services/article/home/requests';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, select, take } from 'redux-saga/effects';

export function* watchLoadArticleHome() {
  while (true) {
    yield take(Actions.loadArticleHomeRequest.getType());
    try {
      const response: ArticleHomeResponse = yield call(requestArticleHome);
      const state: RidiSelectState = yield select((s) => s);

      yield put(Actions.loadArticleHomeSuccess({
        response,
        fetchedAt: Date.now(),
        isIosInApp: getIsIosInApp(state),
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
}

export function* articleHomeRootSaga() {
  yield all([
    watchLoadArticleHome(),
  ]);
}
