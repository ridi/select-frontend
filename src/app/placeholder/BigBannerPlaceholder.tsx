import React from 'react';
import styled from '@emotion/styled';

import { skeletonWrapper, skeleton } from 'app/styles/skeleton';

export interface BigBannerPlaceholderProps {
  minHeight: number;
}

const SkeletonWrapper = styled.div`
  ${skeletonWrapper}
  min-height: 0;
`;

const Skeleton = styled.div`
  ${skeleton}
  position: relative;
  width: 100%;
  height: 432px;
  @media (min-width: 433px) {
    height: 432px;
    padding-top: 0;
  }
`;

export const BigBannerPlaceholder: React.FunctionComponent<BigBannerPlaceholderProps> = props => (
  <SkeletonWrapper>
    <Skeleton style={{ height: props.minHeight }} />
  </SkeletonWrapper>
);
