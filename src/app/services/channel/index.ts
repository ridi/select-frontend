import { FetchStatusFlag } from 'app/constants';
import { DateDTO } from 'app/types';
import { createAction, createReducer } from 'redux-act';

export const Actions = {
  loadArticleChannelListRequest: createAction('loadArticleChannelListRequest'),
  loadArticleChannelListSuccess: createAction<{
    articleChannelList: ArticleChannel[],
  }>('loadArticleChannelListSuccess'),
  loadArticleChannelListFailure: createAction('loadArticleChannelListFailure'),

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
  description: string;
  reg_date: DateDTO;
  last_modified: DateDTO;
  thumbnail_url: string;
  sub_description: string | null;
  category: string | null;
  articles: Article[];
}

export interface ArticleChannelListState {
  isFetched: boolean;
  itemList: ArticleChannel[];
  fetchStatus: FetchStatusFlag;
}

export const INITIAL_STATE: ArticleChannelListState = {
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: false,
  itemList: [],
};

export const articleChannelListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

articleChannelListReducer.on(Actions.loadArticleChannelListRequest, (state) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

articleChannelListReducer.on(Actions.loadArticleChannelListSuccess, (state, { articleChannelList }) => ({
  ...state,
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: true,
  itemList: articleChannelList,
}));

articleChannelListReducer.on(Actions.loadArticleChannelListFailure, (state) => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));
