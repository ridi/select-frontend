import { all, call, put, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { Actions } from 'app/services/articleFavorite';
import {
  FavoriteArticleListResponse,
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

export function* watchLoadFavoriteArticleListRequest() {
  yield takeLeading(Actions.loadFavoriteArticleListRequest.getType(), loadFavoriteArticleList);
}

export function* articleFavoriteRootSaga() {
  yield all([
    watchLoadFavoriteArticleListRequest(),
  ]);
}
