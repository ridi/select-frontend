import { keyBy } from 'lodash-es';
import * as qs from 'qs';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import history from 'app/config/history';
import { FetchErrorFlag, RoutePaths } from 'app/constants';
import { Book } from 'app/services/book';
import { requestBooks } from 'app/services/book/requests';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { Actions as MySelectActions } from 'app/services/mySelect';
import { Actions as TrackingActions } from 'app/services/tracking';
import { Actions } from 'app/services/user';
import {
  AccountsMeResponse,
  MySelectHistoryResponse,
  PurchasesResponse,
  reqeustDeleteMySelectHistory,
  reqeustMySelectHistory,
  requestAccountsMe,
  requestCancelPurchase,
  requestCancelUnsubscription,
  requestPayInfo,
  requestPurchases,
  requestSubscription,
  requestUnsubscribe,
  SubscriptionResponse,
} from 'app/services/user/requests';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import { fixWrongPaginationScope, isValidPaginationParameter, updateQueryStringParam } from 'app/utils/request';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';

export function* initializeUser({ payload }: ReturnType<typeof Actions.initializeUser>) {
  yield put(TrackingActions.trackingArgsUpdate({
    updateKey: 'userId',
    updateValue: payload.userDTO.uId,
  }));
}

export function* watchInitializeUser() {
  yield takeLatest(Actions.initializeUser.getType(), initializeUser);
}

export function* watchLoadAccountsMeRequest() {
  while (true) {
    const state: RidiSelectState = yield select((s) => s);
    yield take(Actions.loadAccountsMeRequest.getType());
    try {
      const response: { data: AccountsMeResponse } = yield call(requestAccountsMe);
      yield put(Actions.loadAccountsMeSuccess({
        uId: response.data.result.id,
        email: response.data.result.email,
      }));
    } catch (e) {
      yield put(Actions.loadAccountsMeFailure());
      const { STORE_URL, SELECT_URL } = state.environment;
      location.href = `${STORE_URL}/account/logout?return_url=${SELECT_URL}/`;
    }
  }
}

export function* watchLoadSubscription() {
  while (true) {
    yield take(Actions.loadSubscriptionRequest.getType());
    try {
      const response: SubscriptionResponse = yield call(requestSubscription);
      // Response의 결제 타입이 신용카드일 경우 사용자의 PayInfo를 가져옴
      if (response.isUsingRidipay) {
        try {
          const payInfoResponse = yield call(requestPayInfo);
          if (payInfoResponse.data.payment_methods.cards) {
            const { issuer_name , iin , subscriptions } = payInfoResponse.data.payment_methods.cards[0];
            response.cardBrand = issuer_name;
            response.maskedCardNo = `${iin.substr(0, 4)} ${iin.substr(4, 2)}`;
            response.cardSubscription = subscriptions;
          }
        } catch (e) {
          continue;
        } finally {
          yield put(Actions.loadSubscriptionSuccess({ response }));
        }
      } else {
        yield put(Actions.loadSubscriptionSuccess({ response }));
      }
    } catch (error) {
      let isFetched = true;

      if (error.response.status !== 402) {
        isFetched = false;
        showMessageForRequestError(error);
      }

      yield put(Actions.loadSubscriptionFailure({ isFetched }));
    }
  }
}

export function* watchLoadPurchases() {
  while (true) {
    const { payload: { page } }: ReturnType<typeof Actions.loadPurchasesRequest> = yield take(Actions.loadPurchasesRequest.getType());
    try {
      const response: PurchasesResponse = yield call(requestPurchases, page);
      yield put(Actions.loadPurchasesSuccess({ page, response }));
    } catch (e) {
      yield put(Actions.loadPurchasesFailure({ page }));
      showMessageForRequestError(e);
    }
  }
}

export function* loadMySelectHistory({ payload }: ReturnType<typeof Actions.loadMySelectHistoryRequest>) {
  const { page } = payload!;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: MySelectHistoryResponse = yield call(reqeustMySelectHistory, page);
    if (response.userRidiSelectBooks.length > 0) {
      const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map((book) => parseInt(book.bId, 10)));
      const booksMap = keyBy(books, 'id');
      response.userRidiSelectBooks.forEach((book, index) => {
        response.userRidiSelectBooks[index].book = booksMap[book.bId];
      });
    }

    yield put(Actions.loadMySelectHistorySuccess({ page, response }));
  } catch (error) {
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
      return;
    }
    yield put(Actions.loadMySelectHistoryFailure({ page, error }));
  }
}

export function* watchLoadMySelectHistory() {
  yield takeEvery(Actions.loadMySelectHistoryRequest.getType(), loadMySelectHistory);
}

export function* watchLoadMySelectHistoryFailure() {
  while (true) {
    const { payload: { page, error } }: ReturnType<typeof Actions.loadMySelectHistoryFailure> = yield take(Actions.loadMySelectHistoryFailure.getType());
    if (page === 1) {
      const { data } = error.response!;
      if (!data || data.status !== ErrorStatus.MAINTENANCE) {
        toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      }
      return;
    }
    fixWrongPaginationScope(error.response);
  }
}

export function* watchDeleteMySelectHistory() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.deleteMySelectHistoryRequest> = yield take(
      Actions.deleteMySelectHistoryRequest.getType(),
    );
    const { mySelectBookIds, page } = payload!;
    try {
      yield call(reqeustDeleteMySelectHistory, mySelectBookIds);
      const response: MySelectHistoryResponse = yield call(reqeustMySelectHistory, page);
      if (response.userRidiSelectBooks.length > 0) {
        const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map((book) => parseInt(book.bId, 10)));
        const booksMap = keyBy(books, 'id');
        response.userRidiSelectBooks.forEach((book, index) => {
          response.userRidiSelectBooks[index].book = booksMap[book.bId];
        });
      }

      yield put(Actions.deleteMySelectHistorySuccess({ page, response }));
      if (response.userRidiSelectBooks.length === 0 && page > 1) {
        history.replace(`/my-select-history?page=${page - 1}`);
      }
    } catch (e) {
      yield put(MySelectActions.deleteMySelectFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* watchCancelPurchase() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.cancelPurchaseRequest> = yield take(
      Actions.cancelPurchaseRequest.getType(),
    );
    const { purchaseId } = payload!;
    try {
      yield call(requestCancelPurchase, purchaseId);
      yield put(Actions.cancelPurchaseSuccess({ purchaseId }));
      alert('결제가 취소되었습니다.');
      window.location.href = RoutePaths.SETTING;
    } catch (e) {
      toast.failureMessage(e.data.message);
      yield put(Actions.cancelPurchaseFailure({ purchaseId }));
    }
  }
}

export function* watchUnsubscribe() {
  while (true) {
    yield take(Actions.unsubscribeRequest.getType());
    const state: RidiSelectState = yield select((s) => s);
    try {
      yield call(requestUnsubscribe, state.user.subscription!.subscriptionId);
      yield put(Actions.unsubscribeSuccess());
      yield put(Actions.loadSubscriptionRequest());
      const endDate = buildOnlyDateFormat(state.user.subscription!.ticketEndDate);
      alert(`구독 해지가 예약되었습니다.\n${endDate}까지 이용할 수 있습니다.`);
      history.replace('/settings');
    } catch (e) {
      yield put(Actions.unsubscribeFailure());
      showMessageForRequestError(e);
    }
  }
}
export function* watchCancelUnsubscription() {
  while (true) {
    yield take(Actions.cancelUnsubscriptionRequest.getType());
    const state: RidiSelectState = yield select((s) => s);
    try {
      yield call(requestCancelUnsubscription, state.user.subscription!.subscriptionId);
      yield put(Actions.cancelUnsubscriptionSuccess());
      yield put(Actions.loadSubscriptionRequest());
      alert('구독 해지 예약이 취소되었습니다.');
    } catch (e) {
      yield put(Actions.cancelUnsubscriptionFailure());
      if (e.response && e.response.data.code === 'DELETED_PAYMENT_METHOD') {
        if (getIsIosInApp(state)) {
          alert('구독했던 카드가 삭제되어 카드 등록 후 구독 해지 예약을 취소할 수 있습니다.');
          return;
        }

        if (confirm('구독했던 카드가 삭제되어 카드 등록 후 구독 해지 예약을 취소할 수 있습니다. 카드를 등록하시겠습니까?')) {
          const { STORE_URL } = state.environment;
          const currentLocation = encodeURIComponent(location.href);
          window.location.href = `${STORE_URL}/select/payments/ridi-pay/request?return_url=${currentLocation}`;
        }
      } else {
        showMessageForRequestError(e);
      }
    }
  }
}

export function* userRootSaga() {
  yield all([
    watchInitializeUser(),
    watchLoadAccountsMeRequest(),
    watchLoadSubscription(),
    watchLoadPurchases(),
    watchLoadMySelectHistory(),
    watchLoadMySelectHistoryFailure(),
    watchDeleteMySelectHistory(),
    watchCancelPurchase(),
    watchUnsubscribe(),
    watchCancelUnsubscription(),
  ]);
}
