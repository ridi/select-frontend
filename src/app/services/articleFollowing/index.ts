import { FetchStatusFlag } from 'app/constants';
import { ArticleChannel } from 'app/services/articleChannel';
import { FollowingChannelListResponse } from 'app/services/articleFollowing/requests';
import { ArticleId, DateDTO, Paginated } from 'app/types';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadFollowingChannelListRequest: createAction('loadFollowingChannelListRequest'),
  loadFollowingChannelListSuccess: createAction<{ response: FollowingChannelListResponse}>('loadFollowingChannelListSuccess'),
  loadFollowingChannelListFailure: createAction('loadFollowingChannelListFailure'),

  loadFollowingArticleListRequest: createAction('loadFollowingArticleListRequest'),
  loadFollowingArticleListSuccess: createAction('loadFollowingArticleListSuccess'),
  loadFollowingArticleListFailure: createAction('loadFollowingArticleListFailure'),
};

export interface FollowingChannel {
  channelId: number;
  id: number;
  uIdx: number;
  channel: ArticleChannel;
}

export interface ArticleFollowingState {
  followingChannelList: string[];
  followingArticleList: string[];
  isFetched: boolean;
  fetchStatus: FetchStatusFlag;
}

export const INITIAL_STATE = {};
export const articleFollowReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

articleFollowReducer.on(Actions.loadFollowingChannelListRequest, (state) => ({
  ...state,
  followingChannelList: [],
  fetchStatus: FetchStatusFlag.FETCHING,
  isFetched: false,
}));

articleFollowReducer.on(Actions.loadFollowingChannelListSuccess, (state, { response }) => ({
  ...state,
  followingChannelList: response.results.map((channel) => String(channel.channelId)),
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: true,
}));

articleFollowReducer.on(Actions.loadFollowingChannelListFailure, (state) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
  isFetched: false,
}));
