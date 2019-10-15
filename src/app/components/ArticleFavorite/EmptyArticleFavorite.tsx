import { Icon } from '@ridi/rsg';
import * as React from 'react';

export const EmptyArticleFavorite: React.FunctionComponent = () => {
  return (
    <div className="Empty_Wrapper">
      <Icon name={'list_1'} className="Empty_ArticleIcon" />
      <p className="Empty_Description">좋아한 아티클이 없습니다.</p>
    </div>
  );
};
