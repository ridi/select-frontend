import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import { ArticleChannelArticlesResponse, ArticleChannelFollowingResponse, ArticleChannelListResponse } from 'app/services/articleChannel/requests';
import { ArticleId, DateDTO, Paginated } from 'app/types';
import { getArticleKeyFromData } from 'app/utils/utils';
import { Method } from 'axios';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadArticleChannelListRequest: createAction('loadArticleChannelListRequest'),
  loadArticleChannelListSuccess: createAction<{
    response: ArticleChannelListResponse,
  }>('loadArticleChannelListSuccess'),
  loadArticleChannelListFailure: createAction('loadArticleChannelListFailure'),

  loadArticleChannelDetailRequest: createAction<{
    channelId: number,
  }>('loadArticleChannelDetailRequest'),
  loadArticleChannelDetailSuccess: createAction<{
    channelId: number,
    articleChannelDetail: ArticleChannel,
  }>('loadArticleChannelDetailSuccess'),
  loadArticleChannelDetailFailure: createAction<{
    channelId: number,
  }>('loadArticleChannelDetailFailure'),

  updateChannelDetail: createAction<{
    channels: ArticleChannel[],
  }>('updateChannelDetail'),

  loadArticleChannelArticlesRequest: createAction<{
    channelId: number,
    page: number,
  }>('loadArticleChannelArticlesRequest'),
  loadArticleChannelArticlesSuccess: createAction<{
    channelId: number,
    page: number,
    response: ArticleChannelArticlesResponse,
  }>('loadArticleChannelArticlesSuccess'),
  loadArticleChannelArticlesFailure: createAction<{
    channelId: number,
    page: number,
  }>('loadArticleChannelArticlesFailure'),

  articleChannelFollowingActionRequest: createAction<{ channelId: number, method: Method }>('articleChannelFollowingActionRequest'),
  articleChannelFollowingActionSuccess: createAction<{ channelId: number, response: ArticleChannelFollowingResponse }>('articleChannelFollowingActionSuccess'),
  articleChannelFollowingActionFailure: createAction<{ channelId: number }>('articleChannelFollowingActionFailure'),
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
  isEnable?: boolean;
}

export interface ArticleChannelStateItem extends Paginated<ArticleId> {
  id: number;
  channelMeta?: ArticleChannel;
  metaFetchStatus: FetchStatusFlag;
  isMetaFetched: boolean;
}

export interface ArticleChannelListState {
  channelList: string[];
  isFetched: boolean;
  fetchStatus: FetchStatusFlag;
}
export interface ArticleChannelState {
  [channelId: number]: ArticleChannelStateItem;
}

export const INITIAL_STATE: ArticleChannelListState = {
  channelList: [],
  isFetched: false,
  fetchStatus: FetchStatusFlag.IDLE,
};
export const CHANNEL_INITIAL_STATE: ArticleChannelState = {};

export const articleChannelListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);
export const articleChannelReducer = createReducer<typeof CHANNEL_INITIAL_STATE>({}, CHANNEL_INITIAL_STATE);

/* ArticleChannelList */
articleChannelListReducer.on(Actions.loadArticleChannelListRequest, (state) => ({
  ...state,
  channelList: [],
  fetchStatus: FetchStatusFlag.FETCHING,
  isFetched: false,
}));

articleChannelListReducer.on(Actions.loadArticleChannelListSuccess, (state, { response }) => ({
  ...state,
  channelList: response.results.map((channel) => String(channel.id)),
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: true,
}));

articleChannelListReducer.on(Actions.loadArticleChannelListFailure, (state) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
  isFetched: false,
}));

/* ArticleChannelDetail */
articleChannelReducer.on(Actions.loadArticleChannelDetailRequest, (state, action) => {
  const { channelId } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      metaFetchStatus: FetchStatusFlag.FETCHING,
      isMetaFetched: false,
    },
  };
});

articleChannelReducer.on(Actions.loadArticleChannelDetailSuccess, (state, action) => {
  const { channelId, articleChannelDetail } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      metaFetchStatus: FetchStatusFlag.IDLE,
      channelMeta: {
        ...state[channelId].channelMeta,
        ...articleChannelDetail,
      },
      isMetaFetched: true,
    },
  };
});

articleChannelReducer.on(Actions.loadArticleChannelDetailFailure, (state, action) => {
  const { channelId } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      metaFetchStatus: FetchStatusFlag.FETCH_ERROR,
      isMetaFetched: false,
    },
  };
});

articleChannelReducer.on(Actions.updateChannelDetail, (state, action) => {
  const { channels = [] } = action;
  const newState: ArticleChannelState = channels.reduce((prev, channel) => {
    prev[channel.id] = {
      ...state[channel.id],
      channelMeta: !!state[channel.id] ? { ...state[channel.id].channelMeta, ...channel } : channel,
    };
    return prev;
  }, state);
  return newState;
});

articleChannelReducer.on(Actions.loadArticleChannelArticlesRequest, (state, action) => {
  const { channelId, page } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      id: channelId,
      itemListByPage: {
        ...(state[channelId] && state[channelId].itemListByPage),
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
  const { channelId, response, page } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      itemListByPage: {
        ...state[channelId].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.IDLE,
          itemList: response.results.map((article) => getArticleKeyFromData(article)),
          isFetched: true,
        },
      },
      itemCount: response.totalCount,
    },
  };
});

articleChannelReducer.on(Actions.loadArticleChannelArticlesFailure, (state, action) => {
  const { channelId, page } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      itemListByPage: {
        ...state[channelId].itemListByPage,
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
  const { channelId } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      followFetchStatus: FetchStatusFlag.FETCHING,
    },
  };
});

articleChannelReducer.on(Actions.articleChannelFollowingActionSuccess, (state, action) => {
  const { channelId, response } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      channelMeta: {
        ...state[channelId].channelMeta!,
        isFollowing: response.isFollowing,
      },
      followFetchStatus: FetchStatusFlag.IDLE,
    },
  };
});

articleChannelReducer.on(Actions.articleChannelFollowingActionFailure, (state, action) => {
  const { channelId } = action;
  return {
    ...state,
    [channelId]: {
      ...state[channelId],
      followFetchStatus: FetchStatusFlag.FETCH_ERROR,
    },
  };
});
