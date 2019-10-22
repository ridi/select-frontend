import * as React from 'react';

interface ArticleChannelMetaProps {
  title: string;
  thumbUrl?: string;
  description?: string;
  subDescription?: string | null;
  followersCount?: number;
}

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannelMetaProps> = (props) => {
  const { title, thumbUrl, description, subDescription, followersCount} = props;

  return (
    <section>
      <div className="ArticleChannelMeta_Wrap">
        <div className="ArticleChannel_Thumbnail">
          <img src={thumbUrl} className={'ArticleChannel_Image'} />
        </div>
        <div className="ArticleChannel_Meta">
          <h2 className="Channel_Title">{title}</h2>
          <p className="Channel_Desc">{description}</p>
          <span className="Channel_Serial">{subDescription}</span>
          <span className="Channel_Fallowing">팔로잉 <strong>{followersCount}</strong></span>
          <button className="Fallowing_Button">팔로잉</button>
        </div>
      </div>
    </section>
  );
};
