import { all, call, put, take, takeEvery } from 'redux-saga/effects';

import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { Actions as ArticleActions } from 'app/services/article';
import { Article } from 'app/services/article';
import { Actions as BookActions } from 'app/services/book';
import { Book } from 'app/services/book';
import { Actions, SearchResultArticle, SearchResultBook } from 'app/services/searchResult';

import { requestArticles } from 'app/services/article/requests';
import { requestBooks } from 'app/services/book/requests';
import { keyBy } from 'lodash-es';

import { PublicSearchResultReponse, requestSearchResult, SearchResultResponse } from 'app/services/searchResult/requests';
import { fixWrongPaginationScope, isValidPaginationParameter, updateQueryStringParam } from 'app/utils/request';
import toast from 'app/utils/toast';

export function* queryKeyword({ payload }: ReturnType<typeof Actions.queryKeywordRequest>) {
  const { page, keyword, type } = payload;
  let response: PublicSearchResultReponse;
  try {
    if (!isValidPaginationParameter(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    response = yield call(requestSearchResult, keyword, type, page);
    const searchResultResponse: SearchResultResponse = {
      totalCount: response.total,
      size: 24,
    };
    if (type === 'book') {
      const books: Book[] = yield call(requestBooks, response.books.map((book) => parseInt(String(book.bId), 10)));
      const booksMap = keyBy(books, 'id');
      yield put(BookActions.updateBooks({ books }));
      const searchResultBooks: SearchResultBook[] = response.books.map((book) => {
        const searchResultBook: SearchResultBook = booksMap[book.bId] as SearchResultBook;
        searchResultBook.highlight = book.highlight;
        searchResultBook.publisher = { name: book.publisher };
        return searchResultBook;
      });
      searchResultResponse.books = searchResultBooks;
    } else {
      const articlesResponse = yield call(requestArticles, undefined , response.articles.map((article) => (article.id)));
      const articles: Article[] = articlesResponse.results;
      const articlesMap = keyBy(articles, 'id');
      yield put(ArticleActions.updateArticles({ articles }));
      const searchResultArticles: SearchResultArticle[] = response.articles.map((article) => {
        const searchResultArticle: SearchResultArticle = articlesMap[article.id] as SearchResultArticle;
        searchResultArticle.highlight = article.highlight;
        return searchResultArticle;
      });
      searchResultResponse.articles = searchResultArticles;
    }
    yield put(Actions.queryKeywordSuccess({ keyword, page, type, response: searchResultResponse }));

  } catch (error) {
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
      return;
    }
    yield put(Actions.queryKeywordFailure({ keyword, page, error, type }));
  }
}

export function* watchCategoryBooksFailure() {
  while (true) {
    const { payload: { page, error } }: ReturnType<typeof Actions.queryKeywordFailure> = yield take(Actions.queryKeywordFailure.getType());
    if (page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      return;
    }
    fixWrongPaginationScope(error.response);
  }
}

export function* watchQueryKeyword() {
  yield takeEvery(Actions.queryKeywordRequest.getType(), queryKeyword);
}

export function* searchResultRootSaga() {
  yield all([
    watchQueryKeyword(),
    watchCategoryBooksFailure(),
  ]);
}
