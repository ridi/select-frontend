import { Icon } from '@ridi/rsg';
import * as React from 'react';

export const ArticleCannelInfoHeader: React.FunctionComponent = () => {
  return (
    <div className="Channel_Info">
      <div className="Channel_Thumbnail">
        <img src={''} className="Channel_Image" />
      </div>
      <div className="Channel_Meta">
        <span className="Channel_Title">이코노미스트</span>
        <span className="Channel_Desc">다양하고 유익한 경제정보</span>
      </div>
      <button className="Channel_Follow">
        <Icon name="plus_1" className="Follow_Icon" />
        팔로우
      </button>
    </div>
  );
};
