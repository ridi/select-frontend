import React from 'react';
import { connect, Dispatch } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';

import { changeSortBy, changeUserFilterTab } from 'app/services/review/actions';
import { ReviewListTab, ReviewSortingOrder } from 'app/services/review/components';
import { ReviewSortingCriteria, UserFilterType } from 'app/services/review/constants';
import { ReviewSummary } from 'app/services/review/reducer.state';
import {
  getCurrentReviewSortingCriteriaList,
  getReviewSortBy,
  getReviewSummary,
  getReviewUserFilterType,
} from 'app/services/review/selectors';

export interface ReviewListHeaderProps {
  bookId: number;
  currentUserFilterType: UserFilterType;
  currentSortBy: ReviewSortingCriteria;
  summary: ReviewSummary;
  sortingCriteriaList: ReviewSortingCriteria[];
  changeTab: (bookId: number, tabName: UserFilterType) => void;
  changeOrder: (bookId: number, sortByName: ReviewSortingCriteria) => void;
}

export type ReviewListHeaderStateProps = Pick<
ReviewListHeaderProps,
'currentUserFilterType' | 'currentSortBy' | 'summary' | 'sortingCriteriaList'
>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<ReviewListHeaderProps, keyof ReviewListHeaderStateProps | keyof ReviewListHeaderDispatchProps>,
): ReviewListHeaderStateProps {
  return {
    currentUserFilterType: getReviewUserFilterType(state, ownProps),
    currentSortBy: getReviewSortBy(state, ownProps),
    summary: getReviewSummary(state, ownProps),
    sortingCriteriaList: getCurrentReviewSortingCriteriaList(state, ownProps),
  };
}

export type ReviewListHeaderDispatchProps = Pick<
ReviewListHeaderProps,
'changeTab' | 'changeOrder'
>;

function mapDispatchToProps(
  dispatch: Dispatch<RidiSelectState>,
): ReviewListHeaderDispatchProps {
  return {
    changeTab: (bookId: number, tabName: UserFilterType) => dispatch(changeUserFilterTab(bookId, tabName)),
    changeOrder: (bookId: number, sortByName: ReviewSortingCriteria) => dispatch(changeSortBy(bookId, sortByName)),
  };
}

export const ReviewListHeader: React.SFC<ReviewListHeaderProps> = (props) => {
  const {
    bookId,
    currentUserFilterType,
    currentSortBy,
    changeOrder,
    changeTab,
    sortingCriteriaList,
  } = props;
  const {
    buyerReviewCount,
    totalReviewCount,
  } = props.summary;

  return (
    <div className="ReviewListHeader">
      <ReviewListTab
        tabList={[{
          name: UserFilterType.buyer,
          displayName: '구매자',
          count: buyerReviewCount,
        }, {
          name: UserFilterType.total,
          displayName: '전체',
          count: totalReviewCount,
        }]}
        selectedTabName={currentUserFilterType}
        onClick={(tabName: UserFilterType) => changeTab(bookId, tabName)}
      />
      <ReviewSortingOrder
        sortingCriteriaList={sortingCriteriaList}
        sortBy={currentSortBy}
        onClick={(sortByName: ReviewSortingCriteria) => changeOrder(bookId, sortByName)}
      />
    </div>
  );
};

export const ConnectedReviewListHeader =
  connect(mapStateToProps, mapDispatchToProps)(ReviewListHeader);
