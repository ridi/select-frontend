import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Actions } from 'app/services/article';
import { ArticleResponse, requestSingleArticle } from 'app/services/article/requests';
import { refineArticleJSON } from 'app/utils/utils';

export function* loadArticle({ payload }: ReturnType<typeof Actions.loadArticleRequest>) {
  const { channelName, contentIndex, requestQueries } = payload;
  try {
    const response: ArticleResponse = yield call(requestSingleArticle, channelName, contentIndex, requestQueries);
    yield put(Actions.updateArticleContent({
      channelName,
      contentIndex,
      content: response && response.content ? refineArticleJSON(JSON.parse(response.content)) : undefined,
    }));
    yield response.content = undefined;
    yield put(Actions.loadArticleSuccess({
      channelName,
      contentIndex,
      articleResponse: response,
    }));
  } catch (error) {
    yield put(Actions.loadArticleFailure({
      channelName,
      contentIndex,
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
