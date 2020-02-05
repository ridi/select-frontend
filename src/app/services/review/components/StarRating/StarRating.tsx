import classNames from 'classnames';
import React from 'react';

const MAX_RATE = 5;

// default icon size
const DEFAULT_WIDTH = 52;
const RATIO = 0.199;
export interface StarRatingProps {
  rating: number;
  width?: number;
  darkBackground?: boolean;
  className?: any;
}

export const StarRating: React.SFC<StarRatingProps> = props => {
  const { rating, width = DEFAULT_WIDTH, className } = props;

  const height = Math.ceil(width * RATIO);

  const inlineStyleIconSize = {
    width,
    height,
  };

  const inlineStyleForegroundWrapperSize = {
    width: width * (rating / MAX_RATE),
    height,
  };

  return (
    <span
      className={classNames('StarRating_IconBox', className, { dark: props.darkBackground })}
      style={inlineStyleIconSize}
    >
      <span className="StarRating_Icon_Background" style={inlineStyleIconSize} />
      <span className="StarRating_Icon_Foreground_Mask" style={inlineStyleForegroundWrapperSize}>
        <span className="StarRating_Icon_Foreground" style={inlineStyleIconSize} />
      </span>
    </span>
  );
};
