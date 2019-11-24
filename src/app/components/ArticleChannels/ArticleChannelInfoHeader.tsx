import { Method } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button, Icon } from '@ridi/rsg';

import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import { articleChannelToPath } from 'app/utils/toPath';
import * as classNames from 'classnames';
import { ArticleChannelFollowButton } from './ArticleChannelFollowButton';

export const ArticleChannelInfoHeader: React.FunctionComponent<{ channelId: number, channelName: string, contentKey: string }> = (props) => {
  const { channelState, articleState, authorName, isChannelFollowing } = useSelector((state: RidiSelectState) => {
    const articleById = state.articlesById[props.contentKey];
    const channelById = state.articleChannelById[props.channelName];
    return {
      articleState: articleById,
      channelState: channelById,
      authorName: articleById.article!.authors
        ? articleById.article!.authors!.map((author) => author.name).join(', ')
        : undefined,
      isChannelFollowing:
        channelById &&
        channelById.isMetaFetched &&
        typeof channelById.channelMeta!.isFollowing === 'boolean'
          ? channelById.channelMeta!.isFollowing
          : undefined,
    };
  });

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (typeof isChannelFollowing === 'boolean') {
      return;
    }
    dispatch(Actions.loadArticleChannelDetailRequest({ channelName: props.channelName }));
  }, []);

  return channelState && channelState.channelMeta ? (
    <div className="ChannelInfoHeader_Wrapper">
      <Link
        className="ChannelInfoHeader_ChannelLink"
        to={articleChannelToPath({channelName: channelState.channelMeta.name})}
      >
        <div className="ChannelInfoHeader_Thumbnail">
          <img src={channelState.channelMeta.thumbnailUrl} className="ChannelInfoHeader_ThumbnailImage" />
        </div>
      </Link>
      <div className="ChannelInfoHeader_Meta">
        <Link
          className="ChannelInfoHeader_ChannelLink"
          to={articleChannelToPath({channelName: channelState.channelMeta.name})}
        >
          <span className="ChannelInfoHeader_Title">{channelState.channelMeta.displayName}</span>
        </Link>
        <span className="ChannelInfoHeader_Desc">
          {authorName ? `${authorName} | ` : ''}
          {buildOnlyDateFormat(articleState.article!.regDate)}
        </span>
      </div>
      <ArticleChannelFollowButton
        channelId={props.channelId}
        channelName={props.channelName}
      />
    </div>
  ) : null;
};
