import { HelmetWithTitle } from 'app/components';
import { ArticleChannelList } from 'app/components/article/ArticleChannels/ArticleChannelList';
import { PageTitleText } from 'app/constants';
import * as classNames from 'classnames';
import * as React from 'react';

export const ArticleChannels: React.FunctionComponent = () => {
  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_CHANNEL} />
      <div className="a11y"><h1>리디셀렉트 아티클 전체 채널</h1></div>
      <ArticleChannelList />
    </main>
  );
};
