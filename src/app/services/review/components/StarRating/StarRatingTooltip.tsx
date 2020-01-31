import React from 'react';

import { Icon } from '@ridi/rsg';

interface StarRatingTooltipProps {
  rating: number;
  isRatingCancelable: boolean;
}

export const StarRatingTooltip: React.SFC<StarRatingTooltipProps> = (props) => {
  const { rating, isRatingCancelable } = props;

  if (isRatingCancelable) {
    return (
      <p className="StarRatingTooltip_Tooltip dimmed">
         별점 취소
        <Icon name="arrow_1_down" className="StarRatingTooltip_Icon" />
      </p>
    );
  }

  switch (rating) {
    case 1:
      return (
        <p className="StarRatingTooltip_Tooltip">
          별로예요
          <Icon name="arrow_1_down" className="StarRatingTooltip_Icon" />
        </p>
      );
    case 2:
      return (
        <p className="StarRatingTooltip_Tooltip">
          그저 그래요
          <Icon name="arrow_1_down" className="StarRatingTooltip_Icon" />
        </p>
      );
    case 3:
      return (
        <p className="StarRatingTooltip_Tooltip">
          보통이에요
          <Icon name="arrow_1_down" className="StarRatingTooltip_Icon" />
        </p>
      );
    case 4:
      return (
        <p className="StarRatingTooltip_Tooltip">
          좋아요
          <Icon name="arrow_1_down" className="StarRatingTooltip_Icon" />
        </p>
      );
    case 5:
      return (
        <p className="StarRatingTooltip_Tooltip">
          최고예요
          <Icon name="arrow_1_down" className="StarRatingTooltip_Icon" />
        </p>
      );
    default:
      return (
        <p className="StarRatingTooltip_Guide">
          이 책을 평가해주세요!
        </p>
      );
  }
};
