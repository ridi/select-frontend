import styled from '@emotion/styled';
import React from 'react';

import { Scene } from 'app/styles/globals';
import { skeletonWrapper } from 'app/styles/skeleton';

import { ArticleChannelMetaPlaceholder } from './ArticleChannelMetaPlaceholder';

const ArticleChannelList = {
  Wrapper: styled.main`
    ${Scene.Wrapper}
    ${skeletonWrapper}
    padding: 0 20px;
    background: white;
  `,
  PlaceholderWrapper: styled.div`
    max-width: 800px;
    margin: 0 auto;
  `,
  PlaceholderList: styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
};

export const ArticleChannelListPlaceholder: React.FunctionComponent = () => (
  <ArticleChannelList.Wrapper>
    <ArticleChannelList.PlaceholderWrapper>
      <ArticleChannelList.PlaceholderList>
        <ArticleChannelMetaPlaceholder />
        <ArticleChannelMetaPlaceholder />
        <ArticleChannelMetaPlaceholder />
        <ArticleChannelMetaPlaceholder />
      </ArticleChannelList.PlaceholderList>
    </ArticleChannelList.PlaceholderWrapper>
  </ArticleChannelList.Wrapper>
);
