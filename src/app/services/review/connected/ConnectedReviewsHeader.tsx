import { MAX_WIDTH, MIN_WIDTH } from 'app/constants';
import { BuyerRatingSummaryBlock } from 'app/services/review/components';
import { ConnectedCommentForm } from 'app/services/review/connected/ConnectedCommentForm';
import { ConnectedCommentList } from 'app/services/review/connected/ConnectedCommentList';
import { ConnectedMyReview } from 'app/services/review/connected/ConnectedMyReview';
import { ConnectedStarRatingForm } from 'app/services/review/connected/ConnectedStarRatingForm';
import { ReviewSummary } from 'app/services/review/reducer.state';
import { getMyReview, getReviewSummary } from 'app/services/review/selectors';
import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';
import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

interface ReviewsHeaderProps {
  bookId: number;
  myReviewId: number;
  reviewSummary: ReviewSummary;
  checkAuth: () => boolean;
}

export type ReviewsHeaderStateProps = Pick<ReviewsHeaderProps, 'reviewSummary' | 'myReviewId'>;

function mapStateToProps(
  state: RidiSelectState,
  ownProps: Omit<ReviewsHeaderProps, keyof ReviewsHeaderStateProps>,
): ReviewsHeaderStateProps {
  return {
    reviewSummary: getReviewSummary(state, ownProps),
    myReviewId: getMyReview(state, ownProps).id,
  };
}

export const ReviewsHeader: React.SFC<ReviewsHeaderProps> = props => {
  const { bookId, myReviewId, reviewSummary, checkAuth } = props;

  return (
    <>
      <MediaQuery maxWidth={MAX_WIDTH}>
        <BuyerRatingSummaryBlock summary={reviewSummary} />
        <div className="ReviewsHeader_Dark">
          <ConnectedStarRatingForm bookId={bookId} checkAuth={checkAuth} />
          <ConnectedMyReview bookId={bookId} checkAuth={checkAuth}>
            <div className="Comments">
              <ConnectedCommentList bookId={bookId} reviewId={myReviewId} />
              <ConnectedCommentForm bookId={bookId} reviewId={myReviewId} checkAuth={checkAuth} />
            </div>
          </ConnectedMyReview>
        </div>
      </MediaQuery>
      <MediaQuery minWidth={MIN_WIDTH}>
        <div className="ReviewsHeader">
          <BuyerRatingSummaryBlock summary={reviewSummary} />
          <div className="ReviewsHeader_Right">
            <ConnectedStarRatingForm bookId={bookId} checkAuth={checkAuth} />
            <ConnectedMyReview bookId={bookId} checkAuth={checkAuth}>
              <div className="Comments">
                <ConnectedCommentList bookId={bookId} reviewId={myReviewId} />
                <ConnectedCommentForm bookId={bookId} reviewId={myReviewId} checkAuth={checkAuth} />
              </div>
            </ConnectedMyReview>
          </div>
        </div>
      </MediaQuery>
    </>
  );
};

export const ConnectedReviewsHeader = connect(mapStateToProps)(ReviewsHeader);
