import { Actions } from 'app/services/articleChannel';
import { Method } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ArticleChannelMetaProps {
  id: number;
  title: string;
  thumbUrl?: string;
  description?: string;
  subDescription?: string | null;
  followersCount?: number;
  isFollowing?: boolean;
}

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannelMetaProps> = (props) => {
  const { id, title, thumbUrl, description, subDescription, followersCount, isFollowing} = props;
  const dispatch = useDispatch();

  const handleButtonClick = (type: Method) => {
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId: id, type }));
  };

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
          {
            isFollowing ? (
              <button className="Fallowing_Button" onClick={() => handleButtonClick('DELETE')} >팔로잉</button>
            ) : (
              <button className="Fallowing_Button" onClick={() => handleButtonClick('POST')} >팔로우</button>
            )
          }
        </div>
      </div>
    </section>
  );
};
