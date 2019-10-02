import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { Book } from 'app/services/book';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { stringifyAuthors } from 'app/utils/utils';
import { ThumbnailSize } from './BookThumbnail';

interface Props {
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  filterForTracking?: string;
  books: Book[];
  disableInlineOnPC?: boolean;
  lazyloadThumbnail?: boolean;
  renderAuthor?: boolean;
  bookThumbnailSize?: ThumbnailSize;
}

export const InlineHorizontalBookList: React.FunctionComponent<Props & ReturnType<typeof mapDispatchToProps>> = (props) => {
  const {
    pageTitleForTracking,
    uiPartTitleForTracking,
    filterForTracking,
    books,
    disableInlineOnPC,
    lazyloadThumbnail,
    trackClick,
    renderAuthor,
    bookThumbnailSize = 120,
  } = props;

  const section = !!pageTitleForTracking ? getSectionStringForTracking(pageTitleForTracking, uiPartTitleForTracking, filterForTracking) : undefined;
  return (
    <ul
      className={classNames([
        'InlineHorizontalBookList',
        disableInlineOnPC && 'InlineHorizontalBookList-disableInlineOnPC',
      ])}
    >
      {books.map((book, idx) => (
        <li className="InlineHorizontalBookList_Item" key={book.id}>
          <ConnectedTrackImpression
            section={section}
            index={idx}
            id={book.id}
          >
            <>
              <DTOBookThumbnail
                book={book}
                width={bookThumbnailSize}
                linkUrl={`/book/${book.id}`}
                linkType="Link"
                onLinkClick={() => section && trackClick({
                  section,
                  index: idx,
                  id: book.id,
                })}
                imageClassName="InlineHorizontalBookList_Thumbnail"
                lazyload={lazyloadThumbnail}
              />
              <Link
                to={`/book/${book.id}`}
                className="InlineHorizontalBookList_Link"
                onClick={() => section && trackClick({
                  section,
                  index: idx,
                  id: book.id,
                })}
              >
                <span
                  className="InlineHorizontalBookList_Title"
                  style={{
                    width: `${bookThumbnailSize}px`,
                  }}
                >
                  {book.title.main}
                </span>
                {renderAuthor && (
                  <span
                    className="InlineHorizontalBookList_Author"
                    style={{
                      width: `${bookThumbnailSize}px`,
                    }}
                  >
                    {stringifyAuthors(book.authors, 2)}
                  </span>
                )}
              </Link>
            </>
          </ConnectedTrackImpression>
        </li>
      ))}
    </ul>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  trackClick: (trackingParams: DefaultTrackingParams) => dispatch(Actions.trackClick({ trackingParams })),
});

export const ConnectedInlineHorizontalBookList = connect(null, mapDispatchToProps)(InlineHorizontalBookList);
