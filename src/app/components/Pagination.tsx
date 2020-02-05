import { Button, Group, Icon } from '@ridi/rsg';
import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isMobile: boolean;
  item: {
    el?: React.ReactType;
    getProps?: (page: number) => any;
  };
}

// TODO: 추후 Ridi Web UI 업데이트 되고 반영하게 되면 아래 페이지네이션 코드는 Ridi Web UI로 대체되어야 함.
export const Pagination: React.SFC<PaginationProps> = props => {
  const { currentPage, totalPages, isMobile, item } = props;
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
    <div className="Pagination">
      {totalPages > 1 && (
        <nav aria-label="페이지 내비게이션">
          <h2 className="a11y indent_hidden">페이지 내비게이션</h2>
          <ul className="PaginationWrapper">
            {!isMobile && isDisplayGoPrev && (
              <>
                <Button
                  component={el}
                  color="gray"
                  outline
                  className="Pagination_Button museoSans"
                  aria-label="첫 페이지"
                  {...getProps(1)}
                >
                  처음
                </Button>
                <span className="Pagination_Dots">
                  <Icon name="dotdotdot" className="Pagination_DeviderIcon" />
                </span>
              </>
            )}
            {isDisplayGoPrev && (
              <Button
                component={el}
                color="gray"
                outline
                className="Pagination_Button museoSans"
                aria-label="이전 페이지"
                {...getProps(startPageNum - buttonRangeCount)}
              >
                <Icon name="arrow_8_left" className="Pagination_GoPrevIcon" />
              </Button>
            )}
            <Group className="Pagination_Group">
              {pageNumbers.map(pageNumber => (
                <Button
                  component={el}
                  className="Pagination_Button museoSans RUIGroup_Element"
                  color={currentPage === pageNumber ? 'blue' : 'gray'}
                  outline={!(currentPage === pageNumber)}
                  aria-label={`${pageNumber} 페이지`}
                  key={pageNumber}
                  {...getProps(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}
            </Group>
            {isDisplayGoNext && (
              <Button
                component={el}
                color="gray"
                outline
                className="Pagination_Button museoSans"
                aria-label="다음 페이지"
                {...getProps(endPageNum + 1)}
              >
                <Icon name="arrow_8_right" className="Pagination_GoNextIcon" />
              </Button>
            )}
            {!isMobile && isDisplayGoNext && (
              <>
                <span className="Pagination_Dots">
                  <Icon name="dotdotdot" className="Pagination_DeviderIcon" />
                </span>
                <Button
                  component={el}
                  color="gray"
                  outline
                  className="Pagination_Button museoSans"
                  aria-label="마지막 페이지"
                  {...getProps(totalPages)}
                >
                  마지막
                </Button>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};
