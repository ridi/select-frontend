import * as React from 'react';

// Book Services
import { BookReviewSummary } from 'app/services/book';
import { GNBColorLevel } from 'app/services/commonUI';
import { StarRating } from 'app/services/review/components';

import { thousandsSeperator } from 'app/utils';

interface Props {
  reviewSummary?: BookReviewSummary;
  isMobile: boolean;
  gnbColorLevel: GNBColorLevel;
}

export const BookDetailRating = (props: Props) => {
  const { reviewSummary, isMobile, gnbColorLevel } = props;

  return (
    <>
      {
        reviewSummary &&
        <>
          <StarRating
            rating={reviewSummary.buyerRatingAverage}
            width={74}
            darkBackground={!isMobile && gnbColorLevel !== GNBColorLevel.BRIGHT}
          />
          <span className="PageBookDetail_RatingSummaryAverage">{`${
            reviewSummary.buyerRatingAverage
            }점`}</span>
          <span className="PageBookDetail_RatingSummaryCount">{`(${
            thousandsSeperator(reviewSummary.buyerRatingCount)
            }명)`}</span>
        </>
      }
    </>
  );

};
