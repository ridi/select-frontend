import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { Actions as BookActions, Book } from 'app/services/book';

import { requestBooks } from 'app/services/book/requests';
import { Actions } from 'app/services/mySelect';
import {
  MySelectListResponse,
  requestAddMySelect,
  requestDeleteMySelect,
  requestMySelectList,
  UserRidiSelectBookResponse,
} from 'app/services/mySelect/requests';

import { reqeustMySelectHistory } from 'app/services/user/requests';

import { Actions as TrackingActions } from 'app/services/tracking';
import { RidiSelectState } from 'app/store';
import { downloadBooksInRidiselect, readBooksInRidiselect } from 'app/utils/downloadUserBook';
import { getNotAvailableConvertDate } from 'app/utils/expiredDate';
import {
  sendPostRobotMySelectBookDeleted,
  sendPostRobotMySelectBookInserted,
} from 'app/utils/inAppMessageEvents';
import {
  fixWrongPaginationScope,
  isValidPaginationParameter,
  updateQueryStringParam,
} from 'app/utils/request';
import toast from 'app/utils/toast';
import { AxiosResponse } from 'axios';
import { keyBy } from 'lodash-es';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import { getIsIosInApp, selectIsInApp } from '../environment/selectors';

export function* loadMySelectList({ payload }: ReturnType<typeof Actions.loadMySelectRequest>) {
  const { page } = payload;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: MySelectListResponse = yield call(requestMySelectList, page);
    if (response.userRidiSelectBooks.length > 0) {
      const books: Book[] = yield call(
        requestBooks,
        response.userRidiSelectBooks.map(book => parseInt(book.bId, 10)),
      );
      const booksMap = keyBy(books, 'id');
      response.userRidiSelectBooks.forEach((book, index) => {
        response.userRidiSelectBooks[index].book = booksMap[book.bId];
        response.userRidiSelectBooks[index].expire = getNotAvailableConvertDate(book.endDate);
      });
      yield put(BookActions.updateBooks({ books }));
    } else if (response.totalCount < page) {
      const res = yield call(reqeustMySelectHistory, 1);
      if (res.totalCount > 0) {
        response.reSubscribed = true;
      }
      history.replace(`?${updateQueryStringParam('page', 1)}`);
    }
    yield put(
      Actions.loadMySelectSuccess({
        response,
        page,
      }),
    );
  } catch (error) {
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
      return;
    }
    yield put(Actions.loadMySelectFailure({ page, error }));
  }
}

export function* watchLoadMySelectList() {
  yield takeEvery(Actions.loadMySelectRequest.getType(), loadMySelectList);
}

export function* watchDeleteMySelect() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.deleteMySelectRequest> = yield take(
      Actions.deleteMySelectRequest.getType(),
    );
    const { deleteBookIdPairs, page, isEveryBookChecked } = payload;
    const deleteBookIds: number[] = [];
    const deleteMySelectBookIds: number[] = [];

    deleteBookIdPairs.forEach(bookIdPair => {
      deleteBookIds.push(bookIdPair.bookId);
      deleteMySelectBookIds.push(bookIdPair.mySelectBookId);
    });

    try {
      const response: AxiosResponse<any> = yield call(requestDeleteMySelect, deleteMySelectBookIds);
      if (response.status !== 200) {
        throw new Error();
      }
      sendPostRobotMySelectBookDeleted(deleteBookIds);
      if (isEveryBookChecked && page > 1) {
        yield all([
          put(Actions.deleteMySelectSuccess({ deleteBookIdPairs })),
          put(BookActions.clearBookOwnership({ bookIds: deleteBookIds })),
        ]);
        history.replace(`/my-select?page=${page - 1}`);
      } else {
        yield all([
          put(Actions.deleteMySelectSuccess({ deleteBookIdPairs })),
          put(Actions.loadMySelectRequest({ page })),
          put(BookActions.clearBookOwnership({ bookIds: deleteBookIds })),
        ]);
      }
    } catch (e) {
      yield put(Actions.deleteMySelectFailure());
    }
  }
}

export function* watchAddMySelect() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.addMySelectRequest> = yield take(
      Actions.addMySelectRequest.getType(),
    );
    const state: RidiSelectState = yield select(s => s);
    const { bookId } = payload;
    try {
      // bookId가 없을 경우, Catch문으로 바로 Throw.
      if (!bookId) {
        throw new Error();
      }
      const response: UserRidiSelectBookResponse = yield call(requestAddMySelect, bookId);
      yield put(Actions.addMySelectSuccess({ userRidiSelectResponse: response }));
      yield put(BookActions.loadBookOwnershipRequest({ bookId }));
      if (!getIsIosInApp(state)) {
        const toastButton = selectIsInApp(state)
          ? {
              callback: () => {
                readBooksInRidiselect(bookId);
              },
              label: '읽기',
            }
          : {
              callback: () => {
                downloadBooksInRidiselect([bookId]);
              },
              label: '다운로드',
            };
        toast.success('마이 셀렉트에 추가되었습니다.', {
          button: {
            showArrowIcon: true,
            ...toastButton,
          },
        });
      }
      sendPostRobotMySelectBookInserted(bookId);
    } catch (e) {
      yield put(Actions.addMySelectFailure());
      toast.failureMessage('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
    }
  }
}

export function* watchLoadMySelectFailure() {
  while (true) {
    const {
      payload: { error, page },
    }: ReturnType<typeof Actions.loadMySelectFailure> = yield take(
      Actions.loadMySelectFailure.getType(),
    );
    if (page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      return;
    }
    fixWrongPaginationScope(error.response);
  }
}

export function* watchAddMySelectSuccess() {
  while (true) {
    const {
      payload: { userRidiSelectResponse },
    }: ReturnType<typeof Actions.addMySelectSuccess> = yield take(
      Actions.addMySelectSuccess.getType(),
    );
    const trackingParams = {
      eventName: 'Add To My Select',
      b_id: Number(userRidiSelectResponse.bId),
    };
    yield put(TrackingActions.trackMySelectAdded({ trackingParams }));
  }
}

export function* mySelectRootSaga() {
  yield all([
    watchLoadMySelectList(),
    watchDeleteMySelect(),
    watchAddMySelect(),
    watchAddMySelectSuccess(),
  ]);
}
