import classNames from 'classnames';
import React from 'react';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import { ThumbnailLinkType, ThumbnailSize } from 'app/components/BookThumbnail';
import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { Book } from 'app/services/book';
import { StarRating } from 'app/services/review/components';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { connect } from 'react-redux';

interface Props {
  books: Book[];
  serviceTitleForTracking?: string;
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  miscTracking?: string;
  isChart?: boolean;
  page?: number;
  itemCountPerPage?: number;
  thumbnailLinkType?: ThumbnailLinkType;
  onLinkClick?: (event: React.SyntheticEvent<any>) => any;
}

export class GridBookList extends React.Component<Props & ReturnType<typeof mapDispatchToProps>> {
  public renderItem = (width: ThumbnailSize, book: Book, rank: number, index: number) => {
    const {
      isChart = false,
      thumbnailLinkType = 'Link',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onLinkClick = () => {},
      trackClick,
    } = this.props;

    const section = this.getSection();

    return (
      <div style={{ width }}>
        {isChart && <span className="GridBookList_ItemRanking">{rank}</span>}
        <DTOBookThumbnail
          book={book}
          width={width}
          linkUrl={`/book/${book.id}`}
          linkType={thumbnailLinkType}
          onLinkClick={(e: React.MouseEvent<any>) => {
            onLinkClick(e);
            if (section) {
              trackClick({
                section,
                index,
                id: book.id,
              });
            }
          }}
          sizeWrapperClassName="GridBookList_ItemThumbnail"
        />
        <Link
          to={`/book/${book.id}`}
          className="GridBookList_ItemLink"
          onClick={(e: React.MouseEvent<any>) => {
            onLinkClick(e);
            if (section) {
              trackClick({
                section,
                index,
                id: book.id,
              });
            }
          }}
        >
          <h3 className="GridBookList_ItemTitle">{book.title.main}</h3>
          {isChart && (
            <span className="HomeSection_ChartBookRating">
              <StarRating rating={book.reviewSummary!.buyerRatingAverage} />
              <span className="HomeSection_ChartBookRatingCount">
                {thousandsSeperator(book.reviewSummary!.buyerRatingCount)}
              </span>
            </span>
          )}
        </Link>
      </div>
    );
  }

  public getSection = () => {
    const { serviceTitleForTracking, pageTitleForTracking, uiPartTitleForTracking } = this.props;
    return !!serviceTitleForTracking && !!pageTitleForTracking ?
      getSectionStringForTracking(serviceTitleForTracking, pageTitleForTracking, uiPartTitleForTracking) :
      undefined;
  }

  public getRank = (current: number) => {
    const { page = 1, itemCountPerPage = 24 } = this.props;
    return (current + 1) + (page - 1) * itemCountPerPage;
  }

  public render() {
    const {
      books,
      isChart = false,
      miscTracking,
    } = this.props;

    return (
      <ul
        className={classNames([
          'GridBookList',
          isChart && 'GridBookList-isChart',
        ])}
      >
        {books.map((book, index) => (
          <li className="GridBookList_Item" key={book.id}>
            <ConnectedTrackImpression
              section={this.getSection()}
              index={index}
              id={book.id}
              misc={miscTracking}
            >
              <MediaQuery maxWidth={359}>
                {this.renderItem(90, book, this.getRank(index), index)}
              </MediaQuery>
              <MediaQuery minWidth={360} maxWidth={413}>
                {this.renderItem(100, book, this.getRank(index), index)}
              </MediaQuery>
              <MediaQuery minWidth={414} maxWidth={767}>
                {this.renderItem(116, book, this.getRank(index), index)}
              </MediaQuery>
              <MediaQuery minWidth={768}>
                {this.renderItem(120, book, this.getRank(index), index)}
              </MediaQuery>
            </ConnectedTrackImpression>
          </li>
        ))}
      </ul>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  trackClick: (trackingParams: DefaultTrackingParams) => dispatch(Actions.trackClick({ trackingParams } )),
});

export const ConnectedGridBookList = connect(null, mapDispatchToProps)(GridBookList);
