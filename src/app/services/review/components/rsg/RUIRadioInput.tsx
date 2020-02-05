import React from 'react';

export interface RUIRadioInputProps {
  inputName: string;
  id: string;
  value: any;
  displayName: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const RUIRadioInput: React.SFC<RUIRadioInputProps> = props => {
  const { id, inputName, value, displayName, isChecked, onChange } = props;

  return (
    <label htmlFor={id} className="RUIRadio">
      <input
        id={id}
        type="radio"
        className="RUIRadio_Input"
        name={inputName}
        value={value}
        checked={isChecked}
        onChange={onChange}
      />
      <span className="RUIRadio_Label">
        <span className="RUIRadio_Icon" />
        {displayName}
      </span>
    </label>
  );
};
