import { Actions as BookActions , Book } from 'app/services/book';

import { Actions as CollectionActions } from 'app/services/collection';
import { CollectionResponse } from 'app/services/collection/requests';
import { Actions } from 'app/services/home';
import { HomeResponse, requestHome } from 'app/services/home/requests';
import { RidiSelectState } from 'app/store';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, select, take } from 'redux-saga/effects';
import { getIsIosInApp } from '../environment/selectors';
import { ErrorStatus } from './../../constants/index';

export function* watchLoadHome() {
  while (true) {
    yield take(Actions.loadHomeRequest.getType());
    try {
      const response: HomeResponse = yield call(requestHome);
      const state: RidiSelectState = yield select((s) => s);

      // This array might have duplicated book item
      const books = response.collections.reduce((concatedBooks: Book[], section) => concatedBooks.concat(section.books), []);
      yield put(BookActions.updateBooks({ books }));
      const collections = response.collections.map((section): CollectionResponse => ({
        type: section.type,
        collectionId: section.collectionId,
        title: section.title,
        books: section.books,
        totalCount: 0, // TODO: Ask @minQ
      }));
      yield put(CollectionActions.updateCollections({ collections }));
      yield put(Actions.loadHomeSuccess({
        response,
        fetchedAt: Date.now(),
        isIosInApp: getIsIosInApp(state),
      }));
    } catch (e) {
      const { data } = e.response;
      yield put(Actions.loadHomeFailure());
      if (data && data.status === ErrorStatus.MAINTENANCE) {
        return;
      }
      showMessageForRequestError(e);
    }
  }
}

export function* homeRootSaga() {
  yield all([
    watchLoadHome(),
  ]);
}
