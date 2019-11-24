import { Method } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';

export const ArticleChannelFollowButton: React.FunctionComponent<{
  className?: string;
  channelId: number;
  channelName: string;
  afterAction?: (mothod: Method) => void;
}> = (props) => {
  const { isChannelFollowing } = useSelector((state: RidiSelectState) => {
    const channelById = state.articleChannelById[props.channelName];
    return {
      isChannelFollowing:
        channelById &&
        channelById.channelMeta &&
        typeof channelById.channelMeta.isFollowing === 'boolean'
          ? channelById.channelMeta.isFollowing
          : undefined,
    };
  });

  const dispatch = useDispatch();
  const handleButtonClick = (method: Method) => {
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId: props.channelId, channelName: props.channelName, method }));
    if (props.afterAction) {
      props.afterAction(method);
    }
  };

  return (
    <Button
      size="small"
      color="blue"
      outline={isChannelFollowing}
      className={classNames(
        'Channel_FollowButton',
        isChannelFollowing && 'Channel_FollowButton-active',
      )}
      onClick={() => handleButtonClick(isChannelFollowing ? 'DELETE' : 'POST')}
      spinner={typeof isChannelFollowing !== 'boolean'}
    >
      {typeof isChannelFollowing === 'boolean'
        ? isChannelFollowing
          ?  '팔로잉'
          : (
            <>
              <Icon name="plus_1" className="Channel_FollowButton_Icon" />
              팔로우
            </>
          )
        : null}
    </Button>
  );
};
