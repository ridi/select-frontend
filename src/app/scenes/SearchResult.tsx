import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import * as qs from 'qs';
import MediaQuery from 'react-responsive';

import { Pagination } from 'app/components/Pagination';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

import { BookState } from 'app/services/book';
import { Actions as CommonUIActions, GNBSearchActiveType } from 'app/services/commonUI';

import { EnvironmentState } from 'app/services/environment';
import { Actions as SearchResultActions, SearchResultBook, SearchResultState } from 'app/services/searchResult';
import { SearchResultBookList } from 'app/services/searchResult/components/SearchResultBookList';

import { Button, Icon } from '@ridi/rsg';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';

interface SearchResultStateProps {
  books: BookState;
  searchResult: SearchResultState;
  environment: EnvironmentState;
  page: number;
}

type OwnProps = RouteComponentProps;
type Props = SearchResultStateProps & ReturnType<typeof mapDispatchToProps> & OwnProps;

interface QueryString {
  'q'?: string;
}

interface State {
  query: string;
}

export class SearchResult extends React.Component<Props, State> {
  private unlistenToHistory: () => void;

  public state: State = {
    query: '',
  };

  private isListExist(list: any[]) {
    return list && list.length > 0;
  }

  private renderEmpty() {
    const { query } = this.state;

    return (
      <div className="SearchResult_EmptyWrapper">
        <div className="EmptyIcon">
          <Icon
            name="search"
            className="SearchResult_EmptyIcon"
          />
        </div>
        <h3 className="SearchResult_EmptyTitle">
          {`'`}<strong>{query}</strong>{`'에 대한 검색결과가 없습니다.`}
        </h3>
      </div>
    );
  }

  private isFetched = (page: number) => {
    const { searchResult } = this.props;
    const { query } = this.state;

    return (
      searchResult[query] &&
      searchResult[query].itemListByPage[page] &&
      searchResult[query].itemListByPage[page].isFetched
    );
  }

  public componentWillMount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.block);
    const queryString: QueryString = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    this.unlistenToHistory = this.props.history.listen((location) => {
      const newQueryString = qs.parse(location.search, { ignoreQueryPrefix: true });
      if (this.state.query !== newQueryString.q) {
        this.setState({ query: newQueryString.q });
      }
    });
    this.setState({ query: queryString.q || '' });
  }

  public componentDidMount() {
    const { dispatchRequestSearchResult, page } = this.props;
    const { query } = this.state;
    if (!this.isFetched(page)) {
      dispatchRequestSearchResult(query, page);
    }
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page) {
      const { dispatchRequestSearchResult, page } = nextProps;
      const { query } = this.state;

      if (!this.isFetched(page)) {
        dispatchRequestSearchResult(query, page);
      }
    }
    return true;
  }

  public componentWillUnmount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.cover);
    this.unlistenToHistory();
  }

  public render() {
    const { books, searchResult, page, environment } = this.props;
    const { query } = this.state;

    const itemCount: any = searchResult[query] ? searchResult[query].itemCount : undefined;
    const itemCountPerPage: number = 24;

    return (
      <main className="SceneWrapper PageSearchResult">
        <Helmet title={!!query ? `'${query}' 검색 결과 - 리디셀렉트` : '리디셀렉트'} />
        <h1 className="a11y">{`'`}<strong>{query}</strong>{`'에 대한 도서 검색 결과`}</h1>
        {(
            !this.isFetched(page) || isNaN(page)
        ) ? (
          <LandscapeBookListSkeleton />
        ) : (
          this.isListExist(searchResult[query].itemListByPage[page].itemList) ? (
            <>
              <p className="PageSearchResult_Title">
                {`'`}<strong>{query}</strong>{`'에 대한 도서 검색 결과`}
              </p>
              <SearchResultBookList
                keyword={query}
                books={searchResult[query].itemListByPage[page].itemList.map((item): SearchResultBook => {
                  return {
                    ...books[item.bookId].book!,
                    highlight: item.highlight,
                    publisher: item.publisher,
                  };
                })}
              />
              {!isNaN(itemCount) && itemCount > 0 && <MediaQuery maxWidth={840}>
                {
                  (isMobile) => <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(itemCount / itemCountPerPage)}
                    isMobile={isMobile}
                    item={{
                      el: Link,
                      getProps: (p): LinkProps => ({
                        to: `/search?q=${query}&page=${p}`,
                      }),
                    }}
                  />
                }
              </MediaQuery>}
            </>
          ) : this.renderEmpty()
        )}
        {
          !environment.platform.isRidibooks &&
          <Button
            color="blue"
            outline={true}
            component="a"
            href={`${environment.STORE_URL}/search?q=${encodeURIComponent(query)}`}
            className="PageSearchResult_RidibooksResult"
            size="large"
          >
            리디북스 검색 결과 보기
            <Icon
              name="arrow_5_right"
              className="PageSearchResult_RidibooksResultIcon"
            />
          </Button>
        }
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): SearchResultStateProps => {
  return {
    books: rootState.booksById,
    searchResult: rootState.searchResult,
    environment: rootState.environment,
    page: getPageQuery(rootState),
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchRequestSearchResult: (keyword: string, page: number) =>
      dispatch(SearchResultActions.queryKeywordRequest({ keyword, page })),
    dispatchUpdateGNBSearchActiveType: (type: GNBSearchActiveType) =>
      dispatch(CommonUIActions.updateSearchActiveType({ gnbSearchActiveType: type })),
  };
};
export const ConnectedSearchResult = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchResult),
);
