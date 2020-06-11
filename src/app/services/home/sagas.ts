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
    // 홈 화면에서 현재 셀렉트 백엔드에서 내려주는 Home API의 섹션 리스트를 이용하여 렌더링을 자동화 처리를 해둔 상황에서 중간에 static한 위치에
    // 데이터팀의 인기 도서 API의 응답 데이터를 활용해야하는 상황이라서 collection id list의 3번째 포지션에 임의로 인기도서 섹션에 해당하는 id를 넣어주는 처리.
    // TODO: 후에 홈 화면의 섹션 렌더링 방식을 개선하면서 이렇게 부분적으로 처리하는 것을 어떻게 줄일지 고민 필요.
    collectionIdList.splice(2, 0, ReservedCollectionIds.POPULAR);
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
