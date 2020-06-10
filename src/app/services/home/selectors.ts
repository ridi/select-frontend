import { RidiSelectState } from 'app/store';

export const getBooksBannerCurrentIdx = (state: RidiSelectState): number => state.home.currentIdx;
export const getArticlesBannerCurrentIdx = (state: RidiSelectState): number =>
  state.articleHome.currentIdx;
export const getFetchedAt = (state: RidiSelectState) => state.home.fetchedAt;
export const getIsUserFetching = (state: RidiSelectState) => state.user.isFetching;
export const getCollections = (state: RidiSelectState) => state.collectionsById;
