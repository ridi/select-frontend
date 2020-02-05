import React from 'react';

export interface BigBannerPlaceholderProps {
  minHeight: number;
}

export const BigBannerPlaceholder: React.FunctionComponent<BigBannerPlaceholderProps> = props => (
  <div className="BigBannerSkeleton Skeleton_Wrapper">
    <div className="Skeleton" style={{ height: props.minHeight }} />
  </div>
);
