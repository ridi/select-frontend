import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ArticleChannelMeta } from 'app/components/ArticleChannels/ArticleChannelMeta';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { ArticleChannelListPlaceholder } from 'app/placeholder/ArticleChannelListPlaceholder';
import { Actions } from 'app/services/articleChannel';
import { getChannelList } from 'app/services/articleChannel/selectors';
import { Actions as ArticleFollowingActions } from 'app/services/articleFollowing';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { Scene } from 'app/styles/globals';
import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';

const ChannelList = {
  SceneWrapper: styled.main`
    ${Scene.Wrapper}
    ${Scene.WithGNB}
    ${Scene.WithLNB}
    margin-bottom: 40px;
  `,
  Scene: styled.div`
    max-width: 840px;
    margin: 0 auto;
  `,
  List: styled.ul`
    list-style: none;
    margin: 0 20px;
    padding: 0;
  `,
  Item: styled.div`
    padding: 20px 0;
    border-bottom: 1px solid ${Colors.slategray_10};
    @media ${Media.PC} {
      padding: 30px 0;
    }
  `,
};

const ArticleChannelList: React.FunctionComponent = () => {
  const { channelList, hasAvailableTicket, unseenFeedsFetchStatus } = useSelector(
    (state: RidiSelectState) => ({
      channelList: getChannelList(state),
      hasAvailableTicket: state.user.hasAvailableTicket,
      unseenFeedsFetchStatus: state.articleFollowing.unseenFeedsFetchStatus,
    }),
  );
  const channelListFetchStatus = useSelector(
    (state: RidiSelectState) => state.articleChannels.fetchStatus,
  );
  const dispatch = useDispatch();
  const section = getSectionStringForTracking('select-article', 'all-channels', 'channel-list');

  React.useEffect(() => {
    if (channelListFetchStatus === FetchStatusFlag.IDLE && channelList.length === 0) {
      dispatch(Actions.loadArticleChannelListRequest());
    }
  }, []);

  React.useEffect(() => {
    if (hasAvailableTicket && unseenFeedsFetchStatus !== FetchStatusFlag.FETCHING) {
      dispatch(ArticleFollowingActions.loadUnseenFollowingFeedsRequest());
    }
  }, [hasAvailableTicket]);

  return (
    <ChannelList.SceneWrapper>
      <HelmetWithTitle titleName={PageTitleText.ARTICLE_CHANNEL} />
      <h1 className="a11y">리디셀렉트 아티클 전체 채널</h1>
      <section>
        {channelListFetchStatus === FetchStatusFlag.FETCHING ? (
          <ArticleChannelListPlaceholder />
        ) : (
          <ChannelList.Scene>
            <ChannelList.List>
              {channelList.map((channelMeta, idx) =>
                channelMeta ? (
                  <ChannelList.Item key={idx}>
                    <ConnectedTrackImpression
                      section={section}
                      index={idx}
                      id={`ch:${channelMeta.id}`}
                    >
                      <ArticleChannelMeta idx={idx} section={section} {...channelMeta} />
                    </ConnectedTrackImpression>
                  </ChannelList.Item>
                ) : null,
              )}
            </ChannelList.List>
          </ChannelList.Scene>
        )}
      </section>
    </ChannelList.SceneWrapper>
  );
};

export default ArticleChannelList;
