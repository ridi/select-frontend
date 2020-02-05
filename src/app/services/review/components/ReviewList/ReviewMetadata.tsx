import React from 'react';

import { ReportPopup } from 'app/services/review/components/ReviewList/ReportPopup';
import { DateDTO } from 'app/types';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';

export interface ReviewMetadataProps {
  bookId: number;
  reviewId: number;
  reviewDate: DateDTO;
  isMyReview: boolean;
  isReportedByMe: boolean;
  onReportSubmit: () => void;
  checkAuth: () => boolean;
}

export interface ReviewMetadataState {
  isReportPopupOpen: boolean;
}

export class ReviewMetadata extends React.Component<ReviewMetadataProps, ReviewMetadataState> {
  constructor(props: ReviewMetadataProps) {
    super(props);
    this.state = {
      isReportPopupOpen: false,
    };
    this.openReportPopup = this.openReportPopup.bind(this);
    this.closeReportPopup = this.closeReportPopup.bind(this);
  }

  public openReportPopup() {
    if (!this.props.checkAuth()) {
      return;
    }
    if (this.props.isReportedByMe) {
      toast.failureMessage('이미 해당 리뷰를 신고했습니다.');
      return;
    }
    this.setState({
      isReportPopupOpen: true,
    });
  }

  public closeReportPopup() {
    this.setState({
      isReportPopupOpen: false,
    });
  }

  public render() {
    const { bookId, reviewId, reviewDate, isMyReview } = this.props;

    return (
      <ul className="ReviewMetadata_List">
        <li className="ReviewMetadata_Date">{buildOnlyDateFormat(this.props.reviewDate)}</li>
        {!this.props.isMyReview && (
          <li className="ReviewMetadata_Report">
            <button
              className="ReviewMetadata_ReportButton"
              type="button"
              onClick={this.openReportPopup}
            >
              신고
            </button>
          </li>
        )}
        {this.state.isReportPopupOpen && (
          <ReportPopup
            bookId={bookId}
            reviewId={reviewId}
            close={this.closeReportPopup}
            onSubmitCallback={this.props.onReportSubmit}
          />
        )}
      </ul>
    );
  }
}
