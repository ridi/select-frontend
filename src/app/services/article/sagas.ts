import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Actions } from 'app/services/article';
import { ArticleResponse, requestSingleArticle } from 'app/services/article/requests';
import { refineArticleJSON } from 'app/utils/utils';

export function* loadArticle({ payload }: ReturnType<typeof Actions.loadArticleRequest>) {
  const { channelName, contentIndex, requestQueries } = payload;
  try {
    const response: ArticleResponse = yield call(requestSingleArticle, channelName, contentIndex, requestQueries);
    const {id, title, regDate, contentId, lastModified, channelId, thumbnailUrl, authorId, url, channel } = response;

    if (response.content) {
      yield put(Actions.updateArticleContent({
        channelName,
        contentIndex,
        content: refineArticleJSON(JSON.parse(response.content)),
      }));
    }

    if (response.teaserContent) {
      yield put(Actions.updateArticleTeaserContent({
        channelName,
        contentIndex,
        teaserContent: refineArticleJSON(JSON.parse(response.teaserContent)),
      }));
    }

    yield put(Actions.loadArticleSuccess({
      channelName,
      contentIndex,
      articleResponse: {
        id,
        title,
        regDate,
        contentId,
        lastModified,
        channelId,
        thumbnailUrl,
        authorId,
        channel,
        url,
      },
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
