import React from 'react';

import { Popup } from '@ridi/rsg';
import { RUIRadioInput } from 'app/services/review/components';
import { requestReportReview } from 'app/services/review/requests';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';

const reportReasonMap: { [key: number]: string } = {
  10: '욕설/비속어',
  20: '타인/특정 종교/민족/계층 비방',
  30: '홍보 및 반복적인 내용',
  40: '음란성/선정성',
  50: '저작권상 문제의 소지가 있는 내용',
  60: '결말을 알 수 있는 내용(스포일러)',
};

interface ReviewPopupProps {
  bookId: number;
  reviewId: number;
  close: () => void; // close popup
  onSubmitCallback: () => void; // change report status
}

interface ReportPopupState {
  selectedReasonValue: number;
  isSubmitting: boolean;
}

export class ReportPopup extends React.Component<ReviewPopupProps, ReportPopupState> {
  constructor(props: ReviewPopupProps) {
    super(props);
    this.state = {
      selectedReasonValue: 0,
      isSubmitting: false,
    };
    this.onChangeReportReason = this.onChangeReportReason.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public onChangeReportReason(event: React.ChangeEvent<any>) {
    this.setState({
      selectedReasonValue: Number(event.target.value),
    });
  }

  public onSubmit() {
    if (this.state.isSubmitting) {
      return;
    }

    this.setState({
      isSubmitting: true,
    });

    if (!this.state.selectedReasonValue) {
      toast.failureMessage('신고하는 이유를 선택해주세요.');
      this.setState({
        isSubmitting: false,
      });
      return;
    }

    requestReportReview(
      this.props.bookId,
      this.props.reviewId,
      this.state.selectedReasonValue,
    ).then((response) => {
      if (response.status === 200) {
        this.props.onSubmitCallback();
        toast.success('신고가 접수되었습니다.');
        this.props.close();
      } else {
        toast.failureMessage();
      }
    }).catch((e) => {
      showMessageForRequestError(e);
    }).finally(() => {
      this.setState({
        isSubmitting: false,
      });
    });
  }

  public render() {
    const { selectedReasonValue, isSubmitting } = this.state;
    const inputName = 'report-reason';

    return (
      <div className="ReportPopup">
        <Popup
          title="리뷰 신고하기"
          active={true}
          useButtons={true}
          showFooterHr={false}
          cancelButtonName="취소"
          onCancel={this.props.close}
          confirmButtonName="신고하기"
          onConfirm={this.onSubmit}
          isSubmitting={isSubmitting}
        >
          <span className="ReportPopup_Header">신고하는 이유를 선택해주세요.</span>
          <ul className="ReportPopup_RadioInputList">
            {Object.keys(reportReasonMap).map((reasonValue) => (
              <li key={reasonValue} className="ReportPopup_RadioInputItem">
                <RUIRadioInput
                  id={`${inputName}${Number(reasonValue)}`}
                  inputName={inputName}
                  value={Number(reasonValue)}
                  displayName={reportReasonMap[Number(reasonValue)]}
                  isChecked={Number(reasonValue) === selectedReasonValue}
                  onChange={this.onChangeReportReason}
                />
              </li>
            ))}
          </ul>
        </Popup>
      </div>
    );
  }
}
