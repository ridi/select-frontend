import { css } from '@emotion/core';

import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';
import { resetLayout, resetAppearance, resetInputFocus } from 'app/styles/customProperties';

export const cashReceiptIssueModalColumn = css`
  @media ${Media.PC} {
    display: table-cell;
    width: 0px;
    height: auto;
  }
`;

export const cashReceiptIssueModalWrapper = css`
  width: 280px;
  text-align: left;
`;

export const cashReceiptIssueModalSubTitle = css`
  ${resetLayout}
  color: ${Colors.slategray_70};
  font-size: 15px;
  line-height: 24px;
  font-weight: 700;
  text-align: left;
`;

export const cashReceiptIssueModalIssueTypeList = css`
  ${resetLayout}
  display: block;
  padding: 0 0 10px;
`;

export const cashReceiptIssueModalIssueTypeListItem = css`
  display: inline-block;
  padding: 12px 30px 12px 0;
`;

export const cashReceiptIssueModalNumberTypeListItem = css`
  ${resetLayout}
  padding-bottom: 4px;
  & li {
    display: block;
    padding: 12px 0 4px;
  }
`;

export const cashReceiptIssueModalIssueNumberInputWrapper = css`
  ${resetLayout}
  position: relative;
  display: block;
  width: 100%;
  height: 46px;
  padding: 0 40px 0 10px;
  margin-top: 12px;
  border-radius: 3px;
  border: solid 1px ${Colors.slategray_20};
  background-color: white;
  box-sizing: border-box;
`;

export const cashReceiptIssueModalIssueNumberInput = css`
  ${resetAppearance}
  ${resetInputFocus}
  width: 100%;
  height: 46px;
  line-height: 44px;
  box-sizing: border-box;
  background: transparent;
  font-size: 15px;

  &::placeholder {
    color: ${Colors.slategray_40};
  }
  &::-webkit-clear-button {
    display: none;
    width: 0;
    height: 0;
  }
  &::-ms-clear {
    display: none;
    width: 0;
    height: 0;
  }
  &::-ms-clear,
  &::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }
`;

export const cashReceiptIssueModalIssueButtonWrapper = css`
  text-align: right;
  padding-top: 20px;
`;

export const cashReceiptIssueModalIssueButton = css`
  width: 64px;
  font-size: 14px;
  box-shadow: none;
  border: none;
`;
