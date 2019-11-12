import { Actions as ArticleActions } from 'app/services/article';
import { Actions as ArticleChannelActions } from 'app/services/articleChannel';
import { Actions } from 'app/services/articleFollowing';
import { FollowingArticleListResponse, FollowingChannelListResponse,
  requestFollowingArticleList, requestFollowingChannelList } from 'app/services/articleFollowing/requests';
import { all, call, put, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import { ArticleRequestIncludableData } from 'app/types';
import showMessageForRequestError from 'app/utils/toastHelper';

function* loadFollowingChannelList() {
  try {
    const response: FollowingChannelListResponse = yield call(requestFollowingChannelList, { includes: [ArticleRequestIncludableData.CHANNEL] });
    yield put(ArticleChannelActions.updateChannelDetail({ channels: response.results.map((res) => res.channel) }));
    yield put(Actions.loadFollowingChannelListSuccess({response}));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadFollowingChannelListFailure());
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

function* loadFollowingArticleList({ payload }: ReturnType<typeof Actions.loadFollowingArticleListRequest>) {
  const { page } = payload;
  try {
    const response: FollowingArticleListResponse = yield call(requestFollowingArticleList, page);
    yield put(ArticleActions.updateArticles({ articles: response.results.map((res) => res)}));
    yield put(Actions.loadFollowingArticleListSuccess({page, response}));
  } catch (e) {
    const { data } = e.response;
    yield put(Actions.loadFollowingArticleListFailure({page}));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchFollowingChannelListRequest() {
  yield takeLeading(Actions.loadFollowingChannelListRequest.getType(), loadFollowingChannelList);
}

export function* watchFollowingArticleListRequest() {
  yield takeLeading(Actions.loadFollowingArticleListRequest.getType(), loadFollowingArticleList);
}

export function* articleFollowingRootSaga() {
  yield all([
    watchFollowingChannelListRequest(),
    watchFollowingArticleListRequest(),
  ]);
}
