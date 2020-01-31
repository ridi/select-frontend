import { Icon } from '@ridi/rsg';
import React from 'react';

interface SliderControlsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
}

export const SliderControls: React.SFC<SliderControlsProps> = (props) => (
  <div className="Slider_Controls">
    <button
      className="Slider_ControlButton Slider_ControlButton_Left"
      onClick={() => props.onPrevClick()}
      type="button"
    >
      <Icon name="arrow_5_left" className="Slider_ControlIcon" />
      <span className="a11y">이전 배너 보기</span>
    </button>
    <button
      className="Slider_ControlButton Slider_ControlButton_Right"
      onClick={() => props.onNextClick()}
      type="button"
    >
      <Icon name="arrow_5_right" className="Slider_ControlIcon" />
      <span className="a11y">다음 배너 보기</span>
    </button>
  </div>
);
