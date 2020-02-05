import { FetchErrorFlag } from 'app/constants';
import { replace } from 'connected-react-router';
import * as qs from 'qs';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';

import history from 'app/config/history';
import { Actions as BookActions } from 'app/services/book';
import { Actions, Category } from 'app/services/category';
import {
  CategoryBooksResponse,
  requestCategoryBooks,
  requestCategoryList,
} from 'app/services/category/requests';
import { localStorageManager } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';
import {
  fixWrongPaginationScope,
  isValidPaginationParameter,
  updateQueryStringParam,
} from 'app/utils/request';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';

export async function loadCategoryList() {
  return await requestCategoryList();
}

export function* watchLoadCategoryListRequest() {
  while (true) {
    yield take(Actions.loadCategoryListRequest.getType());
    try {
      const categoryList = yield call(loadCategoryList);
      yield put(Actions.loadCategoryListSuccess({ categoryList }));
    } catch (e) {
      showMessageForRequestError(e);
      const state: RidiSelectState = yield select(s => s);
      yield put(
        replace({
          ...state.router.location,
          pathname: '/',
        }),
      );
    }
  }
}

export function* watchInitializeWhole() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.initializeCategoriesWhole> = yield take(
      Actions.initializeCategoriesWhole.getType(),
    );
    if (payload.shouldFetchCategoryList) {
      yield put(Actions.loadCategoryListRequest());
      yield take(Actions.loadCategoryListSuccess.getType());
    }
    if (payload.shouldInitializeCategoryId) {
      yield put(Actions.initializeCategoryId());
    }
  }
}

export function* watchInitializeCategoryId() {
  while (true) {
    yield take(Actions.initializeCategoryId.getType());
    const state: RidiSelectState = yield select(s => s);
    const idFromLocalStorage = localStorageManager.load().lastVisitedCategoryId;

    const categoryId =
      ((state.categories.itemList || [])
        .map((category: Category) => category.id)
        .includes(idFromLocalStorage) &&
        idFromLocalStorage) ||
      state.categories.itemList[0].id;

    const parsedQueryString = qs.parse(state.router.location.search, { ignoreQueryPrefix: true });

    yield put(
      replace({
        ...state.router.location,
        search: qs.stringify({
          ...parsedQueryString,
          id: categoryId,
        }),
      }),
    );

    yield put(Actions.cacheCategoryId({ categoryId }));
  }
}

export function* watchCacheCategoryId() {
  while (true) {
    const { categoryId } = yield take(Actions.cacheCategoryId.getType());
    localStorageManager.save({ lastVisitedCategoryId: categoryId });
  }
}

export function* loadCategoryBooks({
  payload,
}: ReturnType<typeof Actions.loadCategoryBooksRequest>) {
  const { page, categoryId } = payload;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: CategoryBooksResponse = yield call(requestCategoryBooks, categoryId, page);
    yield put(BookActions.updateBooks({ books: response.books }));
    yield put(Actions.loadCategoryBooksSuccess({ categoryId, page, response }));
  } catch (error) {
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
      return;
    }
    yield put(Actions.loadCategoryBooksFailure({ categoryId, page, error }));
  }
}

export function* watchLoadCategoryBooks() {
  yield takeEvery(Actions.loadCategoryBooksRequest.getType(), loadCategoryBooks);
}

export function* watchCategoryBooksFailure() {
  while (true) {
    const {
      payload: { page, error },
    }: ReturnType<typeof Actions.loadCategoryBooksFailure> = yield take(
      Actions.loadCategoryBooksFailure.getType(),
    );
    if (page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      return;
    }
    fixWrongPaginationScope(error.response);
  }
}

export function* categoryRootSaga() {
  yield all([
    watchLoadCategoryListRequest(),
    watchCategoryBooksFailure(),
    watchInitializeCategoryId(),
    watchInitializeWhole(),
    watchCacheCategoryId(),
    watchLoadCategoryBooks(),
  ]);
}
