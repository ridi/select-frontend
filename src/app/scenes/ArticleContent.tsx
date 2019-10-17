import * as React from 'react';

import { Article } from '@ridi/ridi-prosemirror-editor';
import { testMockJson } from 'app/utils/mock';
import { refineArticleJSON } from 'app/utils/utils';

export  const ArticleContent: React.FunctionComponent = () => {
  const articleContent = refineArticleJSON(testMockJson);

  return (
    <>
      {articleContent.title ? (
        <h1>{articleContent.title}</h1>
      ) : null}
      <Article
        json={articleContent.content}
        style={{
          background: 'white',
          padding: '16px',
        }}
      />
    </>
  );
};
