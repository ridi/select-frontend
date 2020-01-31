import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { ConnectedGridBookList, ConnectedPageHeader, HelmetWithTitle, Pagination } from 'app/components';
import { MAX_WIDTH } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, DefaultCollectionState } from 'app/services/collection';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { collectionToPath } from 'app/utils/toPath';
import classNames from 'classnames';

interface CollectionStateProps {
  books: BookState;
  collection: DefaultCollectionState;
  collectionId: number;
  page: number;
}

interface CollectionDispatchProps {
  dispatchLoadCollection: (collectionId: number, page: number) => ReturnType<typeof Actions.loadCollectionRequest>;
}
interface State {
  isInitialized: boolean;
}

type RouteProps = RouteComponentProps<{
  collectionId: string;
}>;
type OwnProps = RouteProps;
type Props = CollectionStateProps & CollectionDispatchProps & OwnProps;

export class Collection extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  private isFetched = (page: number) => {
    const { collection } = this.props;
    return (collection && collection.itemListByPage[page] && collection.itemListByPage[page].isFetched);
  }
  public componentDidMount() {
    const { collectionId, page, dispatchLoadCollection } = this.props;

    this.initialDispatchTimeout = window.setTimeout(() => {

      if (!this.isFetched(page)) {
        dispatchLoadCollection(collectionId, page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props) {
    const { collectionId } = nextProps;

    if (nextProps.page !== this.props.page ||
      nextProps.collectionId !== this.props.collectionId
    ) {
      const { dispatchLoadCollection, page } = nextProps;
      if (!this.isFetched(page)) {
        dispatchLoadCollection(collectionId, page);
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
    const { books, collection, collectionId, page } = this.props;

    const itemCount: any  = collection ? collection.itemCount : 0;
    const itemCountPerPage = 24;

    return (
      <main className="SceneWrapper">
        <HelmetWithTitle
          titleName={!!collection ? collection.title : null}
        />
        {!!collection && <ConnectedPageHeader pageTitle={collection.title} />}
        {!this.isFetched(page) || isNaN(page)
          ? <GridBookListSkeleton />
          :
          <>
            <ConnectedGridBookList
              serviceTitleForTracking="select-book"
              pageTitleForTracking="collection"
              uiPartTitleForTracking="book-list"
              miscTracking={JSON.stringify({ sect_collection_id: collection.id, sect_page: page })}
              books={collection.itemListByPage[page].itemList.map((id) => books[id].book!)}
            />
            {!isNaN(itemCount) && itemCount > 0 && <MediaQuery maxWidth={MAX_WIDTH}>
              {
                (isMobile) => <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(itemCount / itemCountPerPage)}
                  isMobile={isMobile}
                  item={{
                    el: Link,
                    getProps: (p): LinkProps => ({
                      to: `${collectionToPath({ collectionId })}?page=${p}`,
                    }),
                  }}
                />
              }
            </MediaQuery>}
          </>
        }
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState, ownProps: OwnProps): CollectionStateProps => ({
  books: rootState.booksById,
  collection: rootState.collectionsById[Number(ownProps.match.params.collectionId)],
  collectionId: Number(ownProps.match.params.collectionId),
  page: getPageQuery(rootState),
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLoadCollection: (collectionId: number, page: number) => dispatch(Actions.loadCollectionRequest({ collectionId, page })),
});
export const ConnectedCollection = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Collection),
);
