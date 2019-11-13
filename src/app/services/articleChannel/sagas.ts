import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { Actions, ArticleChannel } from 'app/services/articleChannel';
import { ArticleChannelArticlesResponse, ArticleChannelFollowingResponse,
  ArticleChannelListResponse, requestArticleChannelArticles,
  requestArticleChannelDetail, requestArticleChannelFollowing, requestArticleChannelList } from 'app/services/articleChannel/requests';
import { ArticleRequestIncludableData } from 'app/types';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, take, takeLeading } from 'redux-saga/effects';

function* loadArticleChannelList() {
  try {
    const response: ArticleChannelListResponse = yield call(requestArticleChannelList, { includes: [ArticleRequestIncludableData.IS_FOLLOWING] });
    yield put(Actions.updateChannelDetail({ channels: response.results }));
    yield put(Actions.loadArticleChannelListSuccess({ response }));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadArticleChannelListFailure());
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

function* loadArticleChannelDetail({ payload }: ReturnType<typeof Actions.loadArticleChannelDetailRequest>) {
  const { channelId } = payload;
  try {
    const response: ArticleChannel = yield call(
      requestArticleChannelDetail,
      channelId,
      { includes: [ArticleRequestIncludableData.FOLLOWERS_COUNT, ArticleRequestIncludableData.IS_FOLLOWING]});
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
    yield put(ArticleActions.updateArticles({ articles: response.results }));
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

export function* articleChannelFollowingAction({ payload }: ReturnType<typeof Actions.articleChannelFollowingActionRequest>) {
  const { channelId, type } = payload;
  try {
    const response: ArticleChannelFollowingResponse = yield call(requestArticleChannelFollowing, channelId, type);
    yield put(Actions.articleChannelFollowingActionSuccess({ channelId, response }));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.articleChannelFollowingActionFailure({channelId}));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchArticleChannelFollowingAction() {
  yield takeLeading(Actions.articleChannelFollowingActionRequest.getType(), articleChannelFollowingAction);
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
    watchArticleChannelFollowingAction(),
  ]);
}
