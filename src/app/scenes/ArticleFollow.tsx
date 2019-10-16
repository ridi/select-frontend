import { HelmetWithTitle } from 'app/components';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { FollowingChannels } from 'app/components/ArticleFollowing/FollowingChannels';
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
      <ArticleEmpty
        iconName="account_1"
        iconClassName="ArticleEmpty_CircleIcon"
        description="팔로잉 중인 채널이 없습니다."
        renderButton={() => (
          <button className="ArticleEmpty_Button">
            전체 채널 보기
          </button>
        )}
      />
      <FollowingChannels />
      {/* ArticleList 영역 */}
    </main>

  );
};
