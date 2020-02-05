import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import history from 'app/config/history';
import { ErrorStatus, RoutePaths } from 'app/constants/index';
import { Actions } from 'app/services/article';
import {
  ArticleResponse,
  FavoriteArticleActionResponse,
  requestFavoriteArticleAction,
  requestSingleArticle,
} from 'app/services/article/requests';
import { Actions as ChannelActions } from 'app/services/articleChannel';
import { Actions as TrackingActions } from 'app/services/tracking';
import { RidiSelectState } from 'app/store';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';
import { refineArticleJSON } from 'app/utils/utils';

export function* loadArticle({ payload }: ReturnType<typeof Actions.loadArticleRequest>) {
  const { channelName, contentIndex, requestQueries } = payload;
  try {
    const response: ArticleResponse = yield call(
      requestSingleArticle,
      channelName,
      contentIndex,
      requestQueries,
    );
    yield put(
      Actions.updateArticleContent({
        channelName,
        contentIndex,
        content:
          response && response.content
            ? refineArticleJSON(JSON.parse(response.content))
            : undefined,
      }),
    );
    yield put(
      ChannelActions.updateChannelDetail({
        channels: response.channel ? [response.channel] : [],
      }),
    );
    const { channel, content, ...restData } = response;
    yield put(
      Actions.loadArticleSuccess({
        channelName,
        contentIndex,
        articleResponse: restData,
      }),
    );
  } catch (error) {
    const status = error && error.response && error.response.status;

    if (status === 403) {
      // TODO: Not Available Article
      toast.failureMessage('열람할 수 없는 아티클 입니다.');
      history.replace(RoutePaths.ARTICLE_HOME);
    } else if (status === 404) {
      toast.failureMessage('아티클이 존재하지 않습니다.');
      history.replace(RoutePaths.ARTICLE_HOME);
    } else {
      toast.failureMessage();
    }
    yield put(
      Actions.loadArticleFailure({
        channelName,
        contentIndex,
      }),
    );
  }
}

export function* updateArticles({ payload }: ReturnType<typeof Actions.updateArticles>) {
  const { articles } = payload;
  try {
    const articleChannels = articles.map(article => article.channel!);
    yield put(
      ChannelActions.updateChannelDetail({
        channels: articleChannels,
      }),
    );
  } catch (error) {
    // 채널 업데이트 에러
  }
}

function* favoriteArticleAction({
  payload,
}: ReturnType<typeof Actions.favoriteArticleActionRequest>) {
  const { articleId, method } = payload;
  try {
    const hasAvailableTicket = yield select(
      (state: RidiSelectState) => state.user.hasAvailableTicket,
    );
    if (!hasAvailableTicket && method === 'POST') {
      toast.failureMessage('구독 후 이용하실 수 있습니다.');
      return;
    }
    const response: FavoriteArticleActionResponse = yield call(
      requestFavoriteArticleAction,
      method,
      articleId,
    );
    yield put(
      Actions.updateFavoriteArticleStatus({
        channelName: response.channelName,
        contentIndex: response.contentId,
        isFavorite: response.isFavorite,
      }),
    );
    const eventName = method === 'POST' ? 'Like Article' : 'Unlike Article';
    const trackingParams = {
      eventName,
      id: Number(articleId),
    };
    yield put(TrackingActions.trackingArticleActions({ trackingParams }));
  } catch (e) {
    const data = e && e.response && e.response.data;

    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }

    showMessageForRequestError();
  }
}

export function* watchLoadArticle() {
  yield takeLatest(Actions.loadArticleRequest.getType(), loadArticle);
}

export function* watchLoadUpdateArticles() {
  yield takeLatest(Actions.updateArticles.getType(), updateArticles);
}

export function* watchFavoriteArticleActionRequest() {
  yield takeLatest(Actions.favoriteArticleActionRequest.getType(), favoriteArticleAction);
}

export function* articleRootSaga() {
  yield all([watchLoadArticle(), watchLoadUpdateArticles(), watchFavoriteArticleActionRequest()]);
}
