import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import {
  ArticleChannelArticlesResponse,
  ArticleChannelFollowingResponse,
  ArticleChannelListResponse,
} from 'app/services/articleChannel/requests';
import { ArticleKey, DateDTO, Paginated } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';
import { Method } from 'axios';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadArticleChannelListRequest: createAction('loadArticleChannelListRequest'),
  loadArticleChannelListSuccess: createAction<{
    response: ArticleChannelListResponse;
  }>('loadArticleChannelListSuccess'),
  loadArticleChannelListFailure: createAction('loadArticleChannelListFailure'),

  loadArticleChannelDetailRequest: createAction<{
    channelName: string;
  }>('loadArticleChannelDetailRequest'),
  loadArticleChannelDetailSuccess: createAction<{
    channelName: string;
    articleChannelDetail: ArticleChannel;
  }>('loadArticleChannelDetailSuccess'),
  loadArticleChannelDetailFailure: createAction<{
    channelName: string;
  }>('loadArticleChannelDetailFailure'),

  updateChannelDetail: createAction<{
    channels: ArticleChannel[];
  }>('updateChannelDetail'),

  loadArticleChannelArticlesRequest: createAction<{
    channelName: string;
    page: number;
  }>('loadArticleChannelArticlesRequest'),
  loadArticleChannelArticlesSuccess: createAction<{
    channelName: string;
    page: number;
    response: ArticleChannelArticlesResponse;
  }>('loadArticleChannelArticlesSuccess'),
  loadArticleChannelArticlesFailure: createAction<{
    channelName: string;
    page: number;
  }>('loadArticleChannelArticlesFailure'),

  articleChannelFollowingActionRequest: createAction<{
    channelId: number;
    channelName: string;
    method: Method;
  }>('articleChannelFollowingActionRequest'),
  articleChannelFollowingActionSuccess: createAction<{
    channelName: string;
    method: Method;
    response: ArticleChannelFollowingResponse;
  }>('articleChannelFollowingActionSuccess'),
  articleChannelFollowingActionFailure: createAction<{ channelName: string }>(
    'articleChannelFollowingActionFailure',
  ),
};

export interface ArticleChannel {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  thumbnailUrl?: string;
  subDescription?: string | null;
  category?: string | null;
  followersCount?: number;
  isFollowing?: boolean;
  articles?: ArticleResponse[];
  isEnabled?: boolean;
}

export interface ArticleChannelStateItem extends Paginated<ArticleKey> {
  id: number;
  channelMeta?: ArticleChannel;
  metaFetchStatus: FetchStatusFlag;
  followFetchStatus?: FetchStatusFlag;
  isMetaFetched: boolean;
}

export interface ArticleChannelListState {
  channelList: string[];
  isFetched: boolean;
  fetchStatus: FetchStatusFlag;
}
export interface ArticleChannelState {
  [channelName: string]: ArticleChannelStateItem;
}

export const INITIAL_STATE: ArticleChannelListState = {
  channelList: [],
  isFetched: false,
  fetchStatus: FetchStatusFlag.IDLE,
};
export const CHANNEL_INITIAL_STATE: ArticleChannelState = {};

export const articleChannelListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);
export const articleChannelReducer = createReducer<typeof CHANNEL_INITIAL_STATE>(
  {},
  CHANNEL_INITIAL_STATE,
);

/* ArticleChannelList */
articleChannelListReducer.on(Actions.loadArticleChannelListRequest, state => ({
  ...state,
  channelList: [],
  fetchStatus: FetchStatusFlag.FETCHING,
  isFetched: false,
}));

articleChannelListReducer.on(Actions.loadArticleChannelListSuccess, (state, { response }) => ({
  ...state,
  channelList: response.results.map(channel => String(channel.name)),
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: true,
}));

articleChannelListReducer.on(Actions.loadArticleChannelListFailure, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
  isFetched: false,
}));

/* ArticleChannelDetail */
articleChannelReducer.on(Actions.loadArticleChannelDetailRequest, (state, action) => {
  const { channelName } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      metaFetchStatus: FetchStatusFlag.FETCHING,
      isMetaFetched: false,
    },
  };
});

articleChannelReducer.on(Actions.loadArticleChannelDetailSuccess, (state, action) => {
  const { channelName, articleChannelDetail } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      metaFetchStatus: FetchStatusFlag.IDLE,
      channelMeta: {
        ...state[channelName].channelMeta,
        ...articleChannelDetail,
      },
      isMetaFetched: true,
    },
  };
});

articleChannelReducer.on(Actions.loadArticleChannelDetailFailure, (state, action) => {
  const { channelName } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      metaFetchStatus: FetchStatusFlag.FETCH_ERROR,
      isMetaFetched: false,
    },
  };
});

articleChannelReducer.on(Actions.updateChannelDetail, (state, action) => {
  const { channels = [] } = action;
  const newState: ArticleChannelState = channels.reduce((prev, channel) => {
    prev[channel.name] = {
      ...state[channel.name],
      channelMeta: state[channel.name]
        ? { ...state[channel.name].channelMeta, ...channel }
        : channel,
    };
    return prev;
  }, state);
  return newState;
});

articleChannelReducer.on(Actions.loadArticleChannelArticlesRequest, (state, action) => {
  const { channelName, page } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      name: channelName,
      itemListByPage: {
        ...(state[channelName] && state[channelName].itemListByPage),
        [page]: {
          fetchStatus: FetchStatusFlag.FETCHING,
          itemList: [],
          isFetched: false,
        },
      },
    },
  };
});

articleChannelReducer.on(Actions.loadArticleChannelArticlesSuccess, (state, action) => {
  const { channelName, response, page } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      itemListByPage: {
        ...state[channelName].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.IDLE,
          itemList: response.results.map(article => getArticleKeyFromData(article)),
          isFetched: true,
        },
      },
      itemCount: response.totalCount,
    },
  };
});

articleChannelReducer.on(Actions.loadArticleChannelArticlesFailure, (state, action) => {
  const { channelName, page } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      itemListByPage: {
        ...state[channelName].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.FETCH_ERROR,
          itemList: [],
          isFetched: false,
        },
      },
    },
  };
});

articleChannelReducer.on(Actions.articleChannelFollowingActionRequest, (state, action) => {
  const { channelName } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      followFetchStatus: FetchStatusFlag.FETCHING,
    },
  };
});

articleChannelReducer.on(Actions.articleChannelFollowingActionSuccess, (state, action) => {
  const { channelName, response, method } = action;

  let followersCount;

  if (typeof state[channelName].channelMeta!.followersCount === 'number') {
    followersCount =
      method === 'POST'
        ? state[channelName].channelMeta!.followersCount! + 1
        : state[channelName].channelMeta!.followersCount! - 1;
  }

  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      channelMeta: {
        ...state[channelName].channelMeta!,
        isFollowing: response.isFollowing,
        followersCount,
      },
      followFetchStatus: FetchStatusFlag.IDLE,
    },
  };
});

articleChannelReducer.on(Actions.articleChannelFollowingActionFailure, (state, action) => {
  const { channelName } = action;
  return {
    ...state,
    [channelName]: {
      ...state[channelName],
      followFetchStatus: FetchStatusFlag.FETCH_ERROR,
    },
  };
});
