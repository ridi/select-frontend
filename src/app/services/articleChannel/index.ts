import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/requests';
import { ArticleChannelArticlesResponse, ArticleChannelFollowingResponse } from 'app/services/articleChannel/requests';
import { ArticleId, DateDTO, Paginated } from 'app/types';
import { Method } from 'axios';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadArticleChannelListRequest: createAction<{
    page: number,
  }>('loadArticleChannelListRequest'),
  loadArticleChannelListSuccess: createAction<{
    page: number,
    articleChannelList: ArticleChannelList[],
  }>('loadArticleChannelListSuccess'),
  loadArticleChannelListFailure: createAction<{
    page: number,
  }>('loadArticleChannelListFailure'),

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

  articleChannelFollowingActionRequest: createAction<{ channelId: number, type: Method }>('articleChannelFollowingActionRequest'),
  articleChannelFollowingActionSuccess: createAction<{ channelId: number, response: ArticleChannelFollowingResponse }>('articleChannelFollowingActionSuccess'),
  articleChannelFollowingActionFailure: createAction<{ channelId: number }>('articleChannelFollowingActionFailure'),
};

export interface ArticleChannel {
  id: number;
  name: string;
  description?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  thumbnailUrl?: string;
  subDescription?: string | null;
  category?: string | null;
  followersCount?: number;
  isFollowing?: boolean;
}

export interface ArticleChannelStateItem extends Paginated<ArticleId> {
  id: number;
  channelMeta?: ArticleChannel;
  metaFetchStatus: FetchStatusFlag;
  isMetaFetched: boolean;
}

export interface ArticleChannelList extends ArticleChannel {
  articles: ArticleResponse[];
}

export interface ArticleChannelListState extends Paginated<ArticleChannelList> {}
export interface ArticleChannelState {
  [channelId: number]: ArticleChannelStateItem;
}

export const INITIAL_STATE: ArticleChannelListState = {
  itemListByPage: {},
};
export const CHANNEL_INITIAL_STATE: ArticleChannelState = {};

export const articleChannelListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);
export const articleChannelReducer = createReducer<typeof CHANNEL_INITIAL_STATE>({}, CHANNEL_INITIAL_STATE);

/* ArticleChannelList */
articleChannelListReducer.on(Actions.loadArticleChannelListRequest, (state, { page }) => ({
  ...state,
  itemListByPage: {
    ...state.itemListByPage,
    [page]: {
      fetchStatus: FetchStatusFlag.FETCHING,
      itemList: [],
      isFetched: false,
    },
  },
}));

articleChannelListReducer.on(Actions.loadArticleChannelListSuccess, (state, { articleChannelList, page }) => ({
  ...state,
  itemListByPage: {
    ...state.itemListByPage,
    [page]: {
      fetchStatus: FetchStatusFlag.IDLE,
      itemList: articleChannelList,
      isFetched: true,
    },
  },
}));

articleChannelListReducer.on(Actions.loadArticleChannelListFailure, (state, { page }) => ({
  ...state,
  itemListByPage: {
    ...state.itemListByPage,
    [page]: {
      ...state.itemListByPage[page],
      fetchStatus: FetchStatusFlag.FETCH_ERROR,
      isFetched: false,
    },
  },
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
          itemList: response.results.map((article) => article.id),
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
      isFollowing: response.isFollowing,
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
