import { Button, Icon } from '@ridi/rsg';
import { HelmetWithTitle, Pagination } from 'app/components';
import { SearchResultArticleList } from 'app/components/SearchResult/SearchResultArticleList';
import { ConnectedSearchResultBookList } from 'app/components/SearchResult/SearchResultBookList';
import { MAX_WIDTH } from 'app/constants';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { AppStatus } from 'app/services/app';
import { ArticlesState } from 'app/services/article';
import { BookState } from 'app/services/book';
import { Actions as CommonUIActions, GNBSearchActiveType } from 'app/services/commonUI';
import { EnvironmentState } from 'app/services/environment';
import { getPageQuery } from 'app/services/routing/selectors';
import {
  Actions as SearchResultActions,
  SearchResultArticle,
  SearchResultBook,
  SearchResultState,
} from 'app/services/searchResult';
import { RidiSelectState } from 'app/store';
import classNames from 'classnames';
import * as qs from 'qs';
import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

interface SearchResultStateProps {
  books: BookState;
  articles: ArticlesState;
  searchResult: SearchResultState;
  environment: EnvironmentState;
  page: number;
  appStatus: AppStatus;
}

type OwnProps = RouteComponentProps;
type Props = SearchResultStateProps & ReturnType<typeof mapDispatchToProps> & OwnProps;

interface QueryString {
  q?: string;
  type?: string;
}

interface State {
  query: string;
  type: string;
}

class SearchResult extends React.Component<Props, State> {
  private unlistenToHistory: () => void;

  public state: State = {
    query: '',
    type: 'books',
  };

  private isListExist(list: any[]) {
    return list && list.length > 0;
  }

  private renderEmpty() {
    const { query, type } = this.state;
    const searchType = type === 'books' ? '도서' : '아티클';

    return (
      <div className="SearchResult_EmptyWrapper">
        <div className="EmptyIcon">
          <Icon name="search" className="SearchResult_EmptyIcon" />
        </div>
        <h3 className="SearchResult_EmptyTitle">
          '<strong>{query}</strong>
          {`'에 대한 ${searchType} 검색결과가 없습니다.`}
        </h3>
      </div>
    );
  }

  private isFetched = (query: string, page: number) => {
    const { searchResult, appStatus } = this.props;
    const appType = appStatus === AppStatus.Books ? 'books' : 'articles';
    return (
      searchResult[appType][query] &&
      searchResult[appType][query].itemListByPage[page] &&
      searchResult[appType][query].itemListByPage[page].isFetched
    );
  };

  public UNSAFE_componentWillMount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.block);
    const queryString: QueryString = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    this.unlistenToHistory = this.props.history.listen(location => {
      const newQueryString = qs.parse(location.search, { ignoreQueryPrefix: true });
      if (this.state.query !== newQueryString.q) {
        this.setState({ query: newQueryString.q });
      }
    });
    this.setState({ query: queryString.q || '', type: queryString.type!.toLowerCase() || 'books' });
  }

  public componentDidMount() {
    const { dispatchRequestSearchResult, dispatchUpdateGNBTabExpose, page } = this.props;
    const { query, type } = this.state;
    if (!this.isFetched(query, page)) {
      dispatchRequestSearchResult(query, page, type.substring(0, type.length - 1));
    }
    dispatchUpdateGNBTabExpose(false);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { query } = this.state;
    const { query: nextQuery, type } = nextState;

    if (query !== nextQuery || nextProps.page !== this.props.page) {
      const { dispatchRequestSearchResult, page } = nextProps;

      if (!this.isFetched(nextQuery, page)) {
        dispatchRequestSearchResult(nextQuery, page, type.substring(0, type.length - 1));
      }
    }
    return true;
  }

  public componentWillUnmount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.cover);
    this.unlistenToHistory();
    this.props.dispatchUpdateGNBTabExpose(true);
  }

  public render() {
    const { books, articles, searchResult, page, environment, appStatus } = this.props;
    const { query, type } = this.state;

    let searchResultData;
    if (type === 'books') {
      searchResultData = searchResult.books;
    } else {
      searchResultData = searchResult.articles;
    }

    const itemCount: any = searchResultData[query] ? searchResultData[query].itemCount : undefined;
    const itemCountPerPage = 24;

    return (
      <main
        className={classNames(
          'SceneWrapper',
          'PageSearchResult',
          'SceneWrapper_WithGNB',
          'SceneWrapper_WithSearchBar',
        )}
      >
        <HelmetWithTitle titleName={query ? `'${query}' 검색 결과` : null} />
        <h1 className="a11y">
          '<strong>{query}</strong>
          '에 대한 검색 결과
        </h1>
        {!this.isFetched(query, page) || isNaN(page) ? (
          <LandscapeBookListSkeleton />
        ) : this.isListExist(searchResultData[query].itemListByPage[page].itemList) ? (
          <>
            {type === 'books' ? (
              <>
                <p className="PageSearchResult_Title">
                  '<strong>{query}</strong>
                  '에 대한 도서 검색 결과
                </p>
                <ConnectedSearchResultBookList
                  keyword={query}
                  books={searchResult.books[query].itemListByPage[page].itemList.map(
                    (item): SearchResultBook => ({
                      ...books[item.bookId].book!,
                      highlight: item.highlight,
                      publisher: item.publisher,
                    }),
                  )}
                />
              </>
            ) : (
              <>
                <p className="PageSearchResult_Title">
                  '<strong>{query}</strong>' 아티클 검색 결과
                </p>
                <SearchResultArticleList
                  keyword={query}
                  articles={searchResult.articles[query].itemListByPage[page].itemList.map(
                    (item): SearchResultArticle => ({
                      ...articles[item.contentKey].article!,
                      highlight: item.highlight,
                    }),
                  )}
                />
              </>
            )}
            {!isNaN(itemCount) && itemCount > 0 && (
              <MediaQuery maxWidth={MAX_WIDTH}>
                {isMobile => (
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(itemCount / itemCountPerPage)}
                    isMobile={isMobile}
                    item={{
                      el: Link,
                      getProps: (p): LinkProps => ({
                        to: `/search?q=${query}&page=${p}&type=${appStatus}`,
                      }),
                    }}
                  />
                )}
              </MediaQuery>
            )}
          </>
        ) : (
          this.renderEmpty()
        )}
        {!environment.platform.isRidibooks && type === 'books' && (
          <Button
            color="blue"
            outline
            component="a"
            href={`${environment.STORE_URL}/search?q=${encodeURIComponent(query)}`}
            className="PageSearchResult_RidibooksResult"
            size="large"
          >
            리디북스 검색 결과 보기
            <Icon name="arrow_5_right" className="PageSearchResult_RidibooksResultIcon" />
          </Button>
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): SearchResultStateProps => ({
  books: rootState.booksById,
  articles: rootState.articlesById,
  searchResult: rootState.searchResult,
  environment: rootState.environment,
  page: getPageQuery(rootState),
  appStatus: rootState.app.appStatus,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchRequestSearchResult: (keyword: string, page: number, type: string) =>
    dispatch(SearchResultActions.queryKeywordRequest({ keyword, page, type })),
  dispatchUpdateGNBSearchActiveType: (type: GNBSearchActiveType) =>
    dispatch(CommonUIActions.updateSearchActiveType({ gnbSearchActiveType: type })),
  dispatchUpdateGNBTabExpose: (isGnbTab: boolean) =>
    dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab })),
});
const ConnectedSearchResult = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchResult),
);

export default ConnectedSearchResult;
