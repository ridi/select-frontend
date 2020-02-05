import React from 'react';

import { TextWithLF } from 'app/types';

interface NewlineToBrProps {
  text: TextWithLF;
}

export const NewlineToBr: React.SFC<NewlineToBrProps> = props => (
  <>
    {props.text.split('\n').map((line, i, arr) => (
      <p key={i}>{line}</p>
    ))}
  </>
);
