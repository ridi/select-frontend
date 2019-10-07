import { HelmetWithTitle } from 'app/components';
import { EmptyArticleFollowing } from 'app/components/article/ArticleFollowing/EmptyArticleFollowing';
import { FollowingChannels } from 'app/components/article/ArticleFollowing/FollowingChannels';
import { PageTitleText } from 'app/constants';
import * as classNames from 'classnames';
import * as React from 'react';

export const ArticleFollow: React.FunctionComponent = () => {
  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_FOLLOWING} />
      <div className="a11y"><h1>리디셀렉트 아티클 팔로잉</h1></div>
      <EmptyArticleFollowing />
      <FollowingChannels />
      {/* ArticleList 영역 */}
    </main>

  );
};
