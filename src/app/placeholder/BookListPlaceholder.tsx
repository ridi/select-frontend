import range from 'lodash-es/range';
import React from 'react';
import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';

import Media from 'app/styles/mediaQuery';
import { skeleton } from 'app/styles/skeleton';
import Colors from 'app/styles/colors';
import { SC as ChartBookSC } from 'app/components/Home/HomeChartBooksSection';

interface GridBookListSkeletonProps {
  displayRanking?: boolean;
}

interface LandscapeBookListSkeletonProps {
  hasCheckbox?: boolean;
}

interface BookAdditionalStyles {
  book?: SerializedStyles;
  bookCheckboxWrapper?: SerializedStyles;
  bookCheckbox?: SerializedStyles;
  bookThumbnail?: SerializedStyles;
  bookMeta?: SerializedStyles;
  bookTitle?: SerializedStyles;
  bookAuthor?: SerializedStyles;
}

interface BookSkeletonProps {
  hasCheckbox?: boolean;
  styles?: BookAdditionalStyles;
}

const SkeletonSC = {
  SpotlightBookList: styled.ul`
    display: -webkit-box;
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    padding: 0;
    list-style: none;
    @media ${Media.MOBILE} {
      margin: 21px 0 0;
      overflow: hidden;
    }
  `,
  SpotlightBook: styled.li`
    width: 140px;
    @media ${Media.MOBILE} {
      &:first-of-type {
        padding-left: 0;
      }
      &:last-of-type {
        padding-right: 20px;
      }
    }
    &:not(:first-of-type) {
      margin-left: 15px;
      @media ${Media.PC} {
        margin-left: 25px;
      }
    }
  `,
  LandScapeBookList: styled.ul`
    margin: 0;
    padding: 0 15px;
    list-style: none;

    @media ${Media.PC} {
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }
  `,
  LandScapeBook: styled.li`
    margin-top: 15px;
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  InlineHorizontalBookList: styled.ul`
    display: -webkit-box;
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    padding: 0;
    list-style: none;
    @media ${Media.MOBILE} {
      margin: 21px 0 0;
      overflow: hidden;
    }
  `,
  InlineHorizontalBook: styled.li`
    width: 110px;
    &:first-of-type {
      padding-left: 0;
    }
    &:last-of-type {
      padding-right: 20px;
    }
    &:not(:first-of-type) {
      margin-left: 10px;
    }
    @media ${Media.PC} {
      width: 120px;
      &:nth-of-type(n + 7) {
        display: none;
      }
      &:not(:first-of-type) {
        margin-left: 16px;
      }
    }
  `,
  Book: styled.div`
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  BookCheckboxWrapper: styled.div`
    display: block;
    width: 100%;
    height: 160px;
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  BookCheckbox: styled.span`
    ${skeleton}
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  BookThumbnail: styled.span`
    ${skeleton}
    display: block;
    width: 100%;
    height: 160px;
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  BookMeta: styled.div`
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  BookTitle: styled.span`
    ${skeleton}
    display: block;
    height: 15px;
    width: 100%;
    margin-top: 11.5px;
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  BookAuthor: styled.span`
    ${skeleton}
    display: block;
    height: 15px;
    width: 70%;
    margin-top: 5px;
    ${(props: { styles?: SerializedStyles }) => props.styles}
  `,
  ChartBookSection: ChartBookSC.ChartBookSection,
  ChartGroup: ChartBookSC.ChartGroup,
  ChartBook: ChartBookSC.ChartBook,
  ChartBookRanking: ChartBookSC.ChartBookRanking,
  ChartBookThumbnail: styled.span`
    ${skeleton}
    display: inline-block;
    width: 50px;
    height: 70px;
  `,
  ChartBookMeta: ChartBookSC.ChartBookMeta,
  ChartBookTitle: styled(ChartBookSC.ChartBookTitle)`
    ${skeleton}
    display: block;
    width: 120px;
    height: 18px;
  `,
  ChartBookRating: styled(ChartBookSC.ChartBookRating)`
    ${skeleton}
    display: block;
    width: 68px;
    height: 11px;
    margin-top: 5px;
  `,
};

export const BookSkeleton: React.FunctionComponent<BookSkeletonProps> = props => {
  const { hasCheckbox, styles } = props;

  return (
    <SkeletonSC.Book styles={styles?.book}>
      {hasCheckbox ? (
        <SkeletonSC.BookCheckboxWrapper styles={styles?.bookCheckboxWrapper}>
          <SkeletonSC.BookCheckbox styles={styles?.bookCheckbox} />
        </SkeletonSC.BookCheckboxWrapper>
      ) : null}
      <SkeletonSC.BookThumbnail styles={styles?.bookThumbnail} />
      <SkeletonSC.BookMeta styles={styles?.bookMeta}>
        <SkeletonSC.BookTitle styles={styles?.bookTitle} />
        <SkeletonSC.BookAuthor styles={styles?.bookAuthor} />
      </SkeletonSC.BookMeta>
    </SkeletonSC.Book>
  );
};

export const InlineHorizontalBookListSkeleton: React.FunctionComponent = () => (
  <SkeletonSC.InlineHorizontalBookList>
    {range(0, 12).map((value, index) => (
      <SkeletonSC.InlineHorizontalBook key={`skeltonBook_${index}`}>
        <BookSkeleton />
      </SkeletonSC.InlineHorizontalBook>
    ))}
  </SkeletonSC.InlineHorizontalBookList>
);

const spotlightBookAdditionalStyles: BookAdditionalStyles = {
  bookCheckbox: css`
    background-color: ${Colors.slategray_10};
  `,
  bookThumbnail: css`
    height: 215px;
    background-color: ${Colors.slategray_10};
  `,
  bookTitle: css`
    background-color: ${Colors.slategray_10};
  `,
  bookAuthor: css`
    background-color: ${Colors.slategray_10};
  `,
};

export const SpotlightBookListSkeleton: React.FunctionComponent = () => (
  <SkeletonSC.SpotlightBookList>
    {range(0, 5).map((value, index) => (
      <SkeletonSC.SpotlightBook key={`skeltonBook_${index}`}>
        <BookSkeleton styles={spotlightBookAdditionalStyles} />
      </SkeletonSC.SpotlightBook>
    ))}
  </SkeletonSC.SpotlightBookList>
);

export const ChartBookListSkeleton: React.FunctionComponent = () => {
  const dumpArray = [0, 0, 0, 0];
  const dumpGroupArray = [dumpArray, dumpArray, dumpArray];
  return (
    <SkeletonSC.ChartBookSection>
      {dumpGroupArray.map((groupedBooks, groupIdx) => (
        <SkeletonSC.ChartGroup start={groupIdx * 4 + 1} key={groupIdx}>
          {groupedBooks.map((book, idxInGroup) => {
            const index = groupIdx * 4 + idxInGroup;
            return (
              <SkeletonSC.ChartBook key={String(groupIdx) + idxInGroup}>
                <SkeletonSC.ChartBookRanking isFirstGroupItem={groupIdx === 0}>
                  {index + 1}
                </SkeletonSC.ChartBookRanking>
                <SkeletonSC.ChartBookThumbnail />
                <SkeletonSC.ChartBookMeta>
                  <SkeletonSC.ChartBookTitle />
                  <SkeletonSC.ChartBookRating />
                </SkeletonSC.ChartBookMeta>
              </SkeletonSC.ChartBook>
            );
          })}
        </SkeletonSC.ChartGroup>
      ))}
    </SkeletonSC.ChartBookSection>
  );
};

export const GridBookListSkeleton: React.FunctionComponent<GridBookListSkeletonProps> = props => {
  const { displayRanking } = props;

  return (
    <ul className="GridBookList_Skeleton">
      {range(0, 12).map((value, index) => (
        <li className="GridBookList_Item_Skeleton" key={index}>
          {displayRanking ? <div className="Ranking_Placeholder Skeleton" /> : null}
          <BookSkeleton />
        </li>
      ))}
    </ul>
  );
};

const landscapeBookAdditionalStyles: BookAdditionalStyles = {
  book: css`
    display: table;
    width: 100%;
    table-layout: fixed;
  `,
  bookCheckboxWrapper: css`
    display: table-cell;
    width: 25px;
    height: auto;
    vertical-align: middle;
  `,
  bookCheckbox: css`
    display: block;
    width: 18px;
    height: 18px;
    margin-top: -12px;
  `,
  bookThumbnail: css`
    display: table-cell;
    width: 100px;
    height: 150px;
  `,
  bookMeta: css`
    display: table-cell;
    padding: 19px 0 0 20px;
  `,
  bookTitle: css`
    display: block;
    height: 19px;
    width: 100%;
    margin-top: 0;
  `,
  bookAuthor: css`
    display: block;
    height: 19px;
    width: 30%;
    margin-top: 5px;
  `,
};

export const LandscapeBookListSkeleton: React.FunctionComponent<LandscapeBookListSkeletonProps> = props => {
  const { hasCheckbox } = props;

  return (
    <SkeletonSC.LandScapeBookList>
      {range(0, 2).map((value, index) => (
        <SkeletonSC.LandScapeBook key={index}>
          <BookSkeleton hasCheckbox={!!hasCheckbox} styles={landscapeBookAdditionalStyles} />
        </SkeletonSC.LandScapeBook>
      ))}
    </SkeletonSC.LandScapeBookList>
  );
};

const mySelectHistoryBookStyles = css`
  margin: 0;
  padding-top: 12px;
`;

const mySelectHistoryBookAdditionalStyles: BookAdditionalStyles = {
  ...landscapeBookAdditionalStyles,
  bookThumbnail: css`
    display: table-cell;
    width: 50px;
    height: 74px;
    @media ${Media.PC} {
      width: 80px;
      height: 117px;
    }
  `,
  bookMeta: css`
    display: table-cell;
    padding: 6px 0 0 20px;
  `,
  bookTitle: css`
    height: 20px;
    margin-top: 0;
  `,
  bookAuthor: css`
    height: 14px;
    margin-top: 8px;
  `,
};

export const MySelectHistoryBookListSkeleton: React.FunctionComponent<LandscapeBookListSkeletonProps> = props => {
  const { hasCheckbox } = props;

  return (
    <SkeletonSC.LandScapeBookList>
      {range(0, 2).map((value, index) => (
        <SkeletonSC.LandScapeBook styles={mySelectHistoryBookStyles} key={index}>
          <BookSkeleton hasCheckbox={!!hasCheckbox} styles={mySelectHistoryBookAdditionalStyles} />
        </SkeletonSC.LandScapeBook>
      ))}
    </SkeletonSC.LandScapeBookList>
  );
};
