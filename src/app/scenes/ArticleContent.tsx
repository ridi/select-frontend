import * as React from 'react';

import { Article } from '@ridi/ridi-prosemirror-editor';
import { testMockJson } from 'app/utils/mock';
import { refineArticleJSON } from 'app/utils/utils';

export  const ArticleContent: React.FunctionComponent = () => {
  const articleContent = refineArticleJSON(testMockJson);

  return (
    <main className="SceneWrapper PageArticleContent">
      {articleContent.title ? (
        <h1 className="ArticleContent_Title">{articleContent.title}</h1>
      ) : null}
      <Article
        json={articleContent.content}
        classes={['RidiselectArticle']}
        style={{
          background: 'white',
        }}
      />
    </main>
  );
};
