import { Icon } from '@ridi/rsg';
import { ArticleChannel } from 'app/services/articleChannel';
import * as React from 'react';
import { Link } from 'react-router-dom';

export const ArticleChannelsMeta: React.FunctionComponent<ArticleChannel> = (props) => (
  <div className="Channel_Info">
    <Link className="Channel_Link" to={`/article/channel/${props.id}`}>
      <div className="Channel_Thumbnail">
        <img src={props.thumbnailUrl} className="Channel_Image" />
      </div>
    </Link>
    <div className="Channel_Meta">
      <Link className="Channel_Link" to={`/article/channel/${props.id}`}>
        <span className="Channel_Title">{props.name}</span>
      </Link>
      <span className="Channel_Desc">{props.description}</span>
    </div>
    <button className="Channel_Follow" onClick={() => alert('팔로우되었습니다.')}>
      <Icon name="plus_1" className="Follow_Icon" />
      팔로우
    </button>
  </div>
);
