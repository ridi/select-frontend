import { call, put, select, takeLatest, all } from 'redux-saga/effects';

import { Actions as BookActions, Book } from 'app/services/book';
import { Actions as CollectionActions, ReservedCollectionIds } from 'app/services/collection';
import { CollectionResponse } from 'app/services/collection/requests';
import { homeActions, CollectionId } from 'app/services/home';
import { HomeResponse, requestHome } from 'app/services/home/requests';
import showMessageForRequestError from 'app/utils/toastHelper';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { ErrorStatus } from 'app/constants/index';
import { isRidiselectUrl } from 'app/utils/regexHelper';

const getCollectionIdList = (collections: CollectionResponse[]) => {
  const collectionIdList: CollectionId[] = collections.map(collection => collection.collectionId);
  // 별점 베스트, 인기도서 콜렉션을 임의의 순서로 추가
  collectionIdList.unshift(ReservedCollectionIds.SPOTLIGHT);
  collectionIdList.splice(3, 0, ReservedCollectionIds.POPULAR);
  return collectionIdList;
};

export function* watchLoadHome() {
  try {
    const { collections, banners }: HomeResponse = yield call(requestHome);
    const books = collections.reduce(
      (concatedBooks: Book[], section) => concatedBooks.concat(section.books),
      [],
    );
    const isIosInApp: boolean = yield select(getIsIosInApp);
    const bigBannerList = isIosInApp
      ? banners.filter(banner => isRidiselectUrl(banner.linkUrl))
      : banners;

    yield all([
      put(BookActions.updateBooks({ books })),
      put(CollectionActions.updateCollections({ collections })),
      put(
        homeActions.loadHomeSuccess({
          fetchedAt: Date.now(),
          bigBannerList,
          collectionIdList: getCollectionIdList(collections),
        }),
      ),
    ]);
  } catch (error) {
    const { data } = error.response;
    yield put(homeActions.loadHomeFailure());
    if (data && data.status === ErrorStatus.MAINTENANCE) {
      return;
    }
    showMessageForRequestError(error);
  }
}

export function* homeRootSaga() {
  yield takeLatest(homeActions.loadHomeRequest.type, watchLoadHome);
}
