import { createSelector } from 'reselect';

import { RidiSelectState } from 'app/store';
import { getPageQuery } from 'app/services/routing/selectors';
import {
  ARTICLE_HOME_SECTION_COUNT,
  ARTICLE_HOME_RECENT_SECTION_COUNT,
  FetchStatusFlag,
} from 'app/constants';

const popularArticleSelector = (state: RidiSelectState) => state.articleList.popularArticleList;
const recommendArticleSelector = (state: RidiSelectState) => state.articleList.recommendArticleList;
const recentArticleSelector = (state: RidiSelectState) => state.articleList.recentArticleList;
const articleByIdSelector = (state: RidiSelectState) => state.articlesById;

export const getPopularArticleListFetchStatus = createSelector(
  [popularArticleSelector, getPageQuery],
  (articleItems, page) => articleItems?.itemListByPage[page]?.fetchStatus || FetchStatusFlag.IDLE,
);
export const getPopularArticleListItemCount = createSelector(
  [popularArticleSelector],
  articleItems => articleItems?.itemCount || 0,
);

interface PopularArticleListProps {
  itemLimit: number;
}

export const getHomePopularArticleList = createSelector(
  [
    popularArticleSelector,
    articleByIdSelector,
    (_: RidiSelectState, props: PopularArticleListProps) => props.itemLimit,
  ],
  (articleItems, articleById, itemLimit) => {
    const itemList = articleItems?.itemListByPage[1]?.itemList;
    return itemList?.length > itemLimit
      ? itemList?.slice(0, itemLimit).map(id => articleById[id].article!)
      : itemList?.map(id => articleById[id].article!);
  },
);

export const getPopularArticleList = createSelector(
  [popularArticleSelector, articleByIdSelector, getPageQuery],
  (articleItems, articleById, page) =>
    articleItems?.itemListByPage[page]?.itemList?.map(
      articleKey => articleById[articleKey] && articleById[articleKey].article!,
    ) || [],
);

export const getRecentArticleListFetchStatus = createSelector(
  [recentArticleSelector, getPageQuery],
  (articleItems, page) => articleItems?.itemListByPage[page]?.fetchStatus || FetchStatusFlag.IDLE,
);
export const getRecentArticleListItemCount = createSelector(
  [recentArticleSelector],
  articleItems => articleItems?.itemCount || 0,
);

export const getHomeRecentArticleList = createSelector(
  [recentArticleSelector, articleByIdSelector],
  (articleItems, articleById) => {
    const itemList = articleItems?.itemListByPage[1]?.itemList;
    return itemList?.length > ARTICLE_HOME_RECENT_SECTION_COUNT
      ? itemList?.slice(0, ARTICLE_HOME_RECENT_SECTION_COUNT).map(id => articleById[id].article!)
      : itemList?.map(id => articleById[id].article!);
  },
);
export const getRecentArticleList = createSelector(
  [recentArticleSelector, articleByIdSelector, getPageQuery],
  (articleItems, articleById, page) =>
    articleItems?.itemListByPage[page]?.itemList?.map(
      articleKey => articleById[articleKey] && articleById[articleKey].article!,
    ) || [],
);

export const getRecommendArticleListFetchStatus = createSelector(
  [recommendArticleSelector, getPageQuery],
  (articleItems, page) => articleItems?.itemListByPage[page]?.fetchStatus || FetchStatusFlag.IDLE,
);

export const getRecommendArticleListItemCount = createSelector(
  [recommendArticleSelector],
  articleItems => articleItems?.itemCount || 0,
);

export const getHomeRecommendArticleList = createSelector(
  [recommendArticleSelector, articleByIdSelector],
  (articleItems, articleById) => {
    const itemList = articleItems?.itemListByPage[1]?.itemList;
    return itemList?.length > ARTICLE_HOME_SECTION_COUNT
      ? itemList?.slice(0, ARTICLE_HOME_SECTION_COUNT).map(id => articleById[id].article!)
      : itemList?.map(id => articleById[id].article!);
  },
);

export const getRecommendArticleList = createSelector(
  [recommendArticleSelector, articleByIdSelector, getPageQuery],
  (articleItems, articleById, page) =>
    articleItems?.itemListByPage[page]?.itemList?.map(
      articleKey => articleById[articleKey] && articleById[articleKey].article!,
    ) || [],
);
