import { all, call, put, take, takeEvery } from 'redux-saga/effects';

import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { Actions } from 'app/services/closingReservedBooks';
import {
  ClosingReservedBooksResponse,
  requestClosingReservedBooks,
} from 'app/services/closingReservedBooks/requests';
import {
  fixWrongPaginationScope,
  isValidPaginationParameter,
  updateQueryStringParam,
} from 'app/utils/request';
import toast from 'app/utils/toast';

export function* loadClosingReservedBooks({
  payload,
}: ReturnType<typeof Actions.loadClosingReservedBooksRequest>) {
  const { page, termType } = payload;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: ClosingReservedBooksResponse = yield call(
      requestClosingReservedBooks,
      termType,
      page,
    );
    yield put(Actions.loadClosingReservedBooksSuccess({ termType, page, response }));
  } catch (error) {
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
      return;
    }
    yield put(Actions.loadClosingReservedBooksFailure({ termType, page, error }));
  }
}

export function* watchLoadClosingReservedBooksRequest() {
  yield takeEvery(Actions.loadClosingReservedBooksRequest.getType(), loadClosingReservedBooks);
}

export function* watchLoadClosingReservedBooksFailure() {
  while (true) {
    const {
      payload: { termType, page, error },
    }: ReturnType<typeof Actions.loadClosingReservedBooksFailure> = yield take(
      Actions.loadClosingReservedBooksFailure.getType(),
    );
    if (page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      return;
    }
    fixWrongPaginationScope(error.response);
  }
}

export function* closingReservedBooksRootSaga() {
  yield all([watchLoadClosingReservedBooksRequest(), watchLoadClosingReservedBooksFailure()]);
}
