import React from 'react';

import * as styles from 'app/components/Forms/radioStyle';

export interface RadioProps {
  inputName: string;
  id: string;
  value: any;
  displayName: string;
  isChecked: boolean;
  isDisabled?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const Radio: React.SFC<RadioProps> = (props) => {
  const { id, inputName, value, displayName, isChecked, isDisabled, onChange } = props;

  return (
    <label
      htmlFor={id}
      css={styles.radioWrapper}
    >
      <input
        id={id}
        type="radio"
        css={styles.radioInput}
        name={inputName}
        value={value}
        checked={isChecked}
        onChange={onChange}
        disabled={isDisabled}
      />
      <span
        css={isDisabled ?
          styles.radioDisabledLabel :
          isChecked ?
            styles.radioCheckedLabel :
            styles.radioLabel
        }
      >
        <span
          css={isDisabled ?
            styles.radioDisabledIcon :
            isChecked ?
              styles.radioCheckedIcon :
              styles.radioIcon
          }
        />
        {displayName}
      </span>
    </label>
  );
};
