import { FetchStatusFlag } from 'app/constants';
import { ReservedCollectionIds } from 'app/services/collection';
import { ArticleListType } from 'app/services/articleList';

export interface BigBanner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export type FetchedAt = number | null;
export type CollectionId = number | ReservedCollectionIds;
export type CollectionIdList = (CollectionId | ArticleListType.POPULAR)[];
export interface HomeResponse {
  fetchedAt: FetchedAt;
  bigBannerList: BigBanner[];
  collectionIdList: CollectionIdList;
}

export interface HomeState extends HomeResponse {
  fetchStatus: FetchStatusFlag;
  currentIdx: number;
}

export const INITIAL_HOME_STATE: HomeState = {
  fetchedAt: null,
  fetchStatus: FetchStatusFlag.IDLE,
  currentIdx: 0,
  bigBannerList: [],
  collectionIdList: [],
};

export interface PopularArticleCollectionState {
  id: ArticleListType.POPULAR;
  type: ArticleListType.POPULAR;
}

export const popularArticleCollectionState: PopularArticleCollectionState = {
  id: ArticleListType.POPULAR,
  type: ArticleListType.POPULAR,
};
