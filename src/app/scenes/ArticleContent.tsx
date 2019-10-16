import * as React from 'react';

import { Article } from '@ridi/ridi-prosemirror-editor';
import { testMockJson } from 'app/utils/mock';

export const ArticleContent: React.FunctionComponent = () => {
  return (
    <Article
      json={testMockJson}
      style={{
        background: 'white',
        padding: '16px',
      }}
    />
  );
};
