import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { ConnectedGridBookList, PCPageHeader } from 'app/components';
import { Pagination } from 'app/components/Pagination';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

import { BookState } from 'app/services/book';
import { Actions, ReservedCollectionState } from 'app/services/collection';
import { getPageQuery } from 'app/services/routing/selectors';

import { RidiSelectState } from 'app/store';

import { Pagination } from 'app/components/Pagination';
import { getPageQuery } from 'app/services/routing/selectors';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

interface CollectionStateProps {
  newReleases: ReservedCollectionState;
  books: BookState;
  page: number;
}

interface CollectionDispatchProps {
  dispatchLoadNewReleases: (page: number) => ReturnType<typeof Actions.loadCollectionRequest>;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps;
type Props = CollectionStateProps & CollectionDispatchProps & OwnProps;

interface State {
  isInitialized: boolean;
}

export class NewReleases extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  private isFetched = (page: number) => {
    const { newReleases } = this.props;
    return (newReleases && newReleases.itemListByPage[page] && newReleases.itemListByPage[page].isFetched);
  }

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const { dispatchLoadNewReleases, page } = this.props;
      if (!this.isFetched(page)) {
        dispatchLoadNewReleases(page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page) {
      const { dispatchLoadNewReleases, page } = nextProps;

      if (!this.isFetched(page)) {
        dispatchLoadNewReleases(page);
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
    const { newReleases, books, page } = this.props;
    const itemCount: number = newReleases.itemCount ? newReleases.itemCount : 0;
    const itemCountPerPage: number = 24;
    return (
      <main className="SceneWrapper">
        <Helmet title="최신 업데이트 - 리디셀렉트" />
        <PCPageHeader pageTitle="최신 업데이트" />
        {(
          !this.state.isInitialized || !this.isFetched(page) || isNaN(page)
        ) ? (
          <GridBookListSkeleton />
        ) : (
          <>
            <ConnectedGridBookList
              pageTitleForTracking="recent"
              books={newReleases.itemListByPage[page].itemList.map((id) => books[id].book!)}
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
                      to: `/new-releases?page=${p}`,
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
    newReleases: rootState.collectionsById.recent,
    books: rootState.booksById,
    page: getPageQuery(rootState),
  };
};
const mapDispatchToProps = (dispatch: Dispatch): CollectionDispatchProps => {
  return {
    dispatchLoadNewReleases: (page: number) => dispatch(Actions.loadCollectionRequest({ collectionId: 'recent', page })),
  };
};
export const ConnectedNewReleases = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewReleases),
);

export default ConnectedNewReleases;
