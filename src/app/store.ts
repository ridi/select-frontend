import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import isEmpty from 'lodash-es/isEmpty';
import * as qs from 'qs';
import { Dispatch, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import browserHistory from 'app/config/history';
import { appReducer, AppState } from 'app/services/app';
import { watchAppState } from 'app/services/app/sagas';
import { bookReducer, BookState } from 'app/services/book';
import { bookRootSaga } from 'app/services/book/sagas';
import { commonUIReducer, CommonUIState } from 'app/services/commonUI';
import { homeReducer } from 'app/services/home';
import { HomeState } from 'app/services/home/states';
import { homeRootSaga } from 'app/services/home/sagas';
import { userRootSaga } from 'app/services/user/sagas';
import { channelRootSaga } from 'app/services/articleChannel/sagas';
import { articleHomeRootSaga } from 'app/services/articleHome/sagas';
import { favoriteArticleListReducer, FavoriteArticleListState } from 'app/services/articleFavorite';
import { articleFavoriteRootSaga } from 'app/services/articleFavorite/sagas';
import { articleReducer, ArticlesState } from 'app/services/article';
import { articleRootSaga } from 'app/services/article/sagas';
import { ArticleFollowingState, articleFollowReducer } from 'app/services/articleFollowing';
import { articleFollowingRootSaga } from 'app/services/articleFollowing/sagas';
import {
  categoryBooksReducer,
  CategoryBooksState,
  categoryListReducer,
  CategoryListState,
} from 'app/services/category';
import { categoryRootSaga } from 'app/services/category/sagas';
import {
  ClosingReservedBooksState,
  closingReservedBooksReducer,
} from 'app/services/closingReservedBooks/index';
import { closingReservedBooksRootSaga } from 'app/services/closingReservedBooks/sagas';
import { collectionReducer, CollectionsState } from 'app/services/collection';
import { collectionsRootSaga } from 'app/services/collection/sagas';
import { environmentReducer, EnvironmentState } from 'app/services/environment';
import { MySelectState, mySelectReducer } from 'app/services/mySelect';
import { mySelectRootSaga } from 'app/services/mySelect/sagas';
import { reviewsReducer, ReviewsState } from 'app/services/review';
import { reviewRootSaga } from 'app/services/review/sagas';
import { searchResultReducer, SearchResultState } from 'app/services/searchResult';
import { searchResultRootSaga } from 'app/services/searchResult/sagas';
import { serviceStatusReducer, ServiceStatusState } from 'app/services/serviceStatus';
import { serviceStatusSaga } from 'app/services/serviceStatus/sagas';
import { trackingSaga } from 'app/services/tracking/sagas';
import { voucherRootSaga } from 'app/services/voucher/sagas';
import env from 'app/config/env';
import {
  customHistoryReducer,
  customHistorySaga,
  CustomHistoryState,
} from 'app/services/customHistory';
import { downloadSaga } from 'app/services/download/sagas';
import { userReducer, UserState } from 'app/services/user';
import { stateHydrator } from 'app/utils/stateHydrator';
import { articleHomeReducer, ArticleHomeState } from 'app/services/articleHome';
import {
  articleChannelListReducer,
  ArticleChannelListState,
  articleChannelReducer,
  ArticleChannelState,
} from 'app/services/articleChannel';

import { articleListRootSaga } from './services/articleList/sagas';
import { articleListReducer, ArticleListState } from './services/articleList/index';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

function* rootSaga(dispatch: Dispatch) {
  yield all([
    watchAppState(),
    homeRootSaga(),
    bookRootSaga(),
    reviewRootSaga(dispatch),
    userRootSaga(),
    collectionsRootSaga(),
    categoryRootSaga(),
    searchResultRootSaga(),
    mySelectRootSaga(),
    trackingSaga(),
    downloadSaga(),
    customHistorySaga(),
    closingReservedBooksRootSaga(),
    serviceStatusSaga(),
    voucherRootSaga(),
    articleRootSaga(),
    articleHomeRootSaga(),
    channelRootSaga(),
    articleFollowingRootSaga(),
    articleFavoriteRootSaga(),
    articleListRootSaga(),
  ]);
}

export interface RidiSelectState {
  router: RouterState;
  app: AppState;
  user: UserState;
  home: HomeState;
  booksById: BookState;
  collectionsById: CollectionsState;
  commonUI: CommonUIState;
  reviewsByBookId: ReviewsState;
  categories: CategoryListState;
  categoriesById: CategoryBooksState;
  searchResult: SearchResultState;
  mySelect: MySelectState;
  serviceStatus: ServiceStatusState;
  environment: EnvironmentState;
  customHistory: CustomHistoryState;
  closingReservedBooks: ClosingReservedBooksState;
  articlesById: ArticlesState;
  articleHome: ArticleHomeState;
  articleList: ArticleListState;
  articleChannels: ArticleChannelListState;
  articleChannelById: ArticleChannelState;
  articleFollowing: ArticleFollowingState;
  favoriteArticle: FavoriteArticleListState;
}

const sagaMiddleware = createSagaMiddleware();

export const hasRefreshedForAppDownload = () =>
  !!qs.parse(location.search, { ignoreQueryPrefix: true }).to_app_store;
export const hasCompletedRidiPaySubscription = () =>
  !!qs.parse(location.search, { ignoreQueryPrefix: true }).new_subscription;
export const hasCompletedPayletterSubscription = () =>
  !!qs.parse(location.search, { ignoreQueryPrefix: true }).new_payletter_subscription;

const reducers = combineReducers({
  router: connectRouter(browserHistory),
  app: appReducer,
  user: userReducer,
  home: homeReducer,
  booksById: bookReducer,
  collectionsById: collectionReducer,
  commonUI: commonUIReducer,
  reviewsByBookId: reviewsReducer,
  categories: categoryListReducer,
  categoriesById: categoryBooksReducer,
  searchResult: searchResultReducer,
  mySelect: mySelectReducer,
  serviceStatus: serviceStatusReducer,
  environment: environmentReducer,
  customHistory: customHistoryReducer,
  closingReservedBooks: closingReservedBooksReducer,

  articlesById: articleReducer,
  articleHome: articleHomeReducer,
  articleList: articleListReducer,
  articleChannels: articleChannelListReducer,
  articleChannelById: articleChannelReducer,
  articleFollowing: articleFollowReducer,
  favoriteArticle: favoriteArticleListReducer,
});

const middleware = [routerMiddleware(browserHistory), sagaMiddleware];

const enhancers = (!env.production
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose)(applyMiddleware(...middleware));

const savedState = stateHydrator.load();
export const store =
  hasRefreshedForAppDownload() && !isEmpty(savedState)
    ? createStore(reducers, savedState, enhancers)
    : createStore(reducers, enhancers);

sagaMiddleware.run(rootSaga, store.dispatch);
