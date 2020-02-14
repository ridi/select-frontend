import { FetchStatusFlag } from 'app/constants';
import { ArticleChannel } from 'app/services/articleChannel';
import {
  FollowingArticleListResponse,
  FollowingChannelListResponse,
  SetAllFollowingFeedsToSeenResponse,
} from 'app/services/articleFollowing/requests';
import { ArticleKey, Paginated } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';
import { Method } from 'axios';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadFollowingChannelListRequest: createAction('loadFollowingChannelListRequest'),
  loadFollowingChannelListSuccess: createAction<{
    response: FollowingChannelListResponse;
  }>('loadFollowingChannelListSuccess'),
  loadFollowingChannelListFailure: createAction('loadFollowingChannelListFailure'),

  loadFollowingArticleListRequest: createAction<{ page: number }>(
    'loadFollowingArticleListRequest',
  ),
  loadFollowingArticleListSuccess: createAction<{
    page: number;
    response: FollowingArticleListResponse;
  }>('loadFollowingArticleListSuccess'),
  loadFollowingArticleListFailure: createAction<{ page: number }>(
    'loadFollowingArticleListFailure',
  ),
  loadUnFollowChannelRequest: createAction<{
    channelId: number;
    channelName: string;
    method: Method;
  }>('loadUnFollowChannelRequest'),
  loadUnseenFollowingFeedsRequest: createAction('loadUnseenFollowingFeedsRequest'),
  loadUnseenFollowingFeedsSuccess: createAction<{
    unSeenFeedList: number[];
  }>('loadUnseenFollowingFeedsSuccess'),
  loadUnseenFollowingFeedsFailure: createAction('loadUnseenFollowingFeedsFailure'),
  setUnseenFollowingFeedsToSeenRequest: createAction('setUnseenFollowingFeedsToSeenRequest'),
  setUnseenFollowingFeedsToSeenSuccess: createAction<SetAllFollowingFeedsToSeenResponse>(
    'setUnseenFollowingFeedsToSeenSuccess',
  ),
  setUnseenFollowingFeedsToSeenFailure: createAction('setUnseenFollowingFeedsToSeenFailure'),
};

export interface FollowingChannel {
  channelId: number;
  id: number;
  uIdx: number;
  channel: ArticleChannel;
}

export type FollowingArticleStateItem = Paginated<ArticleKey>;

export interface ArticleFollowingState {
  followingChannelList?: string[];
  followingArticleList?: FollowingArticleStateItem;
  itemCount?: number;
  fetchStatus: FetchStatusFlag;
  unseenFeeds?: number[];
  unseenFeedsFetchStatus: FetchStatusFlag;
}

export const INITIAL_STATE: ArticleFollowingState = {
  fetchStatus: FetchStatusFlag.IDLE,
  unseenFeedsFetchStatus: FetchStatusFlag.IDLE,
};

export const articleFollowReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

articleFollowReducer.on(Actions.loadFollowingChannelListRequest, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

articleFollowReducer.on(Actions.loadFollowingChannelListSuccess, (state, { response }) => ({
  ...state,
  followingChannelList: response.results.map(followingChannel => followingChannel.channel.name),
  fetchStatus: FetchStatusFlag.IDLE,
}));

articleFollowReducer.on(Actions.loadFollowingChannelListFailure, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

articleFollowReducer.on(Actions.loadFollowingArticleListRequest, (state, { page }) => ({
  ...state,
  followingArticleList: {
    ...state.followingArticleList,
    itemListByPage: {
      ...(state.followingArticleList && state.followingArticleList.itemListByPage),
      [page]: {
        ...(state.followingArticleList &&
          state.followingArticleList.itemListByPage &&
          state.followingArticleList.itemListByPage[page]),
        fetchStatus: FetchStatusFlag.FETCHING,
        isFetched: false,
      },
    },
  },
}));

articleFollowReducer.on(Actions.loadFollowingArticleListSuccess, (state, { page, response }) => ({
  ...state,
  followingArticleList: {
    ...state.followingArticleList,
    itemCount: response.totalCount,
    itemListByPage: {
      ...(state.followingArticleList && state.followingArticleList.itemListByPage),
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: response.results.map(article => getArticleKeyFromData(article)),
        isFetched: true,
      },
    },
  },
}));

articleFollowReducer.on(Actions.loadFollowingArticleListFailure, (state, { page }) => ({
  ...state,
  followingArticleList: {
    ...state.followingArticleList,
    itemListByPage: {
      ...(state.followingArticleList && state.followingArticleList.itemListByPage),
      [page]: {
        ...(state.followingArticleList &&
          state.followingArticleList.itemListByPage &&
          state.followingArticleList.itemListByPage[page]),
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        isFetched: false,
      },
    },
  },
}));

articleFollowReducer.on(Actions.loadUnseenFollowingFeedsRequest, state => ({
  ...state,
  unseenFeedsFetchStatus: FetchStatusFlag.FETCHING,
}));

articleFollowReducer.on(Actions.loadUnseenFollowingFeedsSuccess, (state, { unSeenFeedList }) => ({
  ...state,
  unseenFeeds: state.unseenFeeds ? state.unseenFeeds.concat(unSeenFeedList) : unSeenFeedList,
  unseenFeedsFetchStatus: FetchStatusFlag.IDLE,
}));

articleFollowReducer.on(Actions.loadUnseenFollowingFeedsFailure, state => ({
  ...state,
  unseenFeedsFetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

articleFollowReducer.on(Actions.setUnseenFollowingFeedsToSeenRequest, state => ({
  ...state,
  unseenFeedsFetchStatus: FetchStatusFlag.FETCHING,
}));

articleFollowReducer.on(Actions.setUnseenFollowingFeedsToSeenSuccess, state => ({
  ...state,
  unseenFeeds: [],
  unseenFeedsFetchStatus: FetchStatusFlag.IDLE,
}));

articleFollowReducer.on(Actions.setUnseenFollowingFeedsToSeenFailure, state => ({
  ...state,
  unseenFeedsFetchStatus: FetchStatusFlag.FETCH_ERROR,
}));
