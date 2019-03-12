import * as React from 'react';
import { connect } from 'react-redux';

import { DTOBookThumbnail } from 'app/components';
import { ThumbnailSize } from 'app/components/BookThumbnail';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Book, BookState } from 'app/services/book';
import { Actions, ReservedCollectionState } from 'app/services/collection';
import { RidiSelectState } from 'app/store';
import MediaQuery from 'react-responsive';

interface BookListPreviewStateProps {
  availableBooks: ReservedCollectionState;
  books: BookState;
}

type Props = BookListPreviewStateProps & ReturnType<typeof mapDispatchToProps>;

export class BookListPreview extends React.Component<Props> {
  private isFetched() {
    const { availableBooks } = this.props;
    return availableBooks &&
      availableBooks.itemListByPage[1] &&
      availableBooks.itemListByPage[1].isFetched;
  }

  private renderBook(width: ThumbnailSize, book: Book) {
    return (
      <div style={{ width }}>
        <DTOBookThumbnail
          book={book}
          width={width}
          sizeWrapperClassName="GridBookList_ItemThumbnail"
        />
        <div className="GridBookList_ItemLink">
          <h3 className="GridBookList_ItemTitle">{book.title.main}</h3>
        </div>
      </div>
    );
  }

  private renderBookList() {
    const { availableBooks, books } = this.props;
    const targetBooks = availableBooks.itemListByPage[1].itemList.map((id) => books[id].book!);
    return (
      <ul className="GridBookList">
        {targetBooks.map((book) => (
          <li className="GridBookList_Item" key={book.id}>
            <MediaQuery maxWidth={359}>
              {this.renderBook(90, book)}
            </MediaQuery>
            <MediaQuery minWidth={360} maxWidth={413}>
              {this.renderBook(100, book)}
            </MediaQuery>
            <MediaQuery minWidth={414} maxWidth={767}>
              {this.renderBook(116, book)}
            </MediaQuery>
            <MediaQuery minWidth={768}>
              {this.renderBook(120, book)}
            </MediaQuery>
          </li>
        ))}
      </ul>
    );
  }

  public componentDidMount() {
    const { dispatchLoadAvailableBooks } = this.props;
    if (this.isFetched()) { return; }
    dispatchLoadAvailableBooks();
  }

  public render() {
    return (
      <section>
        {this.isFetched() ?
          this.renderBookList() :
          <GridBookListSkeleton />
        }
      </section>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): BookListPreviewStateProps => {
  return {
    availableBooks: rootState.collectionsById.popular,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadAvailableBooks: () => dispatch(Actions.loadCollectionRequest({ collectionId: 'popular', page: 1 })),
  };
};
export const ConnectedBookListPreview = connect(mapStateToProps, mapDispatchToProps)(BookListPreview);
