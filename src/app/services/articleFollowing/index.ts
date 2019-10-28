import { FetchStatusFlag } from 'app/constants';
import { ArticleChannel } from 'app/services/articleChannel';
import { FollowingArticleListResponse, FollowingChannelListResponse } from 'app/services/articleFollowing/requests';
import { ArticleId, ChannelId, DateDTO, Paginated } from 'app/types';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadFollowingChannelListRequest: createAction('loadFollowingChannelListRequest'),
  loadFollowingChannelListSuccess: createAction<{ response: FollowingChannelListResponse}>('loadFollowingChannelListSuccess'),
  loadFollowingChannelListFailure: createAction('loadFollowingChannelListFailure'),

  loadFollowingArticleListRequest: createAction<{ page: number; }>('loadFollowingArticleListRequest'),
  loadFollowingArticleListSuccess: createAction<{
    page: number,
    response: FollowingArticleListResponse,
  }>('loadFollowingArticleListSuccess'),
  loadFollowingArticleListFailure: createAction<{ page: number; }>('loadFollowingArticleListFailure'),
};

export interface FollowingChannel {
  channelId: number;
  id: number;
  uIdx: number;
  channel: ArticleChannel;
}

export interface FollowingArticleStateItem extends Paginated<ArticleId> {}

export interface ArticleFollowingState {
  followingChannelList?: string[];
  followingArticleList?: FollowingArticleStateItem;
  isFetched: boolean;
  fetchStatus: FetchStatusFlag;
}

export const INITIAL_STATE: ArticleFollowingState = {
  isFetched: false,
  fetchStatus: FetchStatusFlag.IDLE,
};

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

articleFollowReducer.on(Actions.loadFollowingArticleListRequest, (state, { page }) => ({
  ...state,
  followingArticleList: {
    ...state.followingArticleList,
    itemListByPage: {
      ...(state.followingArticleList && state.followingArticleList.itemListByPage),
      [page]: {
        fetchStatus: FetchStatusFlag.FETCHING,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));

articleFollowReducer.on(Actions.loadFollowingArticleListSuccess, (state, { page, response }) => ({
  ...state,
  followingArticleList: {
    ...state.followingArticleList,
    itemListByPage: {
      ...(state.followingArticleList && state.followingArticleList.itemListByPage),
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: response.results.map((article) => article.id),
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
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));
