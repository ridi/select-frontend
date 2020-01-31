import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { resetButton, resetLayout } from 'app/styles/customProperties';

export const modalContainer = css`
  position: fixed;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
`;

export const modalContainerDimmedBG = css`
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  content: '';
  background: rgba(0, 0, 0, .5);
`;

export const modalComponent = css`
  position: relative;
  display: block;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 3px;
  z-index: 20;
`;

export const modalHeader = css`
  display: block;
  position: relative;
  padding: 20px 54px 20px 20px;
  box-sizing: border-box;
`;

export const modalTitle = css`
  ${resetLayout}
  font-weight: 700;
  font-size: 17px;
  line-height: 24px;
  color: #000;
  text-align: left;
`;

export const modalCloseButton = css`
  ${resetButton}
  position: absolute;
  right: 0;
  top: 0;
  width: 54px;
  height: 64px;
`;

export const modalContent = css`
  display: block;
  padding: 0 20px 20px;
  box-sizing: border-box;
`;

export const closeButtonIcon = css`
  width: 24px;
  height: 24px;
  fill: ${Colors.slategray_50};
`;
