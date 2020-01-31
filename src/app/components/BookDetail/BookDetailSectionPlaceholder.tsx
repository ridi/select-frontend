import { range } from 'lodash-es';
import React from 'react';

export const BookDetailSectionPlaceholder: React.SFC = () => (
  <ul className="Skeleton_Wrapper BookDetailSectionPlaceholder_List">
    {range(0, 3).map((value, index) => (
      <li className="BookDetailSectionPlaceholder_Item" key={index}>
        <p className="BookDetailSectionPlaceholder_Title Skeleton"/>
        <p className="BookDetailSectionPlaceholder_FullText Skeleton"/>
        <p className="BookDetailSectionPlaceholder_Text Skeleton"/>
      </li>
    ))}
  </ul>
);
