import { all, call, put, take, takeEvery } from 'redux-saga/effects';

import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { Actions as BookActions } from 'app/services/book';
import { Actions } from 'app/services/searchResult';
import { requestSearchResult, SearchResultReponse } from 'app/services/searchResult/requests';
import { updateQueryStringParam } from 'app/utils/request';
import toast from 'app/utils/toast';

export function* queryKeyword({ payload }: ReturnType<typeof Actions.queryKeywordRequest>) {
  const { page, keyword } = payload;
  let response: SearchResultReponse;
  try {
    if (isNaN(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    response = yield call(requestSearchResult, keyword, page);
    yield put(BookActions.updateBooks({ books: response.books }));
    yield put(Actions.queryKeywordSuccess({ keyword, page, response }));
  } catch (error) {
    yield put(Actions.queryKeywordFailure({ keyword, page, error }));
  }
}

export function* watchQueryKeyword() {
  yield takeEvery(Actions.queryKeywordRequest.getType(), queryKeyword);
}

export function* watchQueryKeywordFailure() {
  while (true) {
    const { payload: { page, error } }: ReturnType<typeof Actions.queryKeywordFailure> = yield take(Actions.queryKeywordFailure.getType());
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      toast.failureMessage('없는 페이지입니다. 첫번째 페이지로 이동합니다.');
      history.replace(`?${updateQueryStringParam('page', 1)}`);
    } else if (page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
    } else if (!page) {
      toast.failureMessage();
    }
  }
}

export function* searchResultRootSaga() {
  yield all([
    watchQueryKeyword(),
    watchQueryKeywordFailure(),
  ]);
}
