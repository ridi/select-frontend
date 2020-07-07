import { css } from '@emotion/core';

import hoverStyles from 'app/styles/hover';
import styled from 'app/styles/styled';
import { Theme } from 'app/styles/theme';
import Media from 'app/styles/mediaQuery';

export enum FooterListKey {
  TopLinks = 'TopLinks',
  SocialLinks = 'SocialLinks',
  BizInfo = 'BizInfo',
  BottomLinks = 'BottomLinks',
}

export const TopLinkDividerIndex = 3;

const listCommonStyles = css`
  min-width: 320px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const linkCommonHoverStyles = css`
  transition: opacity 0.2s;
  ${hoverStyles(css`
    opacity: 0.8;
  `)}
`;

export const SC = {
  Footer: styled.footer`
    padding: 22px 0 28px 0;
    text-align: center;
    background: ${props => props.theme.footer.color.footerBackground};
  `,
  [FooterListKey.TopLinks]: styled.ul`
    ${listCommonStyles}
  `,
  [`${FooterListKey.TopLinks}_Item`]: styled.li`
    display: inline-block;
    margin-top: 6px;
    padding-left: 6px;
    &::before {
      display: inline-block;
      width: 3px;
      height: 3px;
      margin: 8px 7px 0 0;
      border-radius: 3px;
      background: ${props => props.theme.footer.color.topLinkDivider};
      content: '';
      vertical-align: top;
    }
    &:first-of-type {
      padding: 0;
      &::before {
        display: none;
      }
    }
    @media ${Media.PHONE} {
      /**
       * 렌더링시 TopLinkDividerIndex 기준으로
       * divider 요소가 한개 추가되기 때문에 2를 더해줌
      */
      &:nth-child(${TopLinkDividerIndex + 2}) {
        padding: 0;
        &::before {
          display: none;
        }
      }
    }
  `,
  [`${FooterListKey.TopLinks}_Item_Divider`]: styled.div`
    display: none;
    @media ${Media.PHONE} {
      display: block;
      width: 100%;
      height: 0;
    }
  `,
  [FooterListKey.SocialLinks]: styled.ul`
    ${listCommonStyles}
    margin-top: 28px;
    text-align: center;
  `,
  [`${FooterListKey.SocialLinks}_Item`]: styled.li`
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: 20px;
    &:first-of-type {
      margin-left: 0;
    }
  `,
  [FooterListKey.BizInfo]: styled.ul`
    ${listCommonStyles}
    padding: 28px 0 0;
    width: 320px;
    margin: 0 auto;
  `,
  [`${FooterListKey.BizInfo}_Item`]: styled.li`
    display: inline-block;
    color: ${props => props.theme.footer.color.bizInfo};
    font-size: 11px;
    line-height: 17px;
    padding-left: 3px;
    &:first-of-type {
      padding: 0;
    }
  `,
  [FooterListKey.BottomLinks]: styled.ul`
    ${listCommonStyles}
    padding: 20px 0 0;
  `,
  [`${FooterListKey.BottomLinks}_Item`]: styled.li`
    display: inline-block;
    position: relative;
    padding: 0 5px 0 6px;
    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 1px;
      height: 10px;
      transform: translate3d(0, -50%, 0);
      background: ${props => props.theme.footer.color.bottomLinkDivider};
      content: '';
    }
    &:first-of-type::before {
      display: none;
    }
  `,
  Copyright: styled.p`
    min-width: 320px;
    margin: 20px 0 0 0;
    padding: 0;
    color: ${props => props.theme.footer.color.copyright};
    font-size: 14px;
    line-height: 20px;
  `,
};

export const styles = {
  [`${FooterListKey.TopLinks}_Item_Link`]: (theme: Theme) => css`
    display: inline-block;
    color: ${theme.footer.color.topLink};
    font-size: 15px;
    line-height: 22px;
    font-weight: 700;
    line-height: 19px;
    text-decoration: none;
    &,
    &:active,
    &:visited,
    &:focus {
      color: ${theme.footer.color.topLink};
    }
    ${linkCommonHoverStyles}
  `,
  [`${FooterListKey.SocialLinks}_Item_Link`]: (theme: Theme) => css`
    svg {
      width: 20px;
      height: 20px;
      fill: ${theme.footer.color.socialLink};
    }
    ${linkCommonHoverStyles}
  `,
  [`${FooterListKey.BottomLinks}_Item_Link`]: (theme: Theme) => css`
    display: block;
    color: ${theme.footer.color.bottomLink};
    font-size: 11px;
    line-height: 16px;
    text-decoration: none;
    ${linkCommonHoverStyles}
  `,
};
