import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { resetLayout, customMedia, resetList } from 'app/styles/customProperties';

export const PageArticleContent = css`
  display: block;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;

  & .ChannelInfoHeader_Wrapper {
    padding: 10px 0 30px;
  }

  @media (max-width: 700px) {
    & .ChannelInfoHeader_Wrapper {
      padding: 10px 20px 30px;
    }
  }
`;

export const ArticleContent_Title = css`
  ${resetLayout}

  padding-top: 60px;
  font-family: 'Noto Sans KR', NotoSansKR, sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.33em;
  letter-spacing: -0.68px;
  color: ${Colors.gray_100};

  @media (max-width: 700px) {
    padding: 30px 20px 0;
  }
`;

export const ArticleContent_ContentWrapper = css`
  position: relative;

  & .RidiselectArticle {
    position: relative;
    padding-bottom: 60px;
    z-index: 10;

    @media (${customMedia.pcLayout}) {
      min-height: 660px;
    }
  }
`;

export const ArticleContent_ButtonsWrapper = css`
  ${resetList}

  padding: 0 0 60px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  @media (max-width: 700px) {
    padding: 0 12px 60px;
  }

  @media ${customMedia.mobileLayout} {
    padding: 0 12px 30px;
  }
`;

export const ArticleContent_ButtonElement = css`
  width: 50%;
  padding: 0 4px;
  box-sizing: border-box;
`;

export const ArticleContent_Button = css`
  &,
  &.RUIButton {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 38px;
    vertical-align: top;
  }
`;

export const ArticleContent_LikeButton_Icon = css`
  width: 12px;
  height: 10px;
  margin-right: 4px;
  fill: ${Colors.slategray_30};
  vertical-align: top;
  margin-top: 14px;

  &.active {
    fill: ${Colors.red_40};
  }
`;

export const ArticleContent_ShareButton_Icon = css`
  width: 14px;
  height: 14px;
  margin-right: 3px;
  fill: ${Colors.slategray_60};
  vertical-align: top;
  margin-top: 13px;
`;

export const ArticleContent_GetTicketToReadButtonWrapper = css`
  position: fixed;
  display: block;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  text-align: center;
  padding: 120px 0 0;
  box-sizing: border-box;
  z-index: 50;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 68%);

  &.sticky {
    position: absolute;
  }

  @media (max-width: 700px) {
    padding: 120px 20px 0;
  }
`;

export const ArticleContent_GetTicketToReadButton = css`
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 700px;
  font-size: 16px;
  height: 50px;
  line-height: 48px;
`;
