import React from 'react';

import { Icon } from '@ridi/rsg';
import { MaskedUId } from 'app/types';

export interface ReviewerMetadataProps {
  maskedUId: MaskedUId;
  isBuyer: boolean;
}

export const ReviewerMetadata: React.SFC<ReviewerMetadataProps> = (props) => {
  const { maskedUId, isBuyer } = props;

  return (
    <ul className="ReviewerMetadata_List">
      <li className="ReviewerMetadata_UserId">
        {maskedUId}
      </li>
      {isBuyer && (
        <li className="ReviewerMetadata_IsBuyerBadge">
          <Icon name="badge_buyer_1" className="ReviewerMetadata_IsBuyer_Icon" />
        </li>
      )}
    </ul>
  );
};
