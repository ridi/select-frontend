import * as React from 'react';

export const ArticleChannelMeta: React.FunctionComponent = () => {
  return (
    <section>
      <div className="ArticleChannelMeta_Wrap">
        <div className="ArticleChannel_Thumbnail">
          <img src={''} className={'ArticleChannel_Image'} />
        </div>
        <div className="ArticleChannel_Meta">
          <h2 className="Channel_Title">비즈니스 인사이더</h2>
          <p className="Channel_Desc">밀레니얼 비즈니스 리더를 위한 해외 뉴스</p>
          <span className="Channel_Serial">주 2회 연재</span>
          <span className="Channel_Fallowing">팔로잉 <strong>1,392</strong></span>
          <button className="Fallowing_Button">팔로잉</button>
        </div>
      </div>
    </section>
  );
};
