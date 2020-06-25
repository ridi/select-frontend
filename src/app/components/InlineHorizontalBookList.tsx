import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { Book } from 'app/services/book';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { stringifyAuthors } from 'app/utils/utils';
import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';

import { ThumbnailSize } from './BookThumbnail';

interface InlineHorizontalBookListStyles {
  bookList?: SerializedStyles;
  book?: SerializedStyles;
  bookLink?: SerializedStyles;
  bookTitle?: SerializedStyles;
  bookAuthor?: SerializedStyles;
}

interface Props {
  serviceTitleForTracking?: string;
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  miscTracking?: string;
  books: Book[];
  disableInlineOnPC?: boolean;
  lazyloadThumbnail?: boolean;
  renderAuthor?: boolean;
  bookThumbnailSize?: ThumbnailSize;
  styles?: InlineHorizontalBookListStyles;
}

interface StyledBookProps {
  inlineDisabled?: boolean;
}

interface StyledBookMetaProps {
  width?: number;
}

const SC = {
  BookList: styled.ul`
    padding: 0;
    @media ${Media.MOBILE} {
      margin: 21px -20px 0;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }
    @media ${Media.PC} {
      display: flex;
      flex-wrap: ${(props: StyledBookProps) => (props.inlineDisabled ? 'wrap' : 'nowrap')};
      align-items: flex-start;
    }
  `,
  Book: styled.li`
    width: 110px;
    list-style: none;
    margin-left: 10px;

    @media ${Media.MOBILE} {
      margin-left: 10px;
      display: inline-block;
      &:first-of-type {
        margin-left: 0;
        padding-left: 20px;
      }
      &:last-of-type {
        padding-right: 20px;
      }
    }
    @media ${Media.PC} {
      margin-left: 16px;
      width: 120px;
      &:first-of-type {
        margin-left: 0;
      }
      &:nth-of-type(6n + 1) {
        margin-left: ${(props: StyledBookProps) => (props.inlineDisabled ? '16px' : 0)};
      }
      &:nth-of-type(n + 7) {
        ${(props: StyledBookProps) =>
          props.inlineDisabled
            ? css`
                margin-top: 30px;
              `
            : css`
                display: none;
              `}
      }
    }
  `,
  BookLink: styled(Link)`
    flex-direction: column;
    display: flex;
    align-items: start;
    color: inherit;
    text-decoration: inherit;
  `,
  BookTitle: styled.span`
    display: block;
    display: -webkit-box;
    width: ${(props: StyledBookMetaProps) => props.width || '100%'};
    max-height: 34px;
    margin-top: 10px;
    overflow: hidden;
    color: ${Colors.slategray_80};
    font-size: 13px;
    font-weight: 400;
    line-height: 17px;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    transition: color 0.2s;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  `,
  BookAuthor: styled.span`
    display: block;
    display: -webkit-box;
    width: ${(props: StyledBookMetaProps) => props.width || '100%'};
    padding-top: 4px;
    font-size: 13px;
    color: ${Colors.slategray_50};
    max-height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    transition: opacity 0.2s;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    -webkit-line-clamp: 1;
  `,
};

export const InlineHorizontalBookList: React.FunctionComponent<Props> = props => {
  const dispatch = useDispatch();
  const {
    serviceTitleForTracking,
    pageTitleForTracking,
    uiPartTitleForTracking,
    miscTracking,
    books,
    disableInlineOnPC,
    lazyloadThumbnail,
    renderAuthor,
    bookThumbnailSize = 120,
  } = props;

  const section =
    !!serviceTitleForTracking && !!pageTitleForTracking
      ? getSectionStringForTracking(
          serviceTitleForTracking,
          pageTitleForTracking,
          uiPartTitleForTracking,
        )
      : undefined;

  const trackClick = (trackingParams: DefaultTrackingParams) => {
    dispatch(Actions.trackClick({ trackingParams }));
  };

  return (
    <SC.BookList inlineDisabled={disableInlineOnPC}>
      {books.map((book, idx) => (
        <SC.Book key={book.id} inlineDisabled={disableInlineOnPC} css={props.styles?.book}>
          <ConnectedTrackImpression section={section} index={idx} id={book.id} misc={miscTracking}>
            <>
              <DTOBookThumbnail
                book={book}
                width={bookThumbnailSize}
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
                lazyload={lazyloadThumbnail}
              />
              <SC.BookLink
                css={props.styles?.bookLink}
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
                <SC.BookTitle css={props.styles?.bookTitle} width={bookThumbnailSize}>
                  {book.title.main}
                </SC.BookTitle>
                {renderAuthor && (
                  <SC.BookAuthor css={props.styles?.bookAuthor} width={bookThumbnailSize}>
                    {stringifyAuthors(book.authors, 2)}
                  </SC.BookAuthor>
                )}
              </SC.BookLink>
            </>
          </ConnectedTrackImpression>
        </SC.Book>
      ))}
    </SC.BookList>
  );
};

export default React.memo(InlineHorizontalBookList);
