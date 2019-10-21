import * as React from 'react';

import { Article } from '@ridi/ridi-prosemirror-editor';
import { ArticleCannelInfoHeader } from 'app/components/ArticleChannels/ArticleCannelInfoHedaer';
import { testMockJson } from 'app/utils/mock';
import { refineArticleJSON } from 'app/utils/utils';

export  const ArticleContent: React.FunctionComponent = () => {
  const articleContent = refineArticleJSON(testMockJson);

  return (
    <main className="SceneWrapper PageArticleContent">
      {articleContent.title ? (
        <h1 className="ArticleContent_Title">{articleContent.title}</h1>
      ) : null}
      <ArticleCannelInfoHeader />
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
