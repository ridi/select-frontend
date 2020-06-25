import styled from '@emotion/styled';
import React from 'react';
import { Method } from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import toast from 'app/utils/toast';
import SlideArrow from 'app/components/SlideArrow';
import { articleChannelToPath } from 'app/utils/toPath';
import { Actions } from 'app/services/articleFollowing';
import { useScrollSlider } from 'app/hooks/useScrollSlider';
import { ArticleChannel } from 'app/services/articleChannel';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { ArticleChannelThumbnail } from 'app/components/ArticleChannels/ArticleChannelThumbnail';
import DisabledIcon from 'svgs/Disabled.svg';
import Media from 'app/styles/mediaQuery';
import { PHABLET_MIN_WIDTH } from 'app/constants';
import Colors from 'app/styles/colors';
import { hideScrollBar } from 'app/styles/customProperties';

interface SlideChannelListProps {
  channels: ArticleChannel[];
}

const ListMaxWidth = 800;
export const ChannelList = {
  Wrapper: styled.section`
    position: relative;
    max-width: ${ListMaxWidth}px;
    margin: 0 auto;
  `,
  List: styled.ul`
    display: block;
    white-space: nowrap;
    padding: 30px 0px 10px;
    margin: 0;
    overflow: auto;
    ${hideScrollBar}

    @media (min-width: ${PHABLET_MIN_WIDTH}px) and (max-width: ${ListMaxWidth - 1}px) {
      padding-left: 20px;
    }
    @media ${Media.PHONE} {
      padding: 15px 10px;
    }
  `,
  ListItem: styled.li`
    display: inline-block;
    vertical-align: top;
    &:last-of-type {
      margin-right: 0;
    }
  `,
  ItemContentsWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 62px;
    height: 62px;

    & .ArticleChannelThumbnail_Wrapper {
      margin-right: 0;
    }
  `,
  Link: styled(Link)`
    text-decoration: none;
    width: 62px;
    padding-top: 5px;
    font-size: 11px;
    color: ${Colors.slategray_60};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  `,
};

const DisabledChannel = {
  Button: styled.button`
    width: 40px;
    height: 40px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 999px;
    overflow: hidden;
    background-color: ${Colors.gray_30};
    cursor: pointer;
    position: relative;
  `,
  Icon: styled(DisabledIcon)`
    fill: ${Colors.gray_10};
    width: 24px;
    height: 24px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  `,
  Title: styled.div`
    text-decoration: none;
    width: 62px;
    padding-top: 5px;
    font-size: 11px;
    color: ${Colors.slategray_60};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  `,
};

export const SlideChannelList: React.FunctionComponent<SlideChannelListProps> = props => {
  const ref = React.useRef<HTMLUListElement>(null);
  const [moveLeft, moveRight, isOnTheLeft, isOnTheRight] = useScrollSlider(ref, true);

  const { channels } = props;
  const dispatch = useDispatch();
  const section = getSectionStringForTracking('select-article', 'following', 'channel-list');
  const handleBlockChannelClick = (channelId: number, channelName: string) => {
    const method: Method = 'DELETE';
    const toastButton = {
      callback: () => {
        dispatch(Actions.loadUnFollowChannelRequest({ channelId, channelName, method }));
      },
      label: '팔로잉 취소',
    };
    toast.failureMessage('이용할 수 없는 채널입니다. 팔로잉을 취소하시겠습니까?', {
      button: {
        showArrowIcon: true,
        ...toastButton,
      },
    });
  };

  const trackingClick = (index: number, id: string) => {
    if (!section) {
      return;
    }

    const trackingParams: DefaultTrackingParams = {
      section,
      index,
      id,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  return (
    <ChannelList.Wrapper>
      <ChannelList.List ref={ref}>
        {channels.map((channel, idx) => (
          <ChannelList.ListItem key={idx}>
            <ConnectedTrackImpression section={section} index={idx} id={`ch:${channel.id}`}>
              <ChannelList.ItemContentsWrapper>
                {channel.isEnabled ? (
                  <>
                    <ArticleChannelThumbnail
                      imageUrl={channel.thumbnailUrl}
                      channelName={channel.displayName}
                      linkUrl={articleChannelToPath({ channelName: channel.name })}
                      onLinkClick={() => trackingClick(idx, `ch:${channel.id}`)}
                    />
                    <ChannelList.Link
                      to={articleChannelToPath({ channelName: channel.name })}
                      onClick={() => trackingClick(idx, `ch:${channel.id}`)}
                    >
                      {channel.displayName}
                    </ChannelList.Link>
                  </>
                ) : (
                  <>
                    <DisabledChannel.Button
                      type="button"
                      onClick={() => handleBlockChannelClick(channel.id, channel.name)}
                    >
                      <DisabledChannel.Icon />
                    </DisabledChannel.Button>
                    <DisabledChannel.Title>{channel.displayName}</DisabledChannel.Title>
                  </>
                )}
              </ChannelList.ItemContentsWrapper>
            </ConnectedTrackImpression>
          </ChannelList.ListItem>
        ))}
      </ChannelList.List>
      <SlideArrow
        label="이전"
        side="left"
        renderGradient
        onClickHandler={moveLeft}
        isHidden={!isOnTheLeft}
      />
      <SlideArrow
        label="다음"
        side="right"
        renderGradient
        onClickHandler={moveRight}
        isHidden={!isOnTheRight}
      />
    </ChannelList.Wrapper>
  );
};
