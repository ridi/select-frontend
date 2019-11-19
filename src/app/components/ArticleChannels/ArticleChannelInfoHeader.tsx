import { Method } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';

export const ArticleChannelInfoHeader: React.FunctionComponent<{ channelId: number, contentKey: string }> = (props) => {
  const { channelState, articleState, authorName, isChannelFollowing } = useSelector((state: RidiSelectState) => {
    const articleById = state.articlesById[props.contentKey];
    const channelById = state.articleChannelById[props.channelId];
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
    dispatch(Actions.loadArticleChannelDetailRequest({ channelId: props.channelId }));
  }, []);

  const handleButtonClick = (type: Method) => {
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId: props.channelId, type }));
  };

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
      <Button
        size="small"
        color="blue"
        className="ChannelInfoHeader_Follow"
        onClick={() => handleButtonClick(isChannelFollowing ? 'DELETE' : 'POST')}
        spinner={typeof isChannelFollowing !== 'boolean'}
      >
        {typeof isChannelFollowing === 'boolean'
          ? isChannelFollowing
            ?  '팔로잉'
            : (
              <>
                <Icon name="plus_1" className="ChannelInfoHeader_FollowIcon" />
                팔로우
              </>
            )
          : null}
      </Button>
    </div>
  ) : null;
};
