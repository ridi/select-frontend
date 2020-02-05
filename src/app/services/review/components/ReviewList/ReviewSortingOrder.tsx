import React from 'react';
import MediaQuery from 'react-responsive';

import { MAX_WIDTH, MIN_WIDTH } from 'app/constants';
import { PipeDelimitedListMenu } from 'app/hocs';
import { ReviewSortingCriteria, reviewSortingCriteriaMap } from 'app/services/review';
import { RSGTab } from 'app/services/review/components';

export interface ReviewSortingOrderProps {
  sortingCriteriaList: ReviewSortingCriteria[];
  sortBy: ReviewSortingCriteria;
  onClick: (sortingCriteria: string) => void;
}

export const ReviewSortingOrder: React.SFC<ReviewSortingOrderProps> = props => {
  const { sortingCriteriaList, sortBy, onClick } = props;

  return (
    <>
      <MediaQuery maxWidth={MAX_WIDTH}>
        <RSGTab
          tabList={sortingCriteriaList.map((key: ReviewSortingCriteria) => ({
            name: key,
            displayName: reviewSortingCriteriaMap[key],
          }))}
          selectedTabName={sortBy}
          onClick={itemName => onClick(itemName)}
          justify
        />
      </MediaQuery>
      <MediaQuery minWidth={MIN_WIDTH}>
        <PipeDelimitedListMenu
          list={sortingCriteriaList.map((key: ReviewSortingCriteria) => ({ type: key }))}
          activeItemType={sortBy}
        >
          {item => (
            <button type="button" onClick={() => onClick(item.type)}>
              {reviewSortingCriteriaMap[item.type as ReviewSortingCriteria]}
              <span className="a11y">리스트 보기</span>
            </button>
          )}
        </PipeDelimitedListMenu>
      </MediaQuery>
    </>
  );
};
