import { Actions as ArticleChannelActions } from 'app/services/articleChannel';
import { Actions } from 'app/services/articleFollowing';
import { FollowingArticleListResponse, FollowingChannelListResponse,
  requestFollowingArticleList, requestFollowingChannelList } from 'app/services/articleFollowing/requests';
import { all, call, put, takeLeading } from 'redux-saga/effects';

import { ErrorStatus } from 'app/constants/index';
import showMessageForRequestError from 'app/utils/toastHelper';

function* loadFollowingChannelList() {
  try {
    const response: FollowingChannelListResponse = yield call(requestFollowingChannelList);
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

export function* watchFollowingChannelListRequest() {
  yield takeLeading(Actions.loadFollowingChannelListRequest.getType(), loadFollowingChannelList);
}

// export function*

export function* articleFollowingRootSaga() {
  yield all([
    watchFollowingChannelListRequest(),
  ]);
}
