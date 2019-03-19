import { all, call, put, take, takeEvery } from 'redux-saga/effects';

import { FetchErrorFlag } from 'app/constants';
import { Actions as BookActions } from 'app/services/book';
import { Actions } from 'app/services/searchResult';
import { requestSearchResult, SearchResultReponse } from 'app/services/searchResult/requests';
import { paginationErrorCallback } from 'app/utils/pageParamsErrorHelper';

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
    paginationErrorCallback(error, page);
  }
}

export function* searchResultRootSaga() {
  yield all([
    watchQueryKeyword(),
    watchQueryKeywordFailure(),
  ]);
}
