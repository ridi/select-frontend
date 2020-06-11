import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link, LinkProps } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';

import { GridBookList, ConnectedPageHeader, HelmetWithTitle, Pagination } from 'app/components';
import { RidiSelectState } from 'app/store';
import { BookState } from 'app/services/book';
import { getPageQuery } from 'app/services/routing/selectors';
import { Actions, ChartCollectionState } from 'app/services/collection';
import { PageTitleText, COUNT_PER_PAGE } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

interface CollectionStateProps {
  collection: ChartCollectionState;
  books: BookState;
  page: number;
}

interface CollectionDispatchProps {
  dispatchLoadCharts: (
    page: number,
    userGroup?: number,
  ) => ReturnType<typeof Actions.loadCollectionRequest>;
}
interface State {
  isInitialized: boolean;
}

type RouteProps = RouteComponentProps<{}>;
type Props = CollectionStateProps & CollectionDispatchProps & RouteProps;

export class Charts extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;

  public state: State = {
    isInitialized: false,
  };

  private isFetched = (page: number) => {
    const { collection } = this.props;
    return (
      collection && collection.itemListByPage[page] && collection.itemListByPage[page].isFetched
    );
  };

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const { dispatchLoadCharts, page } = this.props;
      if (!this.isFetched(page)) {
        dispatchLoadCharts(page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page) {
      const { dispatchLoadCharts, page } = nextProps;

      if (!this.isFetched(page)) {
        dispatchLoadCharts(page);
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
    const { collection, books, page } = this.props;
    const itemCount: number = collection.itemCount ? collection.itemCount : 0;

    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.CHARTS} />
        <ConnectedPageHeader pageTitle={PageTitleText.CHARTS} />
        {!this.isFetched(page) || isNaN(page) ? (
          <GridBookListSkeleton displayRanking />
        ) : (
          <>
            <GridBookList
              serviceTitleForTracking="select-book"
              pageTitleForTracking="popular"
              uiPartTitleForTracking="book-list"
              miscTracking={JSON.stringify({ sect_page: page })}
              books={collection.itemListByPage[page].itemList.map(id => books[id].book!)}
              isChart
              page={page}
            />
            {itemCount > 0 && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(itemCount / COUNT_PER_PAGE)}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `/charts?page=${p}`,
                  }),
                }}
              />
            )}
          </>
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CollectionStateProps => ({
  collection: rootState.collectionsById.popularBooks,
  books: rootState.booksById,
  page: getPageQuery(rootState),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLoadCharts: (page: number, userGroup?: number) =>
    dispatch(Actions.loadPopularBooksRequest({ userGroup, page })),
});
export const ConnectedCharts = withRouter(connect(mapStateToProps, mapDispatchToProps)(Charts));

export default ConnectedCharts;
