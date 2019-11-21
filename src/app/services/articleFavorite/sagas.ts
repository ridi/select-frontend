import { all, call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { Actions } from 'app/services/articleFavorite';
import {
  FavoriteArticleActionResponse,
  FavoriteArticleListResponse,
  requestFavoriteArticleAction ,
  requestFavoriteArticleList,
} from 'app/services/articleFavorite/requests';
import { RidiSelectState } from 'app/store';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';

function* loadFavoriteArticleList({ payload }: ReturnType<typeof Actions.loadFavoriteArticleListRequest>) {
  const { page } = payload;
  try {
    const response: FavoriteArticleListResponse = yield call(requestFavoriteArticleList);
    yield put(ArticleActions.updateArticles({ articles: response.results.map((data) => {
      data.article.isFavorite = true;
      return data.article;
    })}));
    yield put(Actions.loadFavoriteArticleListSuccess({ response, page }));
  } catch (e) {
    yield put(Actions.loadFavoriteArticleListFailure({ page }));
    if (e
      && e.response
      && e.response.data
      && e.response.data.status === ErrorStatus.MAINTENANCE
    ) {
      return;
    }
    showMessageForRequestError();
  }
}

function* favoriteArticleAction({ payload }: ReturnType<typeof Actions.favoriteArticleActionRequest>) {
  const { articleId, method } = payload;
  try {
    const hasAvailableTicket = yield select((state: RidiSelectState) => state.user.hasAvailableTicket);
    if (!hasAvailableTicket && method === 'POST') {
      toast.failureMessage('해당 기능은 구독하신 후 이용하실 수 있습니다.');
      return;
    }
    const response: FavoriteArticleActionResponse = yield call(requestFavoriteArticleAction, method, articleId);
    yield put(ArticleActions.updateFavoriteArticleStatus({
      channelName: response.channelName,
      contentIndex: response.contentId,
      isFavorite: response.isFavorite,
    }));
  } catch (e) {
    if (e
      && e.response
      && e.response.data
      && e.response.data.status === ErrorStatus.MAINTENANCE
    ) {
      return;
    }
    showMessageForRequestError();
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
