import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import { resetLayout, resetAppearance, resetFontUnlimited } from 'app/styles/customProperties';

export const radioWrapper = css`
  ${resetFontUnlimited}
  ${resetLayout}
  ${resetAppearance}
`;

export const radioInput = css`
  ${resetAppearance}
  display: inline-block;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  color: rgba(0, 0, 0, 0);
  font-size: 0;
  line-height: 0;
  opacity: 0;
  clip: rect(0, 0, 0, 0);
`;

export const radioLabel = css`
  ${resetAppearance}

  display: inline-block;
  position: relative;
  padding-left: 30px;
  color: ${Colors.slategray_60};
  font-size: 13px;
  font-weight: 400;
  height: 20px;
  line-height: 20px;
  vertical-align: top;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transition: color 0.2s;

  &:before {
    border-radius: 10px;
    box-sizing: border-box;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border: 1px solid ${Colors.slategray_20};
    background: white;
    content: '';
    transition: border-color 0.2s;
  }
`;

export const radioCheckedLabel = css`
  ${radioLabel}

  &:before {
    border-color: ${Colors.dodgerblue_40};
    background: ${Colors.dodgerblue_40};
  }
`;

export const radioDisabledLabel = css`
  color: ${Colors.slategray_20};
  cursor: default;

  &:before {
    border-color: ${Colors.slategray_20};
    background: ${Colors.slategray_5};
    color: ${Colors.slategray_20};
  }
`;

export const radioIcon = css`
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: white;
  display: block;
  position: absolute;
  top: 50%;
  left: 6px;
  margin-top: -4px;
  visibility: hidden;
`;

export const radioCheckedIcon = css`
  ${radioIcon}
  visibility: visible;
`;

export const radioDisabledIcon = css`
  background: ${Colors.slategray_20};
  visibility: visible;
`;
