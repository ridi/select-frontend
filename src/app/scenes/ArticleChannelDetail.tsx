import * as classNames from 'classnames';
import * as React from 'react';

import { HelmetWithTitle } from 'app/components';
import { ArticleChannelMeta } from 'app/components/ArticleChannelDetail/ArticleChannelMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { ArticleListMockUp } from 'app/utils/mock';

export const ArticleChannelDetail: React.FunctionComponent = () => {
  const title = '아티클 채널';
  return (
    <main
      className={classNames(
        'SceneWrapper',
      )}
    >
      <HelmetWithTitle titleName={title} />
      <div className="a11y"><h1>리디셀렉트 아티클 채널</h1></div>
      <ArticleChannelMeta />
      <div className="Channel_ArticleList">
        <GridArticleList
          pageTitleForTracking="article-channel-detail"
          uiPartTitleForTracking="article-channel-detail-articles"
          renderAuthor={false}
          articles={ArticleListMockUp}
        />
      </div>
    </main>
  );
};
