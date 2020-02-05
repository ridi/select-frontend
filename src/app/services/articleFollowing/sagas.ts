import { ErrorStatus } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { Actions as ArticleChannelActions } from 'app/services/articleChannel';
import {
  ArticleChannelFollowingResponse,
  requestArticleChannelFollowing,
} from 'app/services/articleChannel/requests';
import { Actions } from 'app/services/articleFollowing';
import {
  FollowingArticleListResponse,
  FollowingChannelListResponse,
  requestFollowingArticleList,
  requestFollowingChannelList,
  requestUnseenFollowingFeeds,
  requestUnseenFollowingFeedsToSeen,
  SetAllFollowingFeedsToSeenResponse,
  UnseenFollowingFeedsResponse,
} from 'app/services/articleFollowing/requests';
import { RidiSelectState } from 'app/store';
import { ArticleRequestIncludableData } from 'app/types';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';

function* loadFollowingChannelList() {
  try {
    const response: FollowingChannelListResponse = yield call(requestFollowingChannelList, {
      includes: [ArticleRequestIncludableData.CHANNEL],
    });
    yield put(
      ArticleChannelActions.updateChannelDetail({
        channels: response.results.map(res => res.channel),
      }),
    );
    yield put(Actions.loadFollowingChannelListSuccess({ response }));
  } catch (e) {
    yield put(Actions.loadFollowingChannelListFailure());
    if (e && e.response && e.response.data && e.response.data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError();
  }
}

function* loadFollowingArticleList({
  payload,
}: ReturnType<typeof Actions.loadFollowingArticleListRequest>) {
  const { page } = payload;
  try {
    const response: FollowingArticleListResponse = yield call(requestFollowingArticleList, page, {
      includes: [ArticleRequestIncludableData.IS_FAVORITE],
    });
    yield put(ArticleActions.updateArticles({ articles: response.results.map(res => res) }));
    yield put(Actions.loadFollowingArticleListSuccess({ page, response }));
  } catch (e) {
    yield put(Actions.loadFollowingArticleListFailure({ page }));
    if (e && e.response && e.response.data && e.response.data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError();
  }
}

function* loadUnseenFollowingFeedsRequest() {
  try {
    const response: UnseenFollowingFeedsResponse = yield call(requestUnseenFollowingFeeds);
    yield put(Actions.loadUnseenFollowingFeedsSuccess({ unSeenFeedList: response.results }));
  } catch (e) {
    yield put(Actions.setUnseenFollowingFeedsToSeenFailure());
  }
}

function* setUnseenFollowingFeedsToSeen() {
  try {
    const response: SetAllFollowingFeedsToSeenResponse = yield call(
      requestUnseenFollowingFeedsToSeen,
    );
    yield put(Actions.setUnseenFollowingFeedsToSeenSuccess(response));
  } catch (e) {
    yield put(Actions.setUnseenFollowingFeedsToSeenFailure());
  }
}

function* unFollowChannel({ payload }: ReturnType<typeof Actions.loadUnFollowChannelRequest>) {
  const { channelId, channelName, method } = payload;
  try {
    const hasAvailableTicket = yield select(
      (state: RidiSelectState) => state.user.hasAvailableTicket,
    );
    if (!hasAvailableTicket) {
      toast.failureMessage(
        `구독 후 ${method === 'POST' ? '팔로우' : '팔로잉 해제'}할 수 있습니다.`,
      );
      yield put(ArticleChannelActions.articleChannelFollowingActionFailure({ channelName }));
      return;
    }
    const response: ArticleChannelFollowingResponse = yield call(
      requestArticleChannelFollowing,
      channelId,
      method,
    );
    yield put(
      ArticleChannelActions.articleChannelFollowingActionSuccess({ channelName, response }),
    );
  } catch (e) {
    yield put(ArticleChannelActions.articleChannelFollowingActionFailure({ channelName }));
    return;
  }
  try {
    const channelResponse: FollowingChannelListResponse = yield call(requestFollowingChannelList, {
      includes: [ArticleRequestIncludableData.CHANNEL],
    });
    yield put(
      ArticleChannelActions.updateChannelDetail({
        channels: channelResponse.results.map(res => res.channel),
      }),
    );
    yield put(Actions.loadFollowingChannelListSuccess({ response: channelResponse }));
  } catch (e) {
    yield put(Actions.loadFollowingChannelListFailure());
  }
}

export function* watchFollowingChannelListRequest() {
  yield takeLeading(Actions.loadFollowingChannelListRequest.getType(), loadFollowingChannelList);
}

export function* watchFollowingArticleListRequest() {
  yield takeLeading(Actions.loadFollowingArticleListRequest.getType(), loadFollowingArticleList);
}

export function* watchLoadUnseenFollowingFeedsRequest() {
  yield takeLatest(
    Actions.loadUnseenFollowingFeedsRequest.getType(),
    loadUnseenFollowingFeedsRequest,
  );
}

export function* watchSetUnseenFollowingFeedsToSeen() {
  yield takeLatest(
    Actions.setUnseenFollowingFeedsToSeenRequest.getType(),
    setUnseenFollowingFeedsToSeen,
  );
}

export function* watchUnFollowChannelRequest() {
  yield takeLeading(Actions.loadUnFollowChannelRequest.getType(), unFollowChannel);
}

export function* articleFollowingRootSaga() {
  yield all([
    watchFollowingChannelListRequest(),
    watchFollowingArticleListRequest(),
    watchLoadUnseenFollowingFeedsRequest(),
    watchSetUnseenFollowingFeedsToSeen(),
    watchUnFollowChannelRequest(),
  ]);
}
