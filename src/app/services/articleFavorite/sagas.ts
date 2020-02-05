import history from 'app/config/history';
import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { Actions } from 'app/services/articleFavorite';
import {
  FavoriteArticleListResponse,
  requestFavoriteArticleList,
} from 'app/services/articleFavorite/requests';
import toast from 'app/utils/toast';
import { all, call, put, takeLeading } from 'redux-saga/effects';

function* loadFavoriteArticleList({
  payload,
}: ReturnType<typeof Actions.loadFavoriteArticleListRequest>) {
  const { page } = payload;
  try {
    const response: FavoriteArticleListResponse = yield call(requestFavoriteArticleList, page);
    yield put(
      ArticleActions.updateArticles({
        articles: response.results.map(data => {
          data.article.isFavorite = true;
          return data.article;
        }),
      }),
    );
    yield put(Actions.loadFavoriteArticleListSuccess({ response, page }));
  } catch (e) {
    yield put(Actions.loadFavoriteArticleListFailure({ page }));
    if (e && e.response && e.response.data && e.response.data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    toast.failureMessage('좋아한 아티클 목록이 없는 페이지입니다.', {
      callback: () => {
        history.goBack();
      },
      durationMs: 1000,
    });
  }
}

export function* watchLoadFavoriteArticleListRequest() {
  yield takeLeading(Actions.loadFavoriteArticleListRequest.getType(), loadFavoriteArticleList);
}

export function* articleFavoriteRootSaga() {
  yield all([watchLoadFavoriteArticleListRequest()]);
}
