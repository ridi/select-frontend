import React from 'react';
import MediaQuery from 'react-responsive';

import { Icon } from '@ridi/rsg';
import { MAX_WIDTH, MIN_WIDTH } from 'app/constants';
import { ReviewSummary } from 'app/services/review/reducer.state';
import { StarRating } from '../StarRating/StarRating';
import { RatingBarGraph } from './RatingBarGraph';

export interface BuyerRatingSummaryProps {
  summary: ReviewSummary;
}

export interface BuyerRatingSummaryState {
  isRatingGraphDropDownOpen: boolean;
}

export const BuyerRatingSummaryVertical: React.SFC<BuyerRatingSummaryProps> = props => {
  const { buyerRatingAverage, buyerRatingCount, buyerRatingDistribution } = props.summary;

  return (
    <div className="BuyerRatingSummary">
      <p className="AverageRating_Title">구매자 별점</p>
      <div className="AverageRating_Score">
        {buyerRatingAverage.toFixed(1)} <span className="a11y">점</span>
      </div>
      <StarRating rating={buyerRatingAverage} width={76} className="AverageRating_StarRating" />
      <RatingBarGraph
        averageRating={buyerRatingAverage}
        participantCount={buyerRatingCount}
        distribution={buyerRatingDistribution}
      />
      <p className="ParticipantCount">
        <strong>{buyerRatingCount}</strong>명이 평가함
      </p>
    </div>
  );
};

export class BuyerRatingSummaryDefault extends React.Component<
  BuyerRatingSummaryProps,
  BuyerRatingSummaryState
> {
  public constructor(props: BuyerRatingSummaryProps) {
    super(props);
    this.state = {
      isRatingGraphDropDownOpen: false,
    };
    this.toggleRatingGraphDropDown = this.toggleRatingGraphDropDown.bind(this);
  }

  public toggleRatingGraphDropDown() {
    this.setState({
      isRatingGraphDropDownOpen: !this.state.isRatingGraphDropDownOpen,
    });
  }

  public render() {
    const { buyerRatingAverage, buyerRatingCount, buyerRatingDistribution } = this.props.summary;
    const { isRatingGraphDropDownOpen } = this.state;

    return (
      <div className="BuyerRatingSummary">
        <div className="BuyerRatingSummary_Left">
          <div className="BuyerRatingSummary_Left_Block">
            <p className="AverageRating_Title">구매자 별점</p>
            <StarRating
              rating={buyerRatingAverage}
              width={61}
              className="AverageRating_StarRating"
            />
          </div>
          <div className="BuyerRatingSummary_Left_Block">
            <p className="AverageRating_Score">
              {buyerRatingAverage.toFixed(1)}
              <span className="a11y">점</span>
            </p>
          </div>
        </div>
        <div className="BuyerRatingSummary_Right">
          <p className="ParticipantCount">
            <strong>{buyerRatingCount}</strong>명이 평가함
          </p>
          <button
            type="button"
            className="RatingbarGraph_ToggleButton"
            onClick={this.toggleRatingGraphDropDown}
          >
            별점 분포 보기
            <Icon
              name={isRatingGraphDropDownOpen ? 'arrow_1_up' : 'arrow_1_down'}
              className="RatingbarGraph_ToggleButton_Icon"
            />
          </button>
          {isRatingGraphDropDownOpen && (
            <div className="RatingbarGraph_DrowDown">
              <RatingBarGraph
                averageRating={buyerRatingAverage}
                participantCount={buyerRatingCount}
                distribution={buyerRatingDistribution}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const BuyerRatingSummaryBlock: React.SFC<BuyerRatingSummaryProps> = props => {
  const { summary } = props;

  return (
    <>
      <MediaQuery maxWidth={MAX_WIDTH}>
        <BuyerRatingSummaryDefault summary={summary} />
      </MediaQuery>
      <MediaQuery minWidth={MIN_WIDTH}>
        <BuyerRatingSummaryVertical summary={summary} />
      </MediaQuery>
    </>
  );
};
