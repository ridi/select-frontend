import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Actions } from 'app/services/article';
import { ArticleResponse, requestArticleWithId } from 'app/services/article/requests';
import { refineArticleJSON } from 'app/utils/utils';

export function* loadArticle({ payload }: ReturnType<typeof Actions.loadArticleRequest>) {
  const { articleId, requestQueries } = payload;
  try {
    const response: ArticleResponse = yield call(requestArticleWithId, articleId, requestQueries);
    const {id, title, regDate, lastModified, channelId, thumbnailUrl, authorId } = response;
    if (response.content) {
      yield put(Actions.updateArticleContent({
        articleId,
        content: refineArticleJSON(JSON.parse(response.content)),
      }));
    }
    if (response.teaserContent) {
      yield put(Actions.updateArticleTeaserContent({
        articleId,
        teaserContent: refineArticleJSON(JSON.parse(response.teaserContent)),
      }));
    }
    yield put(Actions.loadArticleSuccess({
      articleId,
      articleResponse: {
        id,
        title,
        regDate,
        lastModified,
        channelId,
        thumbnailUrl,
        authorId,
      },
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
