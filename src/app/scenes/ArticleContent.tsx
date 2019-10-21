import * as React from 'react';

import { Article } from '@ridi/ridi-prosemirror-editor';
import { Button, Icon } from '@ridi/rsg';
import { ArticleCannelInfoHeader } from 'app/components/ArticleChannels/ArticleCannelInfoHeader';
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
      <ul className="ArticleContent_ButtonsWrapper">
        <li className="ArticleContent_ButtonElement">
          <Button
            color="gray"
            size="medium"
            outline={true}
            className="ArticleContent_Button ArticleContent_LikeButton"
          >
            <Icon
              name="heart_1"
              className="ArticleContent_LikeButton_Icon"
            />
            1,020
          </Button>
        </li>
        <li className="ArticleContent_ButtonElement">
          <Button
            color="gray"
            size="medium"
            outline={true}
            className="ArticleContent_Button ArticleContent_ShareButton"
          >
            공유하기
          </Button>
        </li>
      </ul>
    </main>
  );
};
