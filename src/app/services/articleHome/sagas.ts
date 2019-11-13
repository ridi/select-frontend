import { all, call, put, takeEvery } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { ArticleListResponse, ArticleResponse, requestArticles } from 'app/services/article/requests';
import { Actions, ArticleHomeSectionType } from 'app/services/articleHome';
import { ArticleRequestOrderType, ArticleRequestType } from 'app/types';
import showMessageForRequestError from 'app/utils/toastHelper';
import { getArticleKeyFromData } from 'app/utils/utils';

function* loadArticleHomeSectionListRequest({ payload }: ReturnType<typeof Actions.loadArticleHomeSectionListRequest>) {
  const { targetSection } = payload;
  try {
    const response: ArticleListResponse = yield call(requestArticles, {
      type: targetSection === ArticleHomeSectionType.RECOMMEND ? ArticleRequestType.RECOMMEND : undefined,
      ordering: targetSection === ArticleHomeSectionType.POPULAR ? ArticleRequestOrderType.POPULAR : ArticleRequestOrderType.RECENT,
    });
    yield put(ArticleActions.updateArticles({
      articles: response.results,
    }));
    yield put(Actions.loadArticleHomeSectionListSuccess({
      articles: response.results.map((article: ArticleResponse) => getArticleKeyFromData(article)),
      targetSection,
    }));
  } catch (e) {
    yield put(Actions.loadArticleHomeSectionListFailure({
      targetSection,
    }));
    if (e && e.response && e.response.data && e.response.data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchLoadArticleHomeSectionListRequest() {
  yield takeEvery(Actions.loadArticleHomeSectionListRequest.getType(), loadArticleHomeSectionListRequest);
}

export function* articleHomeRootSaga() {
  yield all([
    watchLoadArticleHomeSectionListRequest(),
  ]);
}
