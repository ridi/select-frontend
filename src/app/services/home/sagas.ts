import { call, put, select, takeLatest } from 'redux-saga/effects';

import { Actions as BookActions, Book } from 'app/services/book';
import { Actions as CollectionActions, ReservedCollectionIds } from 'app/services/collection';
import { CollectionResponse } from 'app/services/collection/requests';
import { homeActions, CollectionId } from 'app/services/home';
import { HomeResponse, requestHome } from 'app/services/home/requests';
import showMessageForRequestError from 'app/utils/toastHelper';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { ErrorStatus } from 'app/constants/index';
import { isRidiselectUrl } from 'app/utils/regexHelper';

export function* watchLoadHome() {
  try {
    const response: HomeResponse = yield call(requestHome);
    const collectionsWithoutPopular = response.collections.filter(
      collection => collection.collectionId !== 0,
    );
    const responseWithoutPopular = {
      ...response,
      collections: collectionsWithoutPopular,
    };

    // This array might have duplicated book item
    const books = collectionsWithoutPopular.reduce(
      (concatedBooks: Book[], section) => concatedBooks.concat(section.books),
      [],
    );
    yield put(BookActions.updateBooks({ books }));
    const collections = collectionsWithoutPopular.map(
      (section): CollectionResponse => ({
        type: section.type,
        collectionId: section.collectionId,
        title: section.title,
        books: section.books,
        totalCount: 0, // TODO: Ask @minQ
      }),
    );
    yield put(CollectionActions.updateCollections({ collections }));
    const isIosInApp: boolean = yield select(getIsIosInApp);
    const bigBannerList = isIosInApp
      ? responseWithoutPopular.banners.filter(banner => isRidiselectUrl(banner.linkUrl))
      : responseWithoutPopular.banners;
    const collectionIdList: CollectionId[] = responseWithoutPopular.collections.map(
      collection => collection.collectionId,
    );
    // 별점 베스트, 인기도서 콜렉션을 임의의 순서로 추가
    collectionIdList.unshift(ReservedCollectionIds.SPOTLIGHT);
    collectionIdList.splice(3, 0, ReservedCollectionIds.POPULAR);
    yield put(
      homeActions.loadHomeSuccess({
        fetchedAt: Date.now(),
        bigBannerList,
        collectionIdList,
      }),
    );
  } catch (e) {
    const { data } = e.response;
    yield put(homeActions.loadHomeFailure());
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(e);
  }
}

export function* homeRootSaga() {
  yield takeLatest(homeActions.loadHomeRequest.type, watchLoadHome);
}
