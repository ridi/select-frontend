import { Icon } from '@ridi/rsg';
import React from 'react';

export interface ReviewSpoilerAlertProps {
  onButtonClick: () => void;
}

export const ReviewSpoilerAlert: React.SFC<ReviewSpoilerAlertProps> = props => {
  const { onButtonClick } = props;

  return (
    <div className="Review_Alert">
      <article className="Review_Alert_Article">
        <p className="Review_Alert_Description">
          <Icon className="Review_Alert_Icon" name="exclamation_2" />
          스포일러가 있는 리뷰입니다.
          <br />
          <button className="Review_Alert_Button" type="button" onClick={onButtonClick}>
            리뷰 보기
            <Icon className="Review_Alert_Button_Icon" name="arrow_9_right" />
          </button>
        </p>
      </article>
    </div>
  );
};
