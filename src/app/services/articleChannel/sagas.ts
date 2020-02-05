import history from 'app/config/history';
import { ErrorStatus, RoutePaths } from 'app/constants/index';
import { Actions as ArticleActions } from 'app/services/article';
import { Actions, ArticleChannel } from 'app/services/articleChannel';
import {
  ArticleChannelArticlesResponse,
  ArticleChannelFollowingResponse,
  ArticleChannelListResponse,
  requestArticleChannelArticles,
  requestArticleChannelDetail,
  requestArticleChannelFollowing,
  requestArticleChannelList,
} from 'app/services/articleChannel/requests';
import { Actions as TrackingActions } from 'app/services/tracking';
import { RidiSelectState } from 'app/store';
import { ArticleRequestIncludableData } from 'app/types';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, select, takeLeading } from 'redux-saga/effects';

function* loadArticleChannelList() {
  try {
    const response: ArticleChannelListResponse = yield call(requestArticleChannelList, {
      includes: [ArticleRequestIncludableData.IS_FOLLOWING],
    });
    yield put(Actions.updateChannelDetail({ channels: response.results }));
    yield put(Actions.loadArticleChannelListSuccess({ response }));
  } catch (e) {
    const data = e && e.response && e.response.data;

    yield put(Actions.loadArticleChannelListFailure());
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

function* loadArticleChannelDetail({
  payload,
}: ReturnType<typeof Actions.loadArticleChannelDetailRequest>) {
  const { channelName } = payload;
  try {
    const response: ArticleChannel = yield call(requestArticleChannelDetail, channelName, {
      includes: [
        ArticleRequestIncludableData.FOLLOWERS_COUNT,
        ArticleRequestIncludableData.IS_FOLLOWING,
      ],
    });
    yield put(
      Actions.loadArticleChannelDetailSuccess({ articleChannelDetail: response, channelName }),
    );
  } catch (e) {
    const data = e && e.response && e.response.data;
    const status = e && e.response && e.response.status;

    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    if (status === 403) {
      // TODO: Not Available Channel
      toast.failureMessage('열람할 수 없는 채널입니다.');
      history.replace(RoutePaths.ARTICLE_HOME);
    } else if (status === 404) {
      toast.failureMessage('존재하지 않는 채널입니다.');
      history.replace(RoutePaths.ARTICLE_HOME);
    } else {
      showMessageForRequestError(e);
    }
    yield put(Actions.loadArticleChannelDetailFailure({ channelName }));
  }
}

function* loadArticleChannelArticles({
  payload,
}: ReturnType<typeof Actions.loadArticleChannelArticlesRequest>) {
  const { channelName, page } = payload;
  try {
    const response: ArticleChannelArticlesResponse = yield call(
      requestArticleChannelArticles,
      channelName,
      page,
    );
    yield put(ArticleActions.updateArticles({ articles: response.results }));
    yield put(Actions.loadArticleChannelArticlesSuccess({ channelName, page, response }));
  } catch (e) {
    const data = e && e.response && e.response.data;

    yield put(Actions.loadArticleChannelArticlesFailure({ channelName, page }));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* articleChannelFollowingAction({
  payload,
}: ReturnType<typeof Actions.articleChannelFollowingActionRequest>) {
  const { channelId, channelName, method } = payload;
  try {
    const hasAvailableTicket = yield select(
      (state: RidiSelectState) => state.user.hasAvailableTicket,
    );
    if (!hasAvailableTicket) {
      toast.failureMessage(
        `구독 후 ${method === 'POST' ? '팔로우' : '팔로잉 해제'}할 수 있습니다.`,
      );
      yield put(Actions.articleChannelFollowingActionFailure({ channelName }));
      return;
    }
    const response: ArticleChannelFollowingResponse = yield call(
      requestArticleChannelFollowing,
      channelId,
      method,
    );
    yield put(Actions.articleChannelFollowingActionSuccess({ channelName, response, method }));
    const eventName = method === 'POST' ? 'Follow Channel' : 'Unfollow Channel';
    const trackingParams = {
      eventName,
      id: `ch:${response.channelId}`,
    };
    yield put(TrackingActions.trackingArticleActions({ trackingParams }));
  } catch (e) {
    const data = e && e.response && e.response.data;

    yield put(Actions.articleChannelFollowingActionFailure({ channelName }));
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* watchArticleChannelFollowingAction() {
  yield takeLeading(
    Actions.articleChannelFollowingActionRequest.getType(),
    articleChannelFollowingAction,
  );
}
export function* watchLoadArticleChannelListRequest() {
  yield takeLeading(Actions.loadArticleChannelListRequest.getType(), loadArticleChannelList);
}
export function* watchLoadArticleChannelDetailRequest() {
  yield takeLeading(Actions.loadArticleChannelDetailRequest.getType(), loadArticleChannelDetail);
}
export function* watchLoadArticleChannelArticlesRequest() {
  yield takeLeading(
    Actions.loadArticleChannelArticlesRequest.getType(),
    loadArticleChannelArticles,
  );
}

export function* channelRootSaga() {
  yield all([
    watchLoadArticleChannelListRequest(),
    watchLoadArticleChannelDetailRequest(),
    watchLoadArticleChannelArticlesRequest(),
    watchArticleChannelFollowingAction(),
  ]);
}
