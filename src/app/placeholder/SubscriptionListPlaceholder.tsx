import { range } from 'lodash-es';
import React from 'react';

export const SubscriptionListPlaceholder: React.SFC = () => (
  <ul className="SubscriptionList_Skeleton">
    {range(0, 3).map((value, index) => (
      <li className="SubscriptionItem_Skeleton" key={`subscription_item_${index}`}>
        <div className="SubscriptionTitle_Skeleton Skeleton" />
        <div className="SubscriptionDescription_Skeleton Skeleton" />
      </li>
    ))}
  </ul>
);
