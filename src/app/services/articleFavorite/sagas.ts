import { all, call, put, takeLatest, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { Actions as ChannelActions } from 'app/services/articleChannel';
import { Actions } from 'app/services/articleFavorite';
import {
  FavoriteArticleActionResponse,
  FavoriteArticleListResponse,
  requestFavoriteArticleAction ,
  requestFavoriteArticleList,
} from 'app/services/articleFavorite/requests';
import showMessageForRequestError from 'app/utils/toastHelper';

function* loadFavoriteArticleList({ payload }: ReturnType<typeof Actions.loadFavoriteArticleListRequest>) {
  const { page } = payload;
  try {
    const response: FavoriteArticleListResponse = yield call(requestFavoriteArticleList);
    yield put(ArticleActions.updateArticles({ articles: response.results.map((data) => {
      data.article.isFavorite = true;
      return data.article;
    })}));
    yield put(ChannelActions.updateChannelDetail({ channels: response.results.map((data) => data.article.channel)}));
    yield put(Actions.loadFavoriteArticleListSuccess({ response, page }));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadFavoriteArticleListFailure({ page }));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

function* favoriteArticleAction({ payload }: ReturnType<typeof Actions.favoriteArticleActionRequest>) {
  const { articleId, method } = payload;
  try {
    const response: FavoriteArticleActionResponse = yield call(requestFavoriteArticleAction, method, articleId);
    yield put(ArticleActions.updateFavoriteArticleStatus({
      channelName: response.channelName,
      contentIndex: response.contentId,
      isFavorite: response.isFavorite,
    }));
  } catch (e) {
    const { data } = e.response;
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchLoadFavoriteArticleListRequest() {
  yield takeLeading(Actions.loadFavoriteArticleListRequest.getType(), loadFavoriteArticleList);
}

export function* watchFavoriteArticleActionRequest() {
  yield takeLatest(Actions.favoriteArticleActionRequest.getType(), favoriteArticleAction);
}

export function* articleFavoriteRootSaga() {
  yield all([
    watchLoadFavoriteArticleListRequest(),
    watchFavoriteArticleActionRequest(),
  ]);
}
