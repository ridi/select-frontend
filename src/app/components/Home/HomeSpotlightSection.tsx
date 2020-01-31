import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import {
  ConnectedInlineHorizontalBookList,
  DTOBookThumbnail,
} from 'app/components';
import { Book } from 'app/services/book';
import { CollectionId } from 'app/services/collection';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { stringifyAuthors } from 'app/utils/utils';
import MediaQuery from 'react-responsive';
import { SliderControls } from './SliderControls';

interface HomeSpotlightSectionProps {
  books: Book[];
  collectionId: CollectionId;
  title: string;
}

type Props = HomeSpotlightSectionProps & ReturnType<typeof mapDispatchToProps>;

export class HomeSpotlightSection extends React.Component<Props> {
  private slider: Slider;

  private setSliderImpression(sliderIdx: number) {
    const { books, trackImpression, collectionId } = this.props;
    const section = getSectionStringForTracking('select-book', 'home', 'spotlight');

    const trackingStartIdx = sliderIdx > 0 ? sliderIdx - 1 : 0;
    const trackingEndIdx =
      trackingStartIdx + 5 > books.length ? books.length : trackingStartIdx + 5;

    for (let idx = trackingStartIdx; idx < trackingEndIdx; idx += 1) {
      if (books[idx]) {
        trackImpression({
          section,
          index: idx,
          id: books[idx].id,
          misc: JSON.stringify({ sect_collection_id: collectionId }),
        });
      }
    }
  }

  public render() {
    const { books, trackClick, collectionId, title } = this.props;
    const section = getSectionStringForTracking('select-book', 'home', 'spotlight');
    return (
      <div className="HomeSection_Spotlight">
        <div className="HomeSection_Spotlight_Contents">
          <div className="HomeSection_Spotlight_Title">
            {title}
            <svg className="HomeSection_Spotlight_NewBadge" width="42px" height="22px" viewBox="0 0 42 22">
              {/* tslint:disable-next-line:max-line-length */}
              <path d="M4,0 L37.5555556,0 C39.7646946,-4.05812251e-16 41.5555556,1.790861 41.5555556,4 L41.5555556,18 C41.5555556,20.209139 39.7646946,22 37.5555556,22 L4,22 C1.790861,22 -4.04738818e-13,20.209139 -4.05009359e-13,18 L-4.05009359e-13,4 C-4.05279901e-13,1.790861 1.790861,4.05812251e-16 4,0 Z M6.11111111,15.7115717 L9.6701209,15.7115717 C11.7219344,15.7115717 13.3557858,14.8503166 13.3557858,12.9251583 C13.3557858,11.6712723 12.6338515,10.9620035 11.6839378,10.7086931 L11.6839378,10.6580311 C12.4438687,10.3667242 12.9124928,9.45480714 12.9124928,8.61888313 C12.9124928,6.80771445 11.3546344,6.28842832 9.40414508,6.28842832 L6.11111111,6.28842832 L6.11111111,15.7115717 Z M8.37823834,10.0247553 L8.37823834,8.0109384 L9.31548647,8.0109384 C10.2654001,8.0109384 10.7086931,8.28957974 10.7086931,8.96085204 C10.7086931,9.60679332 10.2780656,10.0247553 9.31548647,10.0247553 L8.37823834,10.0247553 Z M8.37823834,13.9763961 L8.37823834,11.6966033 L9.5054692,11.6966033 C10.607369,11.6966033 11.1519862,12.0005757 11.1519862,12.7731721 C11.1519862,13.5837651 10.5947035,13.9763961 9.5054692,13.9763961 L8.37823834,13.9763961 Z M14.337939,15.7115717 L20.4553828,15.7115717 L20.4553828,13.8117444 L16.6050662,13.8117444 L16.6050662,11.810593 L19.7587795,11.810593 L19.7587795,9.91076569 L16.6050662,9.91076569 L16.6050662,8.16292458 L20.3160622,8.16292458 L20.3160622,6.28842832 L14.337939,6.28842832 L14.337939,15.7115717 Z M24.6672424,15.8888889 C26.9470351,15.8888889 28.2642487,14.5083477 28.2642487,12.9378238 C28.2642487,11.6079447 27.5676454,10.8226828 26.402418,10.3540587 L25.224525,9.88543466 C24.388601,9.55613126 23.7933218,9.35348302 23.7933218,8.83419689 C23.7933218,8.32757628 24.2239493,8.04893495 24.9205527,8.04893495 C25.6551526,8.04893495 26.2377663,8.30224525 26.8583765,8.77086931 L27.9856074,7.35233161 C27.1623489,6.52907311 26.009787,6.11111111 24.9205527,6.11111111 C22.9194013,6.11111111 21.5008636,7.37766264 21.5008636,8.96085204 C21.5008636,10.3287277 22.4254462,11.1519862 23.4133564,11.5446172 L24.6165803,12.0512378 C25.4271733,12.3932067 25.9464594,12.5705239 25.9464594,13.115141 C25.9464594,13.6217617 25.5538284,13.9383995 24.7179044,13.9383995 C23.970639,13.9383995 23.0967185,13.5457686 22.4254462,12.9758204 L21.1462291,14.5336788 C22.1214738,15.4329303 23.4386874,15.8888889 24.6672424,15.8888889 Z M31.0829016,15.7115717 L33.3500288,15.7115717 L33.3500288,8.16292458 L35.9084629,8.16292458 L35.9084629,6.28842832 L28.537133,6.28842832 L28.537133,8.16292458 L31.0829016,8.16292458 L31.0829016,15.7115717 Z" />
            </svg>
          </div>
          <MediaQuery maxWidth={900}>
            {(isMobile) =>
              isMobile ? (
                <ConnectedInlineHorizontalBookList
                  books={books}
                  serviceTitleForTracking="select-book"
                  pageTitleForTracking="home"
                  uiPartTitleForTracking="spotlight"
                  miscTracking={JSON.stringify({ sect_collection_id: collectionId })}
                  renderAuthor={true}
                  bookThumbnailSize={140}
                />
              ) : (
                <div className="HomeSection_Spotlight_Slider">
                  <Slider
                    ref={(slider: Slider) => (this.slider = slider)}
                    dots={true}
                    infinite={books.length > 5}
                    adaptiveHeight={false}
                    arrows={false}
                    speed={200}
                    slidesToShow={5}
                    slidesToScroll={5}
                    dotsClass="Spotlight_Navigator"
                    onInit={() => this.setSliderImpression(0)}
                    afterChange={(currentIdx) =>
                      this.setSliderImpression(currentIdx)
                    }
                  >
                    {books.map((book, idx) => (
                      <div
                        className="HomeSection_Spotlight_Book"
                        style={{
                          width: '165px',
                        }}
                        key={`spotlight-book-${idx}`}
                      >
                        <DTOBookThumbnail
                          book={book}
                          width={140}
                          linkUrl={`/book/${book.id}`}
                          linkType="Link"
                          onLinkClick={() =>
                            section &&
                            trackClick({
                              section,
                              index: idx,
                              id: book.id,
                            })
                          }
                          imageClassName="InlineHorizontalBookList_Thumbnail"
                          lazyload={true}
                        />
                        <Link
                          to={`/book/${book.id}`}
                          className="HomeSection_Spotlight_Book_Link"
                          onClick={() =>
                            section &&
                            trackClick({
                              section,
                              index: idx,
                              id: book.id,
                            })
                          }
                        >
                          <span className="HomeSection_Spotlight_Book_Title">
                            {book.title.main}
                          </span>
                          <span className="HomeSection_Spotlight_Book_Author">
                            {stringifyAuthors(book.authors, 2)}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                  {books.length > 5 && (
                    <SliderControls
                      onPrevClick={() => this.slider.slickPrev()}
                      onNextClick={() => this.slider.slickNext()}
                    />
                  )}
                </div>
              )
            }
          </MediaQuery>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  trackClick: (trackingParams: DefaultTrackingParams) => dispatch(Actions.trackClick({ trackingParams })),
  trackImpression: (trackingParams: DefaultTrackingParams) => dispatch(Actions.trackImpression({ trackingParams })),
});

export const ConnectedHomeSpotlightSection = connect(
  null,
  mapDispatchToProps,
)(HomeSpotlightSection);
