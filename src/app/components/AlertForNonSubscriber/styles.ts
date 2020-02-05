import { css } from '@emotion/core';
import Colors from 'app/styles/colors';
import { resetButton } from 'app/styles/customProperties';

export const wrapper = css`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 10px calc(20px + constant(safe-area-inset-bottom)) 10px;
  padding: 0 10px calc(20px + env(safe-area-inset-bottom)) 10px;
  background: rgba(19, 32, 47, 0.9);
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 -10px 20px 0 rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

export const mainText = css`
  margin: 0;
  padding-top: 20px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4em;
  color: #fff;
`;

export const subText = css`
  margin: 0;
  padding-top: 10px;
  font-size: 13px;
  color: ${Colors.slategray_20};
`;

export const subscribeButton = css`
  margin-top: 20px;
  .GoToSubscribeButton {
    height: 40px;
    line-height: 38px;
  }
`;

export const closeButton = css`
  ${resetButton}
  position: absolute;
  width: 44px;
  height: 44px;
  top: 0;
  right: 0;
  padding: 10px;
`;

export const closeButtonIcon = css`
  width: 24px;
  height: 24px;
  fill: ${Colors.slategray_50};
`;
