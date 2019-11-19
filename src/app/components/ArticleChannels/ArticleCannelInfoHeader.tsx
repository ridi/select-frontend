import * as React from 'react';
import { useSelector } from 'react-redux';

import { Icon } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';

export const ArticleCannelInfoHeader: React.FunctionComponent<{ channelId: number, contentKey: string }> = (props) => {
  const { channelState, articleState } = useSelector((state: RidiSelectState) => ({
    channelState: state.articleChannelById[props.channelId],
    articleState: state.articlesById[props.contentKey],
  }));
  const authorName = articleState.article!.authors
      ? articleState.article!.authors.map((author) => author.name).join(', ')
      : undefined;

  return channelState.channelMeta ? (
    <div className="ChannelInfoHeader_Wrapper">
      <div className="ChannelInfoHeader_Thumbnail">
        <img src={channelState.channelMeta.thumbnailUrl} className="ChannelInfoHeader_ThumbnailImage" />
      </div>
      <div className="ChannelInfoHeader_Meta">
        <span className="ChannelInfoHeader_Title">{channelState.channelMeta.displayName}</span>
        <span className="ChannelInfoHeader_Desc">
          {authorName ? `${authorName} | ` : ''}
          {buildOnlyDateFormat(articleState.article!.regDate)}
        </span>
      </div>
      <button className="ChannelInfoHeader_Follow">
        <Icon name="plus_1" className="ChannelInfoHeader_FollowIcon" />
        팔로우
      </button>
    </div>
  ) : null;
};
