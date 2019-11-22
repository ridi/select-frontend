import { FetchStatusFlag } from 'app/constants';
import { ArticleChannel } from 'app/services/articleChannel';
import { FollowingArticleListResponse, FollowingChannelListResponse } from 'app/services/articleFollowing/requests';
import { ArticleKey, Paginated } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadFollowingChannelListRequest: createAction('loadFollowingChannelListRequest'),
  loadFollowingChannelListSuccess: createAction<{
    response: FollowingChannelListResponse,
  }>('loadFollowingChannelListSuccess'),
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

export interface FollowingArticleStateItem extends Paginated<ArticleKey> {}

export interface ArticleFollowingState {
  followingChannelList?: string[];
  followingArticleList?: FollowingArticleStateItem;
  itemCount?: number;
  fetchStatus: FetchStatusFlag;
}

export const INITIAL_STATE: ArticleFollowingState = {
  fetchStatus: FetchStatusFlag.IDLE,
};

export const articleFollowReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

articleFollowReducer.on(Actions.loadFollowingChannelListRequest, (state) => ({
  ...state,
  followingChannelList: [],
  fetchStatus: FetchStatusFlag.FETCHING,
}));

articleFollowReducer.on(Actions.loadFollowingChannelListSuccess, (state, { response }) => ({
  ...state,
  followingChannelList: response.results.map((followingChannel) => followingChannel.channel.name),
  fetchStatus: FetchStatusFlag.IDLE,
}));

articleFollowReducer.on(Actions.loadFollowingChannelListFailure, (state) => ({
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
        ...(state.followingArticleList && state.followingArticleList.itemListByPage && state.followingArticleList.itemListByPage[page]),
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
        itemList: response.results.map((article) => getArticleKeyFromData(article)),
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
