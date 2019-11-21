import { Icon } from '@ridi/rsg';
import { Actions } from 'app/services/articleChannel';
import { Method } from 'axios';
import * as React from 'react';
import { useDispatch } from 'react-redux';

interface ArticleChannelMetaProps {
  id: number;
  displayName: string;
  thumbnailUrl?: string;
  description?: string;
  subDescription?: string | null;
  followersCount?: number;
  isFollowing?: boolean;
}

export const ArticleChannelMeta: React.FunctionComponent<ArticleChannelMetaProps> = (props) => {
  const { id, displayName, thumbnailUrl, description, subDescription, followersCount = 0, isFollowing } = props;
  const [followCount, setFollowCount] = React.useState(followersCount);

  const dispatch = useDispatch();

  const handleButtonClick = (method: Method) => {
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId: id, method }));
    if (method === 'POST') {
      setFollowCount(followCount + 1);
    } else {
      setFollowCount(followCount - 1);
    }
  };

  return (
    <section>
      <div className="ArticleChannelMeta_Wrap">
        <div className="ArticleChannel_Thumbnail">
          <img src={thumbnailUrl} className={'ArticleChannel_Image'} />
        </div>
        <div className="ArticleChannel_Meta">
          <h2 className="ArticleChannel_Meta_Title">{displayName}</h2>
          <p className="ArticleChannel_Meta_Desc">{description}</p>
          <span className="ArticleChannel_Meta_Serial">{subDescription}</span>
          <span className="ArticleChannel_Meta_Following">팔로잉 <strong className="ArticleChannel_Meta_FollowingNumber">{followCount}</strong></span>
          {isFollowing ? (
              <button type="button" className="ArticleChannel_Following_Button" onClick={() => handleButtonClick('DELETE')}>팔로잉</button>
          ) : (
              <button type="button" className="ArticleChannel_Following_Button ArticleChannel_Following_Button-active" onClick={() => handleButtonClick('POST')}>
                <Icon name="plus_1" className="ArticleChannel_Following_Icon" />
                팔로우
              </button>
          )}
        </div>
      </div>
    </section>
  );
};
