import { css } from '@emotion/core';

import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';
import { resetLayout, resetFontUnlimited } from 'app/styles/customProperties';

export const popularArticleList = css`
  ${resetLayout}

  list-style: none;
  position: relative;
  max-width: 800px;
  margin: 0 auto;

  @media ${Media.PC} {
    padding-bottom: 60px;
  }
`;

export const popularArticleElement = css`
  ${resetLayout}

  width: 100%;
  padding: 15px 15px 15px 0;
  list-style: none;
  border-top: 1px solid ${Colors.slategray_10};
  box-sizing: border-box;

  & .ArticleList_Thumbnail {
    width: 100px;
    align-items: center;
    overflow: hidden;
    flex: none;

    &.Skeleton {
      height: 100px;
    }
  }

  &:first-of-type {
    border-top: 0;
  }
`;

export const popularArticleElementLink = css`
  ${resetFontUnlimited}

  width: 100%;
  flex-direction: row;
  display: flex;
  color: inherit;
  text-decoration: none;
  font-size: 13px;
`;

export const popularArticleElementRank = css`
  min-width: 27px;
  margin-right: 15px;
  text-align: center;
  align-self: center;
  font-family: Roboto, Sans-serif;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.64px;
  color: ${Colors.slategray_90};
  flex: none;

  &.Skeleton {
    height: 16px;
    width: 16px;
    margin: 0 17px;
  }

  @media ${Media.MOBILE} {
    margin: 0 15px;
  }
`;

export const popularArticleElementMeta = css`
  padding-left: 15px;
  font-size: 13px;
  text-decoration: none;
  align-self: center;
  box-sizing: border-box;
`;

export const popularArticleElementTitle = css`
  ${resetLayout}

  display: block;
  margin: 0;
  color: black;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  word-wrap: break-word;
  text-decoration: none;

  &.Skeleton {
    max-width: 500px;
    min-width: 150px;
    width: 100%;
    height: 20px;
  }
`;

export const popularArticleElementChannel = css`
  display: block;
  margin-top: 7px;
  color: ${Colors.slategray_60};
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  word-wrap: break-word;
  text-decoration: none;

  &.Skeleton {
    width: 120px;
    height: 18px;
    margin-top: 7px;
  }
`;
