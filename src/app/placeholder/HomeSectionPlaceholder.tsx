import React from 'react';

import {
  ChartBookListSkeleton,
  InlineHorizontalBookListSkeleton,
  SpotlightBookListSkeleton,
} from 'app/placeholder/BookListPlaceholder';
import { CollectionType } from 'app/services/home';

interface HomeSectionPlaceholderProps {
  type?: CollectionType;
}

export const HomeSectionPlaceholder: React.SFC<HomeSectionPlaceholderProps> = props => {
  if (props.type && props.type === CollectionType.CHART) {
    return (
      <div className="HomeSection_Skeleton HomeSection_Chart_Skeleton">
        <div className="HomeSection_Header Skeleton" />
        <ChartBookListSkeleton />
      </div>
    );
  }
  if (props.type && props.type === CollectionType.SPOTLIGHT) {
    return (
      <div className="HomeSection_Spotlight_Skeleton HomeSection_Spotlight">
        <div className="HomeSection_Spotlight_Contents">
          <div className="HomeSection_Spotlight_Title_Skeleton Skeleton" />
          <SpotlightBookListSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className="HomeSection_Skeleton">
      <div className="HomeSection_Header Skeleton" />
      <InlineHorizontalBookListSkeleton />
    </div>
  );
};
