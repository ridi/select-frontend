import { HelmetWithTitle } from 'app/components';
import { ArticleChannelMeta } from 'app/components/article/ArticleChannelDetail/ArticleChannelMeta';
import { ArticleSectionList } from 'app/components/article/ArticleSectionList';
import { ArticleChartsMockUp, ArticleListMockUp } from 'app/utils/mock';
import * as classNames from 'classnames';
import * as React from 'react';

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
        <ArticleSectionList articleList={ArticleListMockUp} />
      </div>
    </main>
  );
};
