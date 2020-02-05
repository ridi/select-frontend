import React from 'react';
import { connect, Dispatch } from 'react-redux';

import { FetchRetryBlock } from '@ridi/rsg';
import { FetchStatusFlag } from 'app/constants';
import { getReviewsRequest } from 'app/services/review/actions';
import { AboutIndicatingBuyer } from 'app/services/review/components';
import { ReviewPlaceholder } from 'app/services/review/components/ReviewPlaceholder';
import { ConnectedReviewList } from 'app/services/review/connected/ConnectedReviewList';
import { ConnectedReviewListHeader } from 'app/services/review/connected/ConnectedReviewListHeader';
import { ConnectedReviewsHeader } from 'app/services/review/connected/ConnectedReviewsHeader';
import { ReviewSortingCriteria, UserFilterType } from 'app/services/review/constants';
import { ReviewsSet } from 'app/services/review/reducer.state';
import { getReviewsSetFetchStatus } from 'app/services/review/selectors';
import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';

interface ReviewsProps {
  bookId: number;
  reviewsSetFetchStatus: FetchStatusFlag;
  reviewsSet: ReviewsSet;
  checkAuth: () => boolean;
  getReviews: (bookId: number) => void;
}

export type ReviewsStateProps = Pick<ReviewsProps, 'reviewsSetFetchStatus' | 'reviewsSet'>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<ReviewsProps, keyof ReviewsStateProps | keyof ReviewsDispatchProps>,
): ReviewsStateProps {
  return {
    reviewsSetFetchStatus: getReviewsSetFetchStatus(state, ownProps),
    reviewsSet: state.reviewsByBookId[ownProps.bookId],
  };
}

export type ReviewsDispatchProps = Pick<ReviewsProps, 'getReviews'>;

function mapDispatchToProps(dispatch: Dispatch<RidiSelectState>): ReviewsDispatchProps {
  return {
    getReviews: (bookId: number) =>
      dispatch(
        getReviewsRequest(bookId, {
          userFilterType: UserFilterType.buyer,
          sortBy: ReviewSortingCriteria.latest,
          page: 1,
        }),
      ),
  };
}

export class Reviews extends React.Component<ReviewsProps> {
  constructor(props: ReviewsProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.getReviews(this.props.bookId);
  }

  public componentDidUpdate(prevProps: ReviewsProps) {
    if (this.props.bookId !== prevProps.bookId) {
      this.props.getReviews(this.props.bookId);
    }
  }

  public render() {
    const { bookId, reviewsSetFetchStatus, reviewsSet, getReviews, checkAuth } = this.props;
    if (!reviewsSet || reviewsSetFetchStatus === FetchStatusFlag.FETCHING) {
      return <ReviewPlaceholder />;
    }
    if (reviewsSetFetchStatus === FetchStatusFlag.FETCH_ERROR) {
      return (
        <FetchRetryBlock
          description="리뷰를 가져오는 데 실패했습니다."
          buttonClassName="RetryFetchReviews_Button"
          onRetry={() => getReviews(bookId)}
        />
      );
    }

    return (
      <div className="Reviews">
        <span className="a11y">리뷰</span>
        <ConnectedReviewsHeader bookId={bookId} checkAuth={checkAuth} />
        <ConnectedReviewListHeader bookId={bookId} />
        <ConnectedReviewList bookId={bookId} checkAuth={checkAuth} />
        <AboutIndicatingBuyer />
      </div>
    );
  }
}

export const ConnectedReviews = connect(mapStateToProps, mapDispatchToProps)(Reviews);
