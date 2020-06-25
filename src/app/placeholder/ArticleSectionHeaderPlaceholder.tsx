import React from 'react';
import styled from '@emotion/styled';

import { skeleton } from 'app/styles/skeleton';

const Skeleton = styled.div`
  ${skeleton}
  margin: 0 20px;
  width: 200px;
  height: 22px;
`;

export const ArticleSectionHeaderPlaceholder: React.FunctionComponent = () => <Skeleton />;
