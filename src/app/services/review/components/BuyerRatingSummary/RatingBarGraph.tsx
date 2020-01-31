import React from 'react';

import { Icon } from '@ridi/rsg';

export interface RatingBarGraphProps {
  distribution: number[];
  averageRating: number;
  participantCount: number;
}

export const RatingBarGraph: React.SFC<RatingBarGraphProps> = (props) => {
  const { distribution, averageRating, participantCount: totalParticipantCount } = props;

  return (
    <ul className="RatingBarGraph_List">
      {distribution.map((participantCount, index) => (
        <li key={index} className="RatingBarGraph_Item">
          <Icon name="star_filled" className="RatingBarGraph_StarIcon" /> {index + 1}
          <span className="RatingBarGraph_Background">
            <span
              className="RatingBarGraph_Bar"
              style={{ width: totalParticipantCount === 0 ? 0 : `${participantCount / totalParticipantCount * 100}%` }}
            />
          </span>
        </li>
      )).reverse()}
    </ul>
  );
};
