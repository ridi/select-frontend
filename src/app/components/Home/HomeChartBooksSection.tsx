import { RidiSelectState } from 'app/store';
import React from 'react';
import { connect } from 'react-redux';

import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';

import { DTOBookThumbnail } from 'app/components';
import { MAX_WIDTH } from 'app/constants';
import { Book } from 'app/services/book';
import { CollectionId } from 'app/services/collection';
import { groupChartBooks } from 'app/services/home/uitls';
import { StarRating } from 'app/services/review';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';
import { SectionHeader } from './HomeSection';

interface HomeChartBooksSectionProps {
  books: Book[];
  title: string;
  collectionId: CollectionId;
  order?: number;
}

type Props = HomeChartBooksSectionProps & ReturnType<typeof mapDispatchToProps>;

export class HomeChartBooksSection extends React.Component<Props> {
  public renderCharts(contentsCount: number) {
    const { books, trackClick, order } = this.props;
    const section = getSectionStringForTracking('select-book', 'home', 'popular');
    return (
      <div className="HomeSection_Chart">
        {books
          .slice(0, contentsCount)
          .reduce(groupChartBooks(4), [])
          .map((groupedBooks, groupIdx) => (
            <ol className="HomeSection_ChartGroup" start={groupIdx * 4 + 1} key={groupIdx}>
              {groupedBooks.map((book, idxInGroup) => {
                const index = groupIdx * 4 + idxInGroup;
                return (
                  <li className="HomeSection_ChartBook" key={String(groupIdx) + idxInGroup}>
                    <ConnectedTrackImpression
                      section={section}
                      index={index}
                      id={book.id}
                      misc={order ? JSON.stringify({sect_order: order}) : undefined}
                    >
                      <span className="HomeSection_ChartBookRanking">
                        {index + 1}
                      </span>
                      <DTOBookThumbnail
                        book={book}
                        width={50}
                        linkUrl={`/book/${book.id}`}
                        linkType="Link"
                        onLinkClick={() => trackClick({
                          section,
                          index,
                          id: book.id,
                        })}
                        imageClassName="HomeSection_ChartBookThumbnail"
                        linkWrapperClassName="HomeSection_BookLink"
                      />
                      <Link
                        to={`/book/${book.id}`}
                        className="HomeSection_BookLink"
                        onClick={() => trackClick({
                          section,
                          index,
                          id: book.id,
                        })}
                      >
                        <div className="HomeSection_ChartBookMeta">
                          <span className="HomeSection_ChartBookTitle">{book.title.main}</span>
                          <span className="HomeSection_ChartBookRating">
                            <StarRating rating={book.reviewSummary!.buyerRatingAverage} />
                            <span className="HomeSection_ChartBookRatingCount">
                              {thousandsSeperator(book.reviewSummary!.buyerRatingCount)}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </ConnectedTrackImpression>
                  </li>
                ); },
              )}
            </ol>
          ))}
      </div>
    );
  }

  public render() {
    const { title } = this.props;

    return (
      <div className="HomeSection HomeSection-horizontal-pad">
        <SectionHeader title={title} link={'/charts'} />
        <MediaQuery maxWidth={MAX_WIDTH}>
          {(isMobile) => isMobile ? this.renderCharts(24) : this.renderCharts(12)}
        </MediaQuery>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  trackClick: (trackingParams: DefaultTrackingParams) => dispatch(Actions.trackClick({ trackingParams })),
});

export const ConnectedHomeChartBooksSection = connect(null, mapDispatchToProps)(HomeChartBooksSection);
