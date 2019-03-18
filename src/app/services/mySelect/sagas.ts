import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { Actions as BookActions } from 'app/services/book';
import { Book } from 'app/services/book';
import { requestBooks } from 'app/services/book/requests';
import { Actions } from 'app/services/mySelect';
import {
  MySelectListResponse,
  requestAddMySelect,
  requestDeleteMySelect,
  requestMySelectList,
  UserRidiSelectBookResponse,
} from 'app/services/mySelect/requests';
import { Actions as MySelectHistoryActions } from 'app/services/user';

import { reqeustMySelectHistory } from 'app/services/user/requests';

import { Actions as TrackingActions } from 'app/services/tracking';
import { RidiSelectState } from 'app/store';
import { downloadBooksInRidiselect, readBooksInRidiselect } from 'app/utils/downloadUserBook';
import { getNotAvailableConvertDate } from 'app/utils/expiredDate';
import { updateQueryStringParam } from 'app/utils/request';
import toast from 'app/utils/toast';
import { AxiosResponse } from 'axios';
import { keyBy } from 'lodash-es';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import { getIsIosInApp, selectIsInApp } from '../environment/selectors';

export function* loadMySelectList({ payload }: ReturnType<typeof Actions.loadMySelectRequest>) {
  const { page } = payload;
  try {
    if (isNaN(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: MySelectListResponse = yield call(requestMySelectList, page);
    if (response.userRidiSelectBooks.length > 0) {
      const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map((book) => parseInt(book.bId, 10)));
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
    yield put(Actions.loadMySelectSuccess({
      response,
      page,
    }));
  } catch (error) {
    yield put(Actions.loadMySelectFailure({ page, error }));
  }
}

export function* watchLoadMySelectList() {
  yield takeEvery(Actions.loadMySelectRequest.getType(), loadMySelectList);
}

export function* watchDeleteMySelect() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.deleteMySelectRequest> = yield take(Actions.deleteMySelectRequest.getType());
    const { deleteBookIdPairs, page, isEveryBookChecked } = payload!;
    const deleteBookIds: number[] = [];
    const deleteMySelectBookIds: number[] = [];

    deleteBookIdPairs.forEach((bookIdPair) => {
      deleteBookIds.push(bookIdPair.bookId);
      deleteMySelectBookIds.push(bookIdPair.mySelectBookId);
    });

    try {
      const response: AxiosResponse<any> = yield call(requestDeleteMySelect, deleteMySelectBookIds);
      if (response.status !== 200) {
        throw new Error();
      }
      if (window.inApp && window.inApp.mySelectBookDeleted) {
        window.inApp.mySelectBookDeleted(JSON.stringify(deleteBookIds));
      } else if (window.android && window.android.mySelectBookDeleted) {
        // TODO: 추후 안드로이드 앱에서 버전 제한 시점 이후 window.android 사용처 제거.
        window.android.mySelectBookDeleted(JSON.stringify(deleteBookIds));
      }
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
    const { payload }: ReturnType<typeof Actions.addMySelectRequest> = yield take(Actions.addMySelectRequest.getType());
    const state: RidiSelectState = yield select((s) => s);
    const { bookId } = payload!;
    try {
      const response: UserRidiSelectBookResponse = yield call(requestAddMySelect, bookId);
      yield put(Actions.addMySelectSuccess({ userRidiSelectResponse: response }));
      yield put(BookActions.loadBookOwnershipRequest({ bookId }));
      if (!getIsIosInApp(state)) {
        const toastButton = selectIsInApp(state) ? {
          callback: () => { readBooksInRidiselect(bookId); },
          label: '읽기',
        } : {
          callback: () => { downloadBooksInRidiselect([bookId]); },
          label: '다운로드',
        };
        toast.success('마이 셀렉트에 추가되었습니다.', {
          button: {
            showArrowIcon: true,
            ...toastButton,
          },
        });
      }
      // TODO: bookId 를 string 으로 넘겨야 하는 것으로 약속 되어있는데 reducer 내부에서 모두 number로 처리하고 있어서 인앱 관련된 부분만 일단 수정.
      if (window.inApp && window.inApp.mySelectBookInserted) {
        window.inApp.mySelectBookInserted(`${bookId}`);
      } else if (window.android && window.android.mySelectBookInserted) {
        // TODO: 추후 안드로이드 앱에서 버전 제한 시점 이후 window.android 사용처 제거.
        window.android.mySelectBookInserted(`${bookId}`);
      }
    } catch (e) {
      yield put(Actions.addMySelectFailure());
      toast.failureMessage('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
    }
  }
}

export function* watchLoadMySelectFailure() {
  while (true) {
    const { payload: { error, page } }: ReturnType<typeof Actions.loadMySelectFailure> = yield take(Actions.loadMySelectFailure.getType());
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS || page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
    } else if (!page) {
      toast.failureMessage();
    }
  }
}

export function* watchAddMySelectSuccess() {
  while (true) {
    const { payload: { userRidiSelectResponse } }: ReturnType<typeof Actions.addMySelectSuccess> = yield take(Actions.addMySelectSuccess.getType());
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
    watchLoadMySelectFailure(),
  ]);
}
