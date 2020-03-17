import classNames from 'classnames';
import React from 'react';
import MediaQuery from 'react-responsive';

import { FetchStatusFlag, MAX_WIDTH, MIN_WIDTH } from 'app/constants';
import {
  CancelButton,
  SpoilerCheckbox,
  SubmitButton,
  ToggleNoticeButton,
} from './ReviewFormSubInputs';
import { ReviewNotice } from './ReviewNotice';
import { ReviewTextarea } from './ReviewTextarea';

interface ReviewFormProps {
  fetchStatus: FetchStatusFlag;
  autoFocus: boolean;
  initialHasSpoiler?: boolean;
  initialReviewContent?: string;
  onSubmit: (reviewContent: string, hasSpoiler: boolean) => void;
  onCancel?: () => void;
  checkAuth: () => boolean;
  isDisabled: boolean;
}

interface ReviewFormState {
  isNoticeOpen: boolean;
  hasSpoiler: boolean;
  reviewContent: string;
}

export class ReviewForm extends React.Component<ReviewFormProps, ReviewFormState> {
  constructor(props: ReviewFormProps) {
    super(props);
    this.state = {
      isNoticeOpen: false,
      hasSpoiler: props.initialHasSpoiler || false,
      reviewContent: props.initialReviewContent || '',
    };
    this.toggleNotice = this.toggleNotice.bind(this);
    this.onChangeReviewContent = this.onChangeReviewContent.bind(this);
    this.onChangeSpoilerCheckbox = this.onChangeSpoilerCheckbox.bind(this);
    this.checkAuth = this.checkAuth.bind(this);
  }

  public toggleNotice() {
    this.setState({
      isNoticeOpen: !this.state.isNoticeOpen,
    });
  }

  public onChangeReviewContent(event: React.ChangeEvent<any>) {
    this.setState({
      reviewContent: event.target.value,
    });
  }

  public onChangeSpoilerCheckbox(event: React.ChangeEvent<any>) {
    this.setState({
      hasSpoiler: event.target.checked,
    });
  }

  public checkAuth(event: React.ChangeEvent<any>) {
    if (!this.props.checkAuth()) {
      event.preventDefault();
    }
  }

  public render() {
    const { isNoticeOpen, reviewContent, hasSpoiler } = this.state;
    const {
      fetchStatus,
      autoFocus,
      initialReviewContent,
      onSubmit,
      onCancel = () => null,
      isDisabled,
    } = this.props;

    return (
      <div className="ReviewForm">
        <ReviewTextarea
          autoFocus={autoFocus}
          content={reviewContent}
          onClick={this.checkAuth}
          onChange={this.onChangeReviewContent}
          isDisabled={isDisabled}
        />
        <MediaQuery maxWidth={MAX_WIDTH}>
          <div className="ReviewForm_SubInputs">
            <SpoilerCheckbox isChecked={hasSpoiler} onChange={this.onChangeSpoilerCheckbox} />
            {!initialReviewContent && (
              <ToggleNoticeButton isPressed={isNoticeOpen} onClick={this.toggleNotice} />
            )}
          </div>
          <ul className="ReviewForm_MainButtonList">
            {initialReviewContent && (
              <li className="ReviewForm_CancelButtonItem">
                <CancelButton isFullButton onClick={onCancel} />
              </li>
            )}
            <li className="ReviewForm_SubmitButtonItem">
              <SubmitButton
                isFetching={fetchStatus === FetchStatusFlag.FETCHING}
                isDisabled={reviewContent.length < 10}
                isFullButton
                onClick={() => onSubmit(reviewContent, hasSpoiler)}
              >
                {initialReviewContent ? '수정 완료' : '리뷰 남기기'}
              </SubmitButton>
            </li>
          </ul>
        </MediaQuery>
        <MediaQuery minWidth={MIN_WIDTH}>
          <div
            className={classNames([
              'ReviewForm_ButtonsWrapper',
              { 'flex-end': !!initialReviewContent },
            ])}
          >
            {!initialReviewContent && (
              <ToggleNoticeButton isPressed={isNoticeOpen} onClick={this.toggleNotice} />
            )}
            <div>
              <SpoilerCheckbox isChecked={hasSpoiler} onChange={this.onChangeSpoilerCheckbox} />
              {initialReviewContent && <CancelButton onClick={onCancel} />}
              <SubmitButton
                isFetching={fetchStatus === FetchStatusFlag.FETCHING}
                isDisabled={reviewContent.length < 10}
                onClick={() => onSubmit(reviewContent, hasSpoiler)}
              >
                {initialReviewContent ? '수정 완료' : '리뷰 남기기'}
              </SubmitButton>
            </div>
          </div>
        </MediaQuery>
        {!initialReviewContent && isNoticeOpen && <ReviewNotice />}
      </div>
    );
  }
}
