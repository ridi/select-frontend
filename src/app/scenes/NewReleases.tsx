import { ConnectedGridBookList, PCPageHeader } from 'app/components';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, ReservedCollectionState } from 'app/services/collection';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

interface CollectionStateProps {
  newReleases: ReservedCollectionState;
  books: BookState;
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

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const { dispatchLoadNewReleases, newReleases } = this.props;
      if (!(newReleases && newReleases.itemListByPage[0] && newReleases.itemListByPage[0].isFetched)) {
        dispatchLoadNewReleases(0);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    const { dispatchLoadNewReleases, newReleases, books } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet title="최신 업데이트 - 리디셀렉트" />
        <PCPageHeader pageTitle="최신 업데이트" />
        {(
          !this.state.isInitialized
        ) ? (
          <GridBookListSkeleton />
        ) : (
          <>
            <ConnectedGridBookList
              pageTitleForTracking="recent"
              books={newReleases.itemListByPage[0].itemList.map((id) => books[id].book!)}
            />
          </>
          // <ConnectedGridBookList
          //   pageTitleForTracking="recent"
          //   books={newReleases.itemListByPage[page].itemList.map((id) => books[id].book!)}
          // />
          // <ConnectedListWithPagination />
          // <ConnectedListWithPagination
          //   isFetched={(page) =>
          //     newReleases &&
          //     newReleases.itemListByPage[page] &&
          //     newReleases.itemListByPage[page].isFetched
          //   }
          //   fetch={(page) => dispatchLoadNewReleases(page)}
          //   itemCount={newReleases ? newReleases.itemCount : undefined}
          //   buildPaginationURL={(page: number) => `/new-releases?page=${page}`}
          //   renderPlaceholder={() => (<GridBookListSkeleton />)}
          //   renderItems={(page) => (
          //     <ConnectedGridBookList
          //       pageTitleForTracking="recent"
          //       books={newReleases.itemListByPage[page].itemList.map((id) => books[id].book!)}
          //     />
          //   )}
          // />
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CollectionStateProps => {
  return {
    newReleases: rootState.collectionsById.recent,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any): CollectionDispatchProps => {
  return {
    dispatchLoadNewReleases: (page: number) => dispatch(Actions.loadCollectionRequest({ collectionId: 'recent', page })),
  };
};
export const ConnectedNewReleases = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewReleases),
);

export default ConnectedNewReleases;
