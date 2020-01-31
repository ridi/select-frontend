import React from 'react';

import { Icon } from '@ridi/rsg';

interface Props {
  isExpanded: boolean;
  text: string;
  onClick: (e: React.SyntheticEvent<any>) => void;
}

export const Expander: React.SFC<Props> = (props) => {
  const { isExpanded, text, onClick } = props;
  return (
    <button onClick={onClick} className="BookDetail_ContentTruncButton">
      {text}
      <Icon name={isExpanded ? 'arrow_5_up' : 'arrow_5_down'} />
    </button>
  );
};
