import React from 'react';

export interface MyStarRatingStatusProps {
  rating: number;
  isRatingCancelable: boolean;
  onCancel: () => void;
}

export const MyStarRatingStatus: React.SFC<MyStarRatingStatusProps> = (props) => {
  const { rating, isRatingCancelable, onCancel } = props;

  return (
    <div className="MyStarRatingStatus">
      <p className="MyStarRatingStatus_Description">
        내가 남긴 별점
        <span className="MyStarRatingStatus_Rating">{rating}.0</span>
      </p>
      {isRatingCancelable && (
        <button
          className="MyStarRatingStatus_CancelButton"
          type="button"
          onClick={onCancel}
        >
          취소
        </button>
      )}
    </div>
  );
};
