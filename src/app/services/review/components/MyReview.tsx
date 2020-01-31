import classNames from 'classnames';
import React from 'react';

import { Icon } from '@ridi/rsg';

import { FetchStatusFlag } from 'app/constants';
import { Review } from 'app/services/review';
import { ReviewButtons, ReviewContent, ReviewForm } from 'app/services/review/components';
import { MyReviewFetchStatus, ReviewFetchStatus } from 'app/services/review/reducer.state';
import { TextWithLF } from 'app/types';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';

export interface MyReviewProps {
  bookId: number;
  review: Review;
  fetchStatus: ReviewFetchStatus;
  myReviewFetchStatus: MyReviewFetchStatus;
  isBeingEdited: boolean;
  selectedRating: number;
  submitReview: (bookId: number, content: string, hasSpoiler: boolean) => void;
  deleteReview: (bookId: number) => void;
  postLike: (bookId: number, reviewId: number) => void;
  deleteLike: (bookId: number, reviewId: number) => void;
  startEditing: (bookId: number) => void;
  endEditing: (bookId: number) => void;
  checkAuth: () => boolean;
  isDisabled: boolean;
}

interface MyReviewState {
  isCommentSectionOpen: boolean;
}

export class MyReview extends React.Component<MyReviewProps, MyReviewState> {
  constructor(props: MyReviewProps) {
    super(props);
    this.state = {
      isCommentSectionOpen: false,
    };
    this.toggleCommentsSection = this.toggleCommentsSection.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
    this.submitReview = this.submitReview.bind(this);
  }

  public toggleCommentsSection() {
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

  public submitReview(content: TextWithLF, hasSpoiler: boolean) {
    if (!this.props.selectedRating) {
      toast.failureMessage('별점을 먼저 입력해주세요.');
      return;
    }
    this.props.submitReview(this.props.bookId, content, hasSpoiler);
  }

  public render() {
    const { isCommentSectionOpen } = this.state;
    const { bookId, deleteReview, fetchStatus, myReviewFetchStatus, isBeingEdited, checkAuth, isDisabled } = this.props;
    if (!this.props.review || (!isBeingEdited && !this.props.review.content)) {
      return (
        <ReviewForm
          autoFocus={false}
          fetchStatus={myReviewFetchStatus.content}
          onSubmit={this.submitReview}
          checkAuth={checkAuth}
          isDisabled={isDisabled}
        />
      );
    }

    const { reviewDate, content, hasSpoiler, commentIdsByPage, isLikedByMe, likeCount } = this.props.review;
    const isSubmitting = myReviewFetchStatus.content === FetchStatusFlag.FETCHING;
    const isDeleting = myReviewFetchStatus.delete === FetchStatusFlag.FETCHING;

    return (
      <>
        {!isBeingEdited && !isSubmitting && content && (
          <div className="MyReview">
            <div className="MyReview_DataWrapper">
              {/* Review Content  */}
              <ReviewContent>
                {content}
              </ReviewContent>
              {/* timestamp, edit, delete buttons */}
              <div className="MyReview_Footer">
                <div className="MyReview_ReviewDate">
                  {buildOnlyDateFormat(reviewDate)}
                </div>
                <div className="MyReview_EditingButtons">
                  <button
                    className="MyReview_EditButton"
                    onClick={() => this.props.startEditing(bookId)}
                  >
                    <Icon name="pencil_1" className="MyReview_EditButton_Icon" />
                  </button>
                  <button
                    className={classNames([
                      'MyReview_DeleteButton',
                      { spinner: isDeleting },
                    ])}
                    onClick={() => confirm('리뷰를 삭제하시겠습니까?') && deleteReview(bookId)}
                    disabled={isDeleting}
                  >
                    <Icon name="trash_1" className="MyReview_DeleteButton_Icon" />
                  </button>
                </div>
              </div>
            </div>
            {/* Reviewbuttons */}
            <ReviewButtons
              likeButtonFetchStatus={fetchStatus.like}
              isCommentSectionOpen={isCommentSectionOpen}
              commentCount={commentIdsByPage.itemCount}
              likeCount={likeCount}
              isLikedByMe={isLikedByMe}
              toggleLike={this.toggleLike}
              toggleCommentSection={this.toggleCommentsSection}
            />
            {/* CommentList */}
            {isCommentSectionOpen && this.props.children}
          </div>
        )}

        {(isBeingEdited || isSubmitting) && (
          <ReviewForm
            autoFocus={true}
            initialHasSpoiler={hasSpoiler}
            initialReviewContent={content}
            fetchStatus={myReviewFetchStatus.content}
            onSubmit={this.submitReview}
            onCancel={() => this.props.endEditing(bookId)}
            checkAuth={checkAuth}
            isDisabled={isDisabled}
          />
        )}
      </>
    );
  }
}
