import styled from '@emotion/styled';
import { css } from '@emotion/core';
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import NewBadge from 'svgs/NewBadge.svg';
import { CONTENT_MAX_WIDTH } from 'app/constants';
import { Book } from 'app/services/book';
import { stringifyAuthors } from 'app/utils/utils';
import { SliderControls } from 'app/components/Home/SliderControls';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { CollectionId, ReservedCollectionIds } from 'app/services/collection';
import { DTOBookThumbnail } from 'app/components';
import InlineHorizontalBookList from 'app/components/InlineHorizontalBookList';
import Colors from 'app/styles/colors';
import hoverStyles from 'app/styles/hover';

interface HomeSpotlightSectionProps {
  books: Book[];
  collectionId: CollectionId;
  title?: string;
}

export const Media = {
  INLINE: `(max-width: ${CONTENT_MAX_WIDTH}px)`,
  SLIDER: `(min-width: ${CONTENT_MAX_WIDTH + 1}px)`,
};

const SectionHeight = {
  INLINE: 380,
  SLIDER: 420,
};

const metaCommonStyles = css`
  display: block;
  display: -webkit-box;
  width: 140px;
  max-height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  transition: color 0.2s;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
`;

export const SC = {
  Spotlight: styled.div`
    box-sizing: border-box;
    background-color: rgba(242, 244, 245, 0.5);

    @media ${Media.INLINE} {
      height: ${SectionHeight.INLINE}px;
    }
    @media ${Media.SLIDER} {
      position: relative;
      height: ${SectionHeight.SLIDER}px;
      width: 100%;
    }
  `,
  Contents: styled.div`
    position: relative;
    box-sizing: border-box;
    background: url(${require('images/top_collection@2x.png')}) center center no-repeat;
    background-size: auto 100%;

    @media ${Media.INLINE} {
      height: ${SectionHeight.INLINE}px;
      padding: 0 20px;
    }
    @media ${Media.SLIDER} {
      box-sizing: border-box;
      width: 825px;
      height: ${SectionHeight.SLIDER}px;
      margin: 0 auto;
    }
  `,
  Title: styled.div`
    padding: 45px 0 0 10px;
    font-size: 24px;
    line-height: 21px;
    letter-spacing: -0.3px;
    color: black;

    @media ${Media.INLINE} {
      padding: 30px 0 0 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 17px;
      text-align: left;
    }
  `,
  NewBadge: styled(NewBadge)`
    width: 40px;
    height: 22px;
    margin-left: 10px;
    vertical-align: top;
    fill: ${Colors.scubablue_50};

    @media ${Media.INLINE} {
      width: 33px;
      height: 18px;
      margin-left: 6px;
    }
  `,
  WithSlider: styled.div`
    padding-top: 40px;
    .Spotlight_Navigator {
      position: absolute;
      margin: 0;
      padding: 0;
      white-space: nowrap;
      top: -67px;
      right: 11px;

      & > li {
        display: inline-block;

        & > button {
          width: 10px;
          height: 3px;
          padding: 0;
          border: 0;
          background: ${Colors.slategray_30};
          font-size: 0;
          opacity: 0.3;
          cursor: pointer;
        }
        &:first-of-type > button {
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
        }
        &:last-of-type > button {
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }

        &.slick-active {
          & > button {
            background: ${Colors.slategray_30};
            opacity: 1;
          }
        }

        & + li {
          margin-left: 4px;
        }
      }
    }
  `,
  Book: styled.div`
    padding: 0 12.5px;
    width: 165px;
  `,
  BookLink: styled(Link)`
    text-decoration: none;
    text-align: left;
  `,
  BookTitle: styled.span`
    ${metaCommonStyles}
    -webkit-line-clamp: 2;
    padding-top: 8px;
    font-size: 15px;
    line-height: 20px;
    color: black;
    font-weight: 700;
  `,
  BookAuthor: styled.span`
    ${metaCommonStyles}
    -webkit-line-clamp: 1;
    padding-top: 2px;
    line-height: 20px;
    font-size: 14px;
    color: ${Colors.slategray_50};
  `,
};

const sliderControlStyles = () => {
  const commonButtonStyles = css`
    border: none;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15), 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: white;
    transition: opacity 0.2s;
    ${hoverStyles(css`
      background-color: white;
      opacity: 0.6;
    `)}
  `;
  const iconCommonStyles = css`
    fill: ${Colors.slategray_50};
  `;
  return {
    prevButton: css`
      ${commonButtonStyles}
      left: -178px;
    `,
    nextButton: css`
      ${commonButtonStyles}
      right: -178px;
    `,
    prevIcon: iconCommonStyles,
    nextIcon: iconCommonStyles,
  };
};

const BookWidth = 140;
const BookDistance = 20;
const inlineHorizontalBookListStyles = {
  bookList: css`
    padding-bottom: 30px;
    @media ${Media.INLINE} {
      margin: 21px -${BookDistance}px 0;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }
  `,
  book: css`
    @media ${Media.INLINE} {
      width: ${BookWidth}px;
      margin-left: 15px;
    }
    @media ${Media.SLIDER} {
      width: ${BookWidth}px;
      margin-left: 15px;
    }
    &:nth-of-type(n + 7) {
      display: inline-block;
    }
  `,
  bookLink: css`
    flex-direction: column;
    width: ${BookWidth}px;
  `,
  bookTitle: css`
    width: ${BookWidth}px;
    padding-top: 10px;
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: black;
    transition: opacity 0.2s;
  `,
  bookAuthor: css`
    width: ${BookWidth}px;
  `,
};

const HomeSpotlightSection: React.FunctionComponent<HomeSpotlightSectionProps> = props => {
  const sliderRef = React.useRef<Slider>(null);
  const { books, collectionId, title } = props;
  const section = getSectionStringForTracking(
    'select-book',
    'home',
    ReservedCollectionIds.SPOTLIGHT,
  );

  const setSliderImpression = (sliderIdx: number) => {
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
  };
  const dispatch = useDispatch();
  const trackClick = (trackingParams: DefaultTrackingParams) =>
    dispatch(Actions.trackClick({ trackingParams }));
  const trackImpression = (trackingParams: DefaultTrackingParams) =>
    dispatch(Actions.trackImpression({ trackingParams }));

  const isCarousel = useMediaQuery({ minWidth: CONTENT_MAX_WIDTH + 1 });

  return (
    <SC.Spotlight>
      <SC.Contents>
        <SC.Title>
          {title || '한 주간 별점 베스트'}
          <SC.NewBadge />
        </SC.Title>
        {isCarousel ? (
          <SC.WithSlider>
            <Slider
              ref={sliderRef}
              dots
              infinite={books.length > 5}
              adaptiveHeight={false}
              arrows={false}
              speed={200}
              slidesToShow={5}
              slidesToScroll={5}
              dotsClass="Spotlight_Navigator"
              onInit={() => setSliderImpression(0)}
              afterChange={currentIdx => setSliderImpression(currentIdx)}
            >
              {books.map((book: Book, idx: number) => (
                <SC.Book key={`spotlight-book-${idx}`}>
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
                    lazyload
                  />
                  <SC.BookLink
                    to={`/book/${book.id}`}
                    onClick={() =>
                      section &&
                      trackClick({
                        section,
                        index: idx,
                        id: book.id,
                      })
                    }
                  >
                    <SC.BookTitle>{book.title.main}</SC.BookTitle>
                    <SC.BookAuthor>{stringifyAuthors(book.authors, 2)}</SC.BookAuthor>
                  </SC.BookLink>
                </SC.Book>
              ))}
            </Slider>
            {sliderRef && books.length > 5 && (
              <SliderControls
                onPrevClick={() => {
                  if (sliderRef.current) {
                    sliderRef.current.slickPrev();
                  }
                }}
                onNextClick={() => {
                  if (sliderRef.current) {
                    sliderRef.current.slickNext();
                  }
                }}
                styles={sliderControlStyles()}
              />
            )}
          </SC.WithSlider>
        ) : (
          <InlineHorizontalBookList
            books={books}
            serviceTitleForTracking="select-book"
            pageTitleForTracking="home"
            uiPartTitleForTracking="spotlight"
            miscTracking={JSON.stringify({ sect_collection_id: collectionId })}
            renderAuthor
            bookThumbnailSize={140}
            styles={inlineHorizontalBookListStyles}
          />
        )}
      </SC.Contents>
    </SC.Spotlight>
  );
};

export default HomeSpotlightSection;
