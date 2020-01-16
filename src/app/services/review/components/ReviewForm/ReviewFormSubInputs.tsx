import * as classNames from 'classnames';
import * as React from 'react';

import { Button, CheckBox, Icon } from '@ridi/rsg';

interface ToggleNoticeButtonProps {
  isPressed: boolean;
  onClick: () => void;
}

export const ToggleNoticeButton: React.SFC<ToggleNoticeButtonProps> = (props) => {
  const { isPressed, onClick } = props;

  return (
    <Button
      className={classNames(
        'ReviewForm_ToggleNoticeButton',
        { pressed: isPressed },
      )}
      outline={true}
      onClick={onClick}
    >
      <Icon name="exclamation_2" className="ReviewForm_ToggleNoticeButton_Icon" />
      리뷰 작성 유의사항
    </Button>
  );
};

interface SpoilerCheckboxProps {
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const SpoilerCheckbox: React.SFC<SpoilerCheckboxProps> = (props) => {
  const { isChecked, onChange } = props;

  return (
    <div className="ReviewForm_SpoilerCheckbox">
      <CheckBox
        className="ReviewForm_SpoilerCheckbox_Component"
        checked={isChecked}
        onChange={onChange}
      >
        스포일러가 있습니다.
      </CheckBox>
    </div>
  );
};

interface SubmitButtonProps {
  isDisabled: boolean;
  isFetching: boolean;
  isFullButton?: boolean;
  onClick: () => void;
}

export const SubmitButton: React.SFC<SubmitButtonProps> = (props) => {
  const { isDisabled, isFetching, onClick, isFullButton = false } = props;

  return (
    <Button
      className={classNames(
        'ReviewForm_SubmitReviewButton',
        { disabled: isDisabled || isFetching },
        { spinner: isFetching },
        { full: isFullButton },
      )}
      color="blue"
      spinner={isFetching}
      size={isFullButton ? 'large' : 'medium'}
      disabled={isDisabled}
      onClick={onClick}
    >
      {props.children}
    </Button>
  );
};

interface CancelButtonProps {
  isFullButton?: boolean;
  onClick: () => void;
}

export const CancelButton: React.SFC<CancelButtonProps> = (props) => {
  const { onClick, isFullButton = false } = props;

  return (
    <Button
      className={classNames(
        'ReviewForm_CancelReviewButton',
        { full: isFullButton },
      )}
      size={isFullButton ? 'large' : 'medium'}
      onClick={onClick}
    >
      취소
    </Button>
  );
};
