import { Method } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';

export const ArticleChannelFollowButton: React.FunctionComponent<{
  className?: string;
  channelId: number;
  channelName: string;
  afterAction?: (mothod: Method) => void;
}> = (props) => {
  const {
    isChannelFollowing,
    hasAvailableTicket,
    followFetchStatus,
  } = useSelector((state: RidiSelectState) => {
    const channelById = state.articleChannelById[props.channelName];
    return {
      hasAvailableTicket: state.user.hasAvailableTicket,
      isChannelFollowing:
        channelById && channelById.channelMeta && typeof channelById.channelMeta.isFollowing === 'boolean'
          ? channelById.channelMeta.isFollowing
          : undefined,
      followFetchStatus: channelById.followFetchStatus,
    };
  });

  const dispatch = useDispatch();
  const handleButtonClick = (method: Method) => {
    dispatch(Actions.articleChannelFollowingActionRequest({ channelId: props.channelId, channelName: props.channelName, method }));
    if (hasAvailableTicket && props.afterAction) {
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
      spinner={typeof isChannelFollowing !== 'boolean' || followFetchStatus === FetchStatusFlag.FETCHING}
    >
      {typeof isChannelFollowing === 'boolean' && followFetchStatus !== FetchStatusFlag.FETCHING
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
