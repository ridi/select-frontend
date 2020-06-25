import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import { useSelector } from 'react-redux';

import { Button, RSGButtonColor } from 'app/components/RSG';
import { getIsMobile } from 'app/services/commonUI/selectors';
import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';
import ThreeDot from 'svgs/ThreeDot.svg';
import ArrowLeft from 'svgs/ArrowNoneDashLeft.svg';
import ArrowRight from 'svgs/ArrowNoneDashRight.svg';

const DefaultHeight = 30;
const defaultButtonStyle = css`
  display: inline-block;
  min-width: 42px;
  height: ${DefaultHeight + 2}px;
  margin-left: -1px;
  padding: 0 10px;
  line-height: ${DefaultHeight}px;
  font-family: Roboto, sans-serif;
`;
const goIconStyle = css`
  width: 6px;
  height: 9px;
  fill: ${Colors.slategray_50};
`;
const SC = {
  Pagination: styled.div`
    padding: 0;
    height: auto;
    padding-bottom: 40px;

    @media ${Media.PC} {
      padding-bottom: 60px;
    }
  `,
  Wrapper: styled.div`
    height: ${DefaultHeight}px;
    margin: 0;
    padding: 40px 0 0 0;
    line-height: ${DefaultHeight}px;
    text-align: center;
    white-space: nowrap;
  `,
  Button: styled(Button)`
    ${defaultButtonStyle}
  `,
  Group: styled.div`
    white-space: nowrap;
    display: inline-block;
    margin: 0 6px;
  `,
  GroupButton: styled(Button)`
    ${defaultButtonStyle}
    position: relative;
    z-index: 1;
    margin: 0 0 0 -1px;
    border-radius: 0;
    &:not(:disabled):focus,
    &:not(:disabled):active {
      z-index: 2;
    }
    &:first-of-type {
      margin-left: 0;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-of-type {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  `,
  DotIcon: styled(ThreeDot)`
    display: inline-block;
    width: 8px;
    height: ${DefaultHeight}px;
    padding: 0 6px;
    vertical-align: middle;
    fill: ${Colors.slategray_20};
  `,
  GoPrevIcon: styled(ArrowLeft)`
    ${goIconStyle}
  `,
  GoNextIcon: styled(ArrowRight)`
    ${goIconStyle}
  `,
};

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  item: {
    el?: React.ReactType;
    getProps?: (page: number) => any;
  };
}

// TODO: 추후 Ridi Web UI 업데이트 되고 반영하게 되면 아래 페이지네이션 코드는 Ridi Web UI로 대체되어야 함.
export const Pagination: React.SFC<PaginationProps> = props => {
  const isMobile = useSelector(getIsMobile);
  const { currentPage, totalPages, item } = props;
  const { el = 'a', getProps = (page?: number) => ({}) } = item;

  const { max, min, floor } = Math;
  const buttonRangeCount = isMobile ? 5 : 10;
  const paginationIdx =
    currentPage % buttonRangeCount === 0
      ? floor(currentPage / buttonRangeCount) - 1
      : floor(currentPage / buttonRangeCount);

  const startPageNum = max(paginationIdx * buttonRangeCount + 1, 1);
  const endPageNum = min(startPageNum + (buttonRangeCount - 1), totalPages);
  const pageNumbers = Array.from(
    { length: endPageNum - startPageNum + 1 },
    (v, k) => k + startPageNum,
  );

  const isDisplayGoPrev = startPageNum > buttonRangeCount;
  const isDisplayGoNext = totalPages > endPageNum;

  return (
    <SC.Pagination>
      {totalPages > 1 && (
        <nav aria-label="페이지 내비게이션">
          <h2 className="a11y">페이지 내비게이션</h2>
          <SC.Wrapper>
            {!isMobile && isDisplayGoPrev && (
              <>
                <SC.Button
                  component={el}
                  color={RSGButtonColor.GRAY}
                  outline
                  aria-label="첫 페이지"
                  {...getProps(1)}
                >
                  처음
                </SC.Button>
                <SC.DotIcon />
              </>
            )}
            {isDisplayGoPrev && (
              <SC.Button
                component={el}
                color={RSGButtonColor.GRAY}
                outline
                aria-label="이전 페이지"
                {...getProps(startPageNum - buttonRangeCount)}
              >
                <SC.GoPrevIcon />
              </SC.Button>
            )}
            <SC.Group>
              {pageNumbers.map(pageNumber => (
                <SC.GroupButton
                  component={el}
                  color={currentPage === pageNumber ? RSGButtonColor.BLUE : RSGButtonColor.GRAY}
                  outline={!(currentPage === pageNumber)}
                  aria-label={`${pageNumber} 페이지`}
                  key={pageNumber}
                  {...getProps(pageNumber)}
                >
                  {pageNumber}
                </SC.GroupButton>
              ))}
            </SC.Group>
            {isDisplayGoNext && (
              <SC.Button
                component={el}
                color={RSGButtonColor.GRAY}
                outline
                aria-label="다음 페이지"
                {...getProps(endPageNum + 1)}
              >
                <SC.GoNextIcon />
              </SC.Button>
            )}
            {!isMobile && isDisplayGoNext && (
              <>
                <SC.DotIcon />
                <SC.Button
                  component={el}
                  color={RSGButtonColor.GRAY}
                  outline
                  aria-label="마지막 페이지"
                  {...getProps(totalPages)}
                >
                  마지막
                </SC.Button>
              </>
            )}
          </SC.Wrapper>
        </nav>
      )}
    </SC.Pagination>
  );
};
