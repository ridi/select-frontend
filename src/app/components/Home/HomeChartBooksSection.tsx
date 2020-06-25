import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Book } from 'app/services/book';
import { CoverSizes } from 'app/constants';
import { StarRating } from 'app/services/review';
import { DTOBookThumbnail } from 'app/components';
import { groupChartBooks } from 'app/services/home/uitls';
import { getIsMobile } from 'app/services/commonUI/selectors';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { CollectionId, ReservedCollectionIds } from 'app/services/collection';
import Media from 'app/styles/mediaQuery';
import { BookRating, BookRatingCount } from 'app/components/GridBookList';
import Colors from 'app/styles/colors';

interface HomeChartBooksSectionProps {
  books: Book[];
  title?: string;
  collectionId: CollectionId;
  order?: number;
}

export const SC = {
  ChartBookSection: styled.div`
    flex-direction: column;
    @media ${Media.PC} {
      display: table;
      width: 100%;
      margin-top: 30px;
    }
    @media ${Media.MOBILE} {
      display: block;
      margin: 20px -20px 0;
      padding: 0;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }
  `,
  ChartGroup: styled.ol`
    position: relative;
    margin: 0;
    padding: 0;

    &:first-of-type {
      padding-right: 14px;
    }

    @media ${Media.PC} {
      display: table-cell;
      vertical-align: top;
      &:not(:first-of-type) {
        &::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 100%;
          background-color: ${Colors.slategray_10};
          content: '';
        }
      }
    }

    @media ${Media.MOBILE} {
      display: inline-block;
      vertical-align: top;

      &:first-of-type {
        margin-left: 20px;
      }
      &:last-of-type {
        margin-right: 20px;
      }
    }
  `,
  ChartBook: styled.li`
    display: flex;
    align-items: start;
    color: inherit;
    text-decoration: inherit;
    min-height: 77px;
    padding-right: 15px;
    list-style: none;

    &:not(:first-of-type) {
      margin-top: 14px;
    }

    .ChartBookThumbnail {
      width: 50px;
    }

    .ChartBookLink {
      text-decoration: none;
    }
  `,
  ChartBookRanking: styled.span`
    align-self: center;
    min-width: 16px;
    margin-left: 0;
    margin-right: 10px;
    color: ${Colors.slategray_90};
    font-family: Roboto, Sans-serif;
    font-weight: 500;
    font-size: 16px;
    text-align: center;

    @media ${Media.PC} {
      margin-left: ${(props: { isFirstGroupItem: boolean }) =>
        props.isFirstGroupItem ? '0' : '14px'};
      margin-right: 14px;
    }
  `,
  ChartBookLink: styled(Link)`
    text-decoration: none;
  `,
  ChartBookMeta: styled.div`
    align-self: center;
    width: 130px;
    margin: 10px;
    color: ${Colors.slategray_80};
    font-size: 13px;
  `,
  ChartBookTitle: styled.span`
    display: block;
    display: -webkit-box;
    max-height: 2.8em;
    overflow: hidden;
    line-height: 1.4em;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    transition: color 0.2s;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    -webkit-line-clamp: 2;

    @media ${Media.PC} {
      width: 150px;
    }
    @media ${Media.MOBILE} {
      white-space: normal;
    }
  `,
  ChartBookRating: BookRating,
  ChartBookRatingCount: BookRatingCount,
};

export const HomeChartBooksSection: React.FunctionComponent<HomeChartBooksSectionProps> = props => {
  const { books, order, title } = props;
  const isMobile = useSelector(getIsMobile);
  const dispatch = useDispatch();

  const trackClick = (trackingParams: DefaultTrackingParams) => {
    dispatch(Actions.trackClick({ trackingParams }));
  };

  const renderCharts = () => {
    const contentsCount = isMobile ? 24 : 12;
    const section = getSectionStringForTracking(
      'select-book',
      'home',
      ReservedCollectionIds.POPULAR,
    );

    return (
      <SC.ChartBookSection>
        {books
          .slice(0, contentsCount)
          .reduce(groupChartBooks(4), [])
          .map((groupedBooks, groupIdx) => (
            <SC.ChartGroup start={groupIdx * 4 + 1} key={groupIdx}>
              {groupedBooks.map((book, idxInGroup) => {
                const index = groupIdx * 4 + idxInGroup;
                return (
                  <SC.ChartBook key={String(groupIdx) + idxInGroup}>
                    <ConnectedTrackImpression
                      section={section}
                      index={index}
                      id={book.id}
                      misc={order ? JSON.stringify({ sect_order: order }) : undefined}
                    >
                      <SC.ChartBookRanking isFirstGroupItem={groupIdx === 0}>
                        {index + 1}
                      </SC.ChartBookRanking>
                      <DTOBookThumbnail
                        book={book}
                        width={50}
                        coverSize={CoverSizes.SIZE_50}
                        linkUrl={`/book/${book.id}`}
                        linkType="Link"
                        onLinkClick={() =>
                          trackClick({
                            section,
                            index,
                            id: book.id,
                          })
                        }
                        imageClassName="ChartBookThumbnail"
                        linkWrapperClassName="ChartBookLink"
                      />
                      <SC.ChartBookLink
                        to={`/book/${book.id}`}
                        onClick={() =>
                          trackClick({
                            section,
                            index,
                            id: book.id,
                          })
                        }
                      >
                        <SC.ChartBookMeta>
                          <SC.ChartBookTitle>{book.title.main}</SC.ChartBookTitle>
                          {book.reviewSummary ? (
                            <SC.ChartBookRating>
                              <StarRating rating={book.reviewSummary.buyerRatingAverage} />
                              <SC.ChartBookRatingCount>
                                {thousandsSeperator(book.reviewSummary.buyerRatingCount)}
                              </SC.ChartBookRatingCount>
                            </SC.ChartBookRating>
                          ) : null}
                        </SC.ChartBookMeta>
                      </SC.ChartBookLink>
                    </ConnectedTrackImpression>
                  </SC.ChartBook>
                );
              })}
            </SC.ChartGroup>
          ))}
      </SC.ChartBookSection>
    );
  };

  return (
    <>
      <SectionHeader title={title || '인기 도서'} link="/charts" />
      {renderCharts()}
    </>
  );
};
