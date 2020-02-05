import { range } from 'lodash-es';
import React from 'react';

export const ReviewPlaceholder: React.SFC = () => (
  <ul className="Skeleton_Wrapper ReviewPlaceholder_List">
    {range(0, 3).map((value, index) => (
      <li className="ReviewPlaceholder_Item" key={index}>
        <p className="ReviewPlaceholder_Title Skeleton" />
        <p className="ReviewPlaceholder_FullText Skeleton" />
        <p className="ReviewPlaceholder_Text Skeleton" />
      </li>
    ))}
  </ul>
);
