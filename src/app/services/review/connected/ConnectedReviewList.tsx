import classNames from 'classnames';
import React from 'react';
import { connect, Dispatch } from 'react-redux';

import { Button, FetchRetryBlock, Icon } from '@ridi/rsg';

import { FetchStatusFlag } from 'app/constants';
import { Review } from 'app/services/review';
import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';

import { getReviewsRequest } from 'app/services/review/actions';
import { ReviewListEmpty } from 'app/services/review/components/ReviewList/ReviewEmpty';
import { ReviewPlaceholder } from 'app/services/review/components/ReviewPlaceholder';
import { ReviewSortingCriteria, UserFilterType } from 'app/services/review/constants';
import { RequestReviewsParameters } from 'app/services/review/requests';
import {
  getReviewList,
  getReviewNextPage,
  getReviewNextPageCount,
  getReviewPageFetchStatus,
  getReviewSortBy,
  getReviewUserFilterType,
} from 'app/services/review/selectors';
import { ConnectedReviewItem } from './ConnectedReviewItem';
import { ConnectedCommentList } from './ConnectedCommentList';
import { ConnectedCommentForm } from './ConnectedCommentForm';

export interface ReviewListProps {
  bookId: number;
  reviewList: Review[];
  currentUserFilterType: UserFilterType;
  currentSortBy: ReviewSortingCriteria;
  nextPage: number;
  nextPageCount: number;
  pageFetchStatus: FetchStatusFlag;
  showMoreReviews: (bookId: number, params: RequestReviewsParameters) => void;
  checkAuth: () => boolean;
}

export type ReviewListStateProps = Pick<
  ReviewListProps,
  | 'reviewList'
  | 'currentUserFilterType'
  | 'currentSortBy'
  | 'nextPage'
  | 'nextPageCount'
  | 'pageFetchStatus'
>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<ReviewListProps, keyof ReviewListStateProps | keyof ReviewListDispatchProps>,
): ReviewListStateProps {
  return {
    reviewList: getReviewList(state, ownProps),
    currentUserFilterType: getReviewUserFilterType(state, ownProps),
    currentSortBy: getReviewSortBy(state, ownProps),
    nextPage: getReviewNextPage(state, ownProps),
    nextPageCount: getReviewNextPageCount(state, ownProps),
    pageFetchStatus: getReviewPageFetchStatus(state, ownProps),
  };
}

export type ReviewListDispatchProps = Pick<ReviewListProps, 'showMoreReviews'>;

function mapDispatchToProps(dispatch: Dispatch<RidiSelectState>): ReviewListDispatchProps {
  return {
    showMoreReviews: (bookId: number, params: RequestReviewsParameters) =>
      dispatch(getReviewsRequest(bookId, params)),
  };
}

export const ReviewList: React.SFC<ReviewListProps> = props => {
  const {
    bookId,
    reviewList,
    currentUserFilterType,
    currentSortBy,
    nextPage,
    nextPageCount,
    pageFetchStatus,
    showMoreReviews,
    checkAuth,
  } = props;

  const currentPage = nextPage - 1;
  if (currentPage === 1 && pageFetchStatus === FetchStatusFlag.FETCHING) {
    return <ReviewPlaceholder />;
  }
  if (currentPage === 1 && pageFetchStatus === FetchStatusFlag.FETCH_ERROR) {
    return (
      <FetchRetryBlock
        description="리뷰를 가져오는 데 실패했습니다."
        buttonClassName="RetryFetchReviews_Button"
        onRetry={() =>
          showMoreReviews(bookId, {
            page: currentPage,
            userFilterType: currentUserFilterType,
            sortBy: currentSortBy,
          })
        }
      />
    );
  }

  return (
    <div className="ReviewsList_Wrapper">
      {reviewList.length ? (
        <ul className={classNames('ReviewList', { 'last-page': !nextPageCount })}>
          {reviewList.map(review => (
            <ConnectedReviewItem
              key={review.id}
              bookId={bookId}
              review={review}
              checkAuth={checkAuth}
            >
              <div className="Comments">
                <ConnectedCommentList bookId={bookId} reviewId={review.id} />
                <ConnectedCommentForm bookId={bookId} reviewId={review.id} checkAuth={checkAuth} />
              </div>
            </ConnectedReviewItem>
          ))}
        </ul>
      ) : (
        <ReviewListEmpty />
      )}
      {(!!nextPageCount || pageFetchStatus === FetchStatusFlag.FETCHING) && (
        <Button
          color="gray"
          size="large"
          outline
          thickBorderWidth
          spinner={pageFetchStatus === FetchStatusFlag.FETCHING}
          className="ReviewList_ShowMoreButton"
          onClick={() =>
            showMoreReviews(bookId, {
              page: nextPage,
              userFilterType: currentUserFilterType,
              sortBy: currentSortBy,
            })
          }
        >
          <>
            <span className="ReviewList_ShowMoreButton_Count">{nextPageCount}</span>개 더보기
            <Icon
              name="arrow_1_down"
              className="ReviewList_ShowMoreButton_Icon RUIButton_SVGIcon"
            />
          </>
        </Button>
      )}
    </div>
  );
};

export const ConnectedReviewList = connect(mapStateToProps, mapDispatchToProps)(ReviewList);
