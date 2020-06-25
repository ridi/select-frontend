import styled from '@emotion/styled';
import { css } from '@emotion/core';
import React from 'react';

import {
  ChartBookListSkeleton,
  InlineHorizontalBookListSkeleton,
  SpotlightBookListSkeleton,
} from 'app/placeholder/BookListPlaceholder';
import { CollectionType } from 'app/services/collection';
import Media from 'app/styles/mediaQuery';
import { skeleton } from 'app/styles/skeleton';
import {
  SC as SpotlightSC,
  Media as SpotlightMedia,
} from 'app/components/Home/HomeSpotlightSection';
import Colors from 'app/styles/colors';

interface HomeSectionPlaceholderProps {
  type?: CollectionType;
}

const commonWrapperStyles = css`
  box-sizing: border-box;
  width: 100%;
  height: 298px;
  overflow: hidden;
  padding: 30px 20px 20px;
  background: white;

  @media ${Media.PC} {
    width: 800px;
    height: 318px;
    margin: 0 auto;
    padding: 60px 0 0;
  }
`;

const Skeletons = {
  SectionWrapper: styled.div`
    ${commonWrapperStyles}
  `,
  ChartWrapper: styled.div`
    ${commonWrapperStyles}
    height: 440px;
    @media ${Media.PC} {
      height: 479px;
    }
  `,
  Header: styled.div`
    ${skeleton}
    display: block;
    width: 200px;
    height: 20px;
  `,
  Spotlight: styled(SpotlightSC.Spotlight)`
    position: relative;
    z-index: 200;
  `,
  SpotlightContent: styled.div`
    width: 850px;
    padding: 45px 0 0 25px;
    margin: 0 auto;
    overflow: hidden;

    @media ${SpotlightMedia.INLINE} {
      width: 100%;
      padding-top: 30px;
      overflow: hidden;
    }
    @media ${SpotlightMedia.SLIDER} {
      text-align: center;
    }
  `,
  SpotlightTitle: styled.div`
    ${skeleton}
    width: 200px;
    height: 34px;
    margin: 0 0 20px;
    background-color: ${Colors.slategray_10};

    @media ${SpotlightMedia.INLINE} {
      height: 24px;
      margin: 0 0 12px;
    }
  `,
};

export const HomeSectionPlaceholder: React.FunctionComponent<HomeSectionPlaceholderProps> = props => {
  if (props.type && props.type === CollectionType.CHART) {
    return (
      <Skeletons.ChartWrapper>
        <Skeletons.Header />
        <ChartBookListSkeleton />
      </Skeletons.ChartWrapper>
    );
  }
  if (props.type && props.type === CollectionType.SPOTLIGHT) {
    return (
      <Skeletons.Spotlight>
        <Skeletons.SpotlightContent>
          <Skeletons.SpotlightTitle />
          <SpotlightBookListSkeleton
            css={css`
              width: 825px;
            `}
          />
        </Skeletons.SpotlightContent>
      </Skeletons.Spotlight>
    );
  }
  return (
    <Skeletons.SectionWrapper>
      <Skeletons.Header />
      <InlineHorizontalBookListSkeleton />
    </Skeletons.SectionWrapper>
  );
};
