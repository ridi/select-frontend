import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Actions } from 'app/services/article';
import { ArticleResponse, requestSingleArticle } from 'app/services/article/requests';
import { Actions as ChannelActions } from 'app/services/articleChannel';
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
    yield put(ChannelActions.updateChannelDetail({
      channels: response.channel ? [response.channel] : [],
    }));
    const { channel, content, ...restData } = response;
    yield put(Actions.loadArticleSuccess({
      channelName,
      contentIndex,
      articleResponse: restData,
    }));
  } catch (error) {
    yield put(Actions.loadArticleFailure({
      channelName,
      contentIndex,
    }));
  }
}

export function* updateArticles({ payload }: ReturnType<typeof Actions.updateArticles>) {
  const { articles } = payload;
  try {
    const articleChannels = articles.map((article) => article.channel!);
    yield put(ChannelActions.updateChannelDetail({
      channels: articleChannels,
    }));
  } catch (error) {
    // 채널 업데이트 에러
  }
}

export function* watchLoadArticle() {
  yield takeLatest(Actions.loadArticleRequest.getType(), loadArticle);
}

export function* watchLoadUpdateArticles() {
  yield takeLatest(Actions.updateArticles.getType(), updateArticles);
}

export function* articleRootSaga() {
  yield all([
    watchLoadArticle(),
    watchLoadUpdateArticles(),
  ]);
}
