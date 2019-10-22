import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Actions } from 'app/services/article';
import { ArticleResponse, requestArticleWithId } from 'app/services/article/requests';

export function* loadArticle({ payload }: ReturnType<typeof Actions.loadArticleRequest>) {
  const { articleId, includeData } = payload;
  try {
    const articleResponse: ArticleResponse = yield call(requestArticleWithId, articleId, includeData);
    yield put(Actions.loadArticleSuccess({
      articleId,
      articleResponse,
    }));
  } catch (error) {
    yield put(Actions.loadArticleFailure({
      articleId,
    }));
  }
}

export function* watchLoadArticle() {
  yield takeLatest(Actions.loadArticleRequest.getType(), loadArticle);
}

export function* articleRootSaga() {
  yield all([
    watchLoadArticle(),
  ]);
}
