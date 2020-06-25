import { SerializedStyles, css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';

import hoverStyles from 'app/styles/hover';
import PrevIcon from 'svgs/ArrowNoneDashLeft.svg';
import NextIcon from 'svgs/ArrowNoneDashRight.svg';

export interface SliderControlStyles {
  slider?: SerializedStyles;
  prevButton?: SerializedStyles;
  nextButton?: SerializedStyles;
  prevIcon?: SerializedStyles;
  nextIcon?: SerializedStyles;
}

interface SliderControlsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  styles?: SliderControlStyles;
}

interface AdditionalStyles {
  styles?: SerializedStyles;
}

const commonStyles = {
  button: css`
    box-sizing: border-box;
    position: absolute;
    top: 0;
    width: 40px;
    height: 40px;
    transform: translate3d(0, -50%, 0);
    border: 0;
    line-height: 40px;
    border-radius: 20px;
    border: solid 1px rgba(0, 0, 0, 0.07);
    background-color: rgba(255, 255, 255, 0.15);
    text-align: center;
    cursor: pointer;
    pointer-events: all;
    transition: background-color 0.2s;
    ${hoverStyles(css`
      background-color: rgba(209, 213, 217, 0.25);
    `)}
  `,
  icon: css`
    width: 8px;
    height: 13px;
    vertical-align: top;
    margin-top: 12px;
    fill: white;
  `,
};

const SC = {
  Slider: styled.div`
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 544px;
    transform: translate3d(-50%, -50%, 0);
    white-space: nowrap;
    pointer-events: none;
  `,
  PrevButton: styled.button`
    ${commonStyles.button}
    left: 3px;
  `,
  NextButton: styled.button`
    ${commonStyles.button}
    right: 3px;
  `,
  PrevIcon: styled(PrevIcon)`
    ${commonStyles.icon}
    margin-right: 1px;
  `,
  NextIcon: styled(NextIcon)`
    ${commonStyles.icon}
    margin-left: 1px;
  `,
};

export const SliderControls: React.FunctionComponent<SliderControlsProps> = props => {
  const { onPrevClick, onNextClick } = props;
  return (
    <SC.Slider css={props.styles?.slider}>
      <SC.PrevButton onClick={onPrevClick} type="button" css={props.styles?.prevButton}>
        <SC.PrevIcon css={props.styles?.prevIcon} />
        <span className="a11y">이전 배너 보기</span>
      </SC.PrevButton>
      <SC.NextButton onClick={onNextClick} type="button" css={props.styles?.nextButton}>
        <SC.NextIcon css={props.styles?.nextIcon} />
        <span className="a11y">다음 배너 보기</span>
      </SC.NextButton>
    </SC.Slider>
  );
};
