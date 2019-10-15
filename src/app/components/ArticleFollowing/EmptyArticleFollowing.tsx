import { Icon } from '@ridi/rsg';
import * as React from 'react';

export const EmptyArticleFollowing: React.FunctionComponent = () => {
  return (
    <div className="Empty_Wrapper">
      <Icon name={'account_1'} className="Empty_Icon" />
      <p className="Empty_Description">팔로잉 중인 채널이 없습니다.</p>
      <button className="Empty_View_Channels">
        전체 채널 보기
      </button>
    </div>
  );
};
