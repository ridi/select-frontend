import { ErrorStatus } from 'app/constants/index';
import { Actions } from 'app/services/articleChannel';
import { ArticleChannelListResponse, requestArticleChannelList } from 'app/services/articleChannel/requests';
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

export function* watchLoadArticleChannelListRequest() {
  yield takeLeading(Actions.loadArticleChannelListRequest.getType(), loadArticleChannelList);
}

export function* channelRootSaga() {
  yield all([
    watchLoadArticleChannelListRequest(),
  ]);
}
