import { ErrorStatus } from 'app/constants/index';
import { Actions, ArticleChannel } from 'app/services/articleChannel';
import { ArticleChannelArticlesResponse, ArticleChannelListResponse, requestArticleChannelArticles, requestArticleChannelDetail, requestArticleChannelList } from 'app/services/articleChannel/requests';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, takeLeading } from 'redux-saga/effects';

function* loadArticleChannelList() {
  try {
    const response: ArticleChannelListResponse = yield call(requestArticleChannelList, ['articles']);
    yield put(Actions.loadArticleChannelListSuccess({ articleChannelList: response.results, page: 1 }));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadArticleChannelListFailure({page: 1}));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

function* loadArticleChannelDetail({ payload }: ReturnType<typeof Actions.loadArticleChannelDetailRequest>) {
  const { channelId } = payload;
  try {
    const response: ArticleChannel = yield call(requestArticleChannelDetail, channelId, ['followers_count']);
    yield put(Actions.loadArticleChannelDetailSuccess({ articleChannelDetail: response, channelId }));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadArticleChannelDetailFailure({channelId}));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

function* loadArticleChannelArticles({ payload }: ReturnType<typeof Actions.loadArticleChannelArticlesRequest>) {
  const { channelId, page } = payload;
  try {
    const response: ArticleChannelArticlesResponse = yield call(requestArticleChannelArticles, channelId, page);
    yield put(Actions.loadArticleChannelArticlesSuccess({ channelId, page, response}));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadArticleChannelArticlesFailure({channelId, page}));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchLoadArticleChannelListRequest() {
  yield takeLeading(Actions.loadArticleChannelListRequest.getType(), loadArticleChannelList);
}

export function* watchLoadArticleChannelDetailRequest() {
  yield takeLeading(Actions.loadArticleChannelDetailRequest.getType(), loadArticleChannelDetail);
}

export function* watchLoadArticleChannelArticlesRequest() {
  yield takeLeading(Actions.loadArticleChannelArticlesRequest.getType(), loadArticleChannelArticles);
}

export function* channelRootSaga() {
  yield all([
    watchLoadArticleChannelListRequest(),
    watchLoadArticleChannelDetailRequest(),
    watchLoadArticleChannelArticlesRequest(),
  ]);
}
