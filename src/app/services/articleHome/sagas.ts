import { all, call, put, takeEvery, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { ArticleListResponse, ArticleResponse, requestArticles } from 'app/services/article/requests';
import { Actions, ArticleHomeSectionType } from 'app/services/articleHome';
import { BigBanner } from 'app/services/home';
import { requestBanner } from 'app/services/home/requests';
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

function* loadArticleBanner() {
  try {
    const response: BigBanner[] = yield call(requestBanner, 'article');
    yield put(Actions.loadArticleBannerSuccess({
      response,
      fetchedAt: Date.now(),
    }));
  } catch (e) {
    yield put(Actions.loadArticleBannerFailure());
    if (e && e.response && e.response.data && e.response.data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchLoadArticleHomeSectionListRequest() {
  yield takeEvery(Actions.loadArticleHomeSectionListRequest.getType(), loadArticleHomeSectionListRequest);
}

export function* watchLoadArticleBanner() {
  yield takeLeading(Actions.loadArticleBannerRequest.getType(), loadArticleBanner);
}

export function* articleHomeRootSaga() {
  yield all([
    watchLoadArticleHomeSectionListRequest(),
    watchLoadArticleBanner(),
  ]);
}
