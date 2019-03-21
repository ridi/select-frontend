import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { ConnectedGridBookList, ConnectedPageHeader } from 'app/components';
import { Pagination } from 'app/components/Pagination';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

import { BookState } from 'app/services/book';
import { Actions, ReservedCollectionState } from 'app/services/collection';
import { getPageQuery } from 'app/services/routing/selectors';

import { RidiSelectState } from 'app/store';

interface CollectionStateProps {
  availableBooks: ReservedCollectionState;
  books: BookState;
  page: number;
}

interface CollectionDispatchProps {
  dispatchLoadAvailableBooks: (page: number) => ReturnType<typeof Actions.loadCollectionRequest>;
}

type RouteProps = RouteComponentProps<{}>;
type Props = CollectionStateProps & RouteProps & ReturnType<typeof mapDispatchToProps>;

interface State {
  isInitialized: boolean;
}

export class AvailableBooks extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  private isFetched = (page: number) => {
    const { availableBooks } = this.props;
    return (availableBooks && availableBooks.itemListByPage[page] && availableBooks.itemListByPage[page].isFetched);
  }

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const { dispatchLoadAvailableBooks, page } = this.props;
      if (!this.isFetched(page)) {
        dispatchLoadAvailableBooks(page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page) {
      const { dispatchLoadAvailableBooks, page } = nextProps;

      if (!this.isFetched(page)) {
        dispatchLoadAvailableBooks(page);
      }
    }

    return true;
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    const { availableBooks, books, page } = this.props;
    const itemCount: number = availableBooks.itemCount ? availableBooks.itemCount : 0;
    const itemCountPerPage: number = 24;

    return (
      <main className="SceneWrapper">
        <Helmet title="서비스 도서 목록 - 리디셀렉트" />
        <ConnectedPageHeader pageTitle="서비스 도서 목록" />
        {(
          !this.state.isInitialized || !this.isFetched(page) || isNaN(page)
        ) ? (
          <GridBookListSkeleton />
        ) : (
        <>
          <ConnectedGridBookList
            pageTitleForTracking="available"
            books={availableBooks.itemListByPage[page].itemList.map((id) => books[id].book!)}
          />
          {itemCount > 0 && <MediaQuery maxWidth={840}>
            {
              (isMobile) => <Pagination
                currentPage={page}
                totalPages={Math.ceil(itemCount / itemCountPerPage)}
                isMobile={isMobile}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `/books?page=${p}`,
                  }),
                }}
              />
            }
          </MediaQuery>}
        </>
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CollectionStateProps => {
  return {
    availableBooks: rootState.collectionsById.popular,
    books: rootState.booksById,
    page: getPageQuery(rootState),
  };
};
const mapDispatchToProps = (dispatch: Dispatch): CollectionDispatchProps => {
  return {
    dispatchLoadAvailableBooks: (page: number) => dispatch(Actions.loadCollectionRequest({ collectionId: 'popular', page })),
  };
};
export const ConnectedAvailableBooks = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AvailableBooks),
);
