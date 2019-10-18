import { FetchStatusFlag } from 'app/constants';
import { ArticleResponse } from 'app/services/article/request';
import { DateDTO, Paginated } from 'app/types';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadArticleChannelListRequest: createAction<{
    page: number,
  }>('loadArticleChannelListRequest'),
  loadArticleChannelListSuccess: createAction<{
    page: number,
    articleChannelList: ArticleChannel[],
  }>('loadArticleChannelListSuccess'),
  loadArticleChannelListFailure: createAction<{
    page: number,
  }>('loadArticleChannelListFailure'),

};
export interface Article {
  id: number;
  title: string;
  reg_date: DateDTO;
  last_modified: DateDTO;
  channel_id: number;
  thumbnail_url: string;
  author_id: number;
}

export interface ArticleChannel {
  id: number;
  name: string;
  description?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  thumbnailUrl?: string;
  subDescription?: string | null;
  category?: string | null;
  articles: ArticleResponse[];
}

export interface ArticleChannelListState extends Paginated<ArticleChannel> {}

export const INITIAL_STATE: ArticleChannelListState = {
  itemListByPage: {},
};

export const articleChannelListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

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
