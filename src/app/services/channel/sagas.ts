import { Actions, ArticleChannel } from 'app/services/channel';
import { requestArticleChannelList } from 'app/services/channel/requests';
import { all, call, put, select, takeLeading } from 'redux-saga/effects';

function* loadArticleChannelList() {
  try {
    const response: ArticleChannel[] = yield call(requestArticleChannelList);
    // yield put(Actions.loadArticleChannelListSuccess({ articleChannelList: response }));
  } catch (e) {
    alert(e);
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
