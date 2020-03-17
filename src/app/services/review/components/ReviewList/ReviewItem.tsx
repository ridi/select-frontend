import React from 'react';
import MediaQuery from 'react-responsive';

import { MAX_WIDTH, MIN_WIDTH } from 'app/constants';
import { Review } from 'app/services/review';
import { ReviewClosed, ReviewSpoilerAlert, StarRating } from 'app/services/review/components';
import { ReviewButtons } from 'app/services/review/components/ReviewList/ReviewButtons';
import { ReviewContent } from 'app/services/review/components/ReviewList/ReviewContent';
import { ReviewerMetadata } from 'app/services/review/components/ReviewList/ReviewerMetadata';
import { ReviewMetadata } from 'app/services/review/components/ReviewList/ReviewMetadata';
import { ReviewFetchStatus } from 'app/services/review/reducer.state';

export interface ReviewItemProps {
  bookId: number;
  review: Review;
  fetchStatus: ReviewFetchStatus;
  isInApp: boolean;
  isIosInApp: boolean;
  submitReport: (bookId: number, reviewId: number) => void;
  postLike: (bookId: number, reviewId: number) => void;
  deleteLike: (bookId: number, reviewId: number) => void;
  checkAuth: () => boolean;
}

export interface ReviewItemState {
  isCommentSectionOpen: boolean;
  isContentOpen: boolean;
}

export class ReviewItem extends React.Component<ReviewItemProps, ReviewItemState> {
  constructor(props: ReviewItemProps) {
    super(props);
    this.state = {
      isCommentSectionOpen: false,
      isContentOpen: !(props.review.isInvisible || props.review.hasSpoiler),
    };
    this.toggleCommentSection = this.toggleCommentSection.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.openContent = this.openContent.bind(this);
    this.submitReport = this.submitReport.bind(this);
  }

  public toggleCommentSection() {
    this.setState({
      isCommentSectionOpen: !this.state.isCommentSectionOpen,
    });
  }

  public toggleLike() {
    if (!this.props.checkAuth()) {
      return;
    }
    const { bookId } = this.props;
    const reviewId = this.props.review.id;
    if (this.props.review.isLikedByMe) {
      this.props.deleteLike(bookId, reviewId);
    } else {
      this.props.postLike(bookId, reviewId);
    }
  }

  public openContent() {
    this.setState({
      isContentOpen: true,
    });
  }

  public submitReport() {
    this.props.submitReport(this.props.bookId, this.props.review.id);
  }

  public render() {
    const {
      id,
      maskedUId,
      isBuyer,
      rating,
      content,
      hasSpoiler,
      isInvisible,
      invisibilityType,
      reviewDate,
      isMyReview,
      isReportedByMe,
      likeCount,
      isLikedByMe,
      commentIdsByPage,
    } = this.props.review;
    const { checkAuth, isInApp, isIosInApp } = this.props;
    const { isCommentSectionOpen, isContentOpen } = this.state;

    return (
      <>
        <li className="ReviewItem">
          <MediaQuery maxWidth={MAX_WIDTH}>
            {isBuyer && <StarRating rating={rating} width={60} />}
            {isContentOpen ? <ReviewContent>{content}</ReviewContent> : null}
            {!isContentOpen && hasSpoiler ? (
              <ReviewSpoilerAlert onButtonClick={this.openContent} />
            ) : null}
            {isInvisible ? (
              <ReviewClosed type={invisibilityType!} isInApp={isInApp} isIosInApp={isIosInApp} />
            ) : null}
            <div className="ReviewItem_MetadataGroup">
              <div>
                <ReviewerMetadata maskedUId={maskedUId} isBuyer={isBuyer} />
                <ReviewMetadata
                  bookId={this.props.bookId}
                  reviewId={id}
                  reviewDate={reviewDate}
                  isMyReview={isMyReview}
                  isReportedByMe={isReportedByMe}
                  onReportSubmit={this.submitReport}
                  checkAuth={checkAuth}
                />
              </div>
              <div>
                <ReviewButtons
                  likeButtonFetchStatus={this.props.fetchStatus.like}
                  isCommentSectionOpen={isCommentSectionOpen}
                  commentCount={commentIdsByPage.itemCount}
                  toggleCommentSection={this.toggleCommentSection}
                  isLikedByMe={isLikedByMe}
                  likeCount={likeCount}
                  toggleLike={this.toggleLike}
                />
              </div>
            </div>
            {isCommentSectionOpen && this.props.children}
          </MediaQuery>
          <MediaQuery minWidth={MIN_WIDTH}>
            <div className="ReviewItem_Left">
              {isBuyer && <StarRating rating={rating} width={60} />}
              <ReviewerMetadata maskedUId={maskedUId} isBuyer={isBuyer} />
              <ReviewMetadata
                bookId={this.props.bookId}
                reviewId={id}
                reviewDate={reviewDate}
                isMyReview={isMyReview}
                isReportedByMe={isReportedByMe}
                onReportSubmit={this.submitReport}
                checkAuth={checkAuth}
              />
            </div>
            <div className="ReviewItem_Right">
              <div className="ReviewItem_Right_Top">
                {isContentOpen ? <ReviewContent>{content}</ReviewContent> : null}
                {!isContentOpen && hasSpoiler ? (
                  <ReviewSpoilerAlert onButtonClick={this.openContent} />
                ) : null}
                {isInvisible ? (
                  <ReviewClosed
                    type={invisibilityType!}
                    isInApp={isInApp}
                    isIosInApp={isIosInApp}
                  />
                ) : null}
                <ReviewButtons
                  likeButtonFetchStatus={this.props.fetchStatus.like}
                  isCommentSectionOpen={this.state.isCommentSectionOpen}
                  commentCount={commentIdsByPage.itemCount}
                  toggleCommentSection={this.toggleCommentSection}
                  isLikedByMe={isLikedByMe}
                  likeCount={likeCount}
                  toggleLike={this.toggleLike}
                />
              </div>
              {isCommentSectionOpen && this.props.children}
            </div>
          </MediaQuery>
          {/* 댓글 영역  */}
        </li>
      </>
    );
  }
}
