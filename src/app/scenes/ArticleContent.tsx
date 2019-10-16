import * as React from 'react';

import { Article } from '@ridi/ridi-prosemirror-editor';

export const ArticleContent: React.FunctionComponent = () => {
  const testMockJson = JSON.parse(
    '{"type":"doc","content":[{"type":"title","content":[{"type":"text","text":"내용"}]},{"type":"paragraph","content":[{"type":"text","text":"내용"}]}]}',
  );

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
