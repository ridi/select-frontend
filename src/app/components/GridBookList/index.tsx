import styled from '@emotion/styled';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { ThumbnailLinkType, ThumbnailSize } from 'app/components/BookThumbnail';
import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { ResponsiveSection, BookWidth, MINI_PHONE_MAX_WIDTH, PHONE_MAX_WIDTH } from 'app/constants';
import { Book } from 'app/services/book';
import { StarRating } from 'app/services/review/components';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { resetLayout } from 'app/styles/customProperties';
import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';

import GridBookListWrapper from './Wrapper';

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

export const BookRating = styled.span`
  display: inline-block;
  margin-top: 5px;
  vertical-align: middle;
`;

export const BookRatingCount = styled.span`
  display: inline-block;
  margin-top: -1px;
  margin-left: 3px;
  color: ${Colors.slategray_40};
  font-size: 12px;
  line-height: 1em;
  vertical-align: top;
`;

const SC = {
  GridBookListWrapper,
  GridBookList: styled.ul`
    ${resetLayout}
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    @media ${Media.MINI_PHONE} {
      padding: 12px 0;
    }
    @media (min-width: ${MINI_PHONE_MAX_WIDTH + 1}px) and (max-width: ${PHONE_MAX_WIDTH - 1}px) {
      padding: 14px 0;
    }
    @media (min-width: ${PHONE_MAX_WIDTH}px) {
      padding: 16px 0;
    }
  `,
  BookRating,
  BookRatingCount,
};

export const GridBookList: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch();

  const { books, isChart = false, miscTracking } = props;
  const getSection = () => {
    const { serviceTitleForTracking, pageTitleForTracking, uiPartTitleForTracking } = props;
    return !!serviceTitleForTracking && !!pageTitleForTracking
      ? getSectionStringForTracking(
          serviceTitleForTracking,
          pageTitleForTracking,
          uiPartTitleForTracking,
        )
      : undefined;
  };

  const getRank = (current: number) => {
    const { page = 1, itemCountPerPage = 24 } = props;
    return current + 1 + (page - 1) * itemCountPerPage;
  };

  const renderItem = (width: ThumbnailSize, book: Book, rank: number, index: number) => {
    const {
      thumbnailLinkType = 'Link',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onLinkClick = () => {},
    } = props;
    const trackClick = (trackingParams: DefaultTrackingParams) =>
      dispatch(Actions.trackClick({ trackingParams }));

    const section = getSection();

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
          {isChart && book.reviewSummary && (
            <SC.BookRating>
              <StarRating rating={book.reviewSummary.buyerRatingAverage} />
              <SC.BookRatingCount>
                {thousandsSeperator(book.reviewSummary.buyerRatingCount)}
              </SC.BookRatingCount>
            </SC.BookRating>
          )}
        </Link>
      </div>
    );
  };

  const isNormal = useMediaQuery({
    minWidth: ResponsiveSection.VW_360,
    maxWidth: ResponsiveSection.VW_414 - 1,
  });
  const isLarge = useMediaQuery({
    minWidth: ResponsiveSection.VW_414,
    maxWidth: ResponsiveSection.VW_768 - 1,
  });
  const isFull = useMediaQuery({ minWidth: ResponsiveSection.VW_768 });

  const getBookWidth = () => {
    if (isNormal) {
      return BookWidth.WIDTH_100;
    }
    if (isLarge) {
      return BookWidth.WIDTH_116;
    }
    if (isFull) {
      return BookWidth.WIDTH_120;
    }
    return BookWidth.WIDTH_90;
  };

  const [bookWidth, setBookWidth] = React.useState(getBookWidth());
  React.useEffect(() => {
    setBookWidth(getBookWidth());
  }, [isNormal, isLarge, isFull]);

  return (
    <SC.GridBookListWrapper>
      <SC.GridBookList>
        {books.map((book, index) => (
          <li className="GridBookList_Item" key={book.id}>
            <ConnectedTrackImpression
              section={getSection()}
              index={index}
              id={book.id}
              misc={miscTracking}
            >
              {renderItem(bookWidth, book, getRank(index), index)}
            </ConnectedTrackImpression>
          </li>
        ))}
      </SC.GridBookList>
    </SC.GridBookListWrapper>
  );
};
