import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';

const channelItemsSelector = (state: RidiSelectState) =>
  state.articleFollowing.followingChannelList;
const channelByIdSelector = (state: RidiSelectState) => state.articleChannelById;
const articleItemsSelector = (state: RidiSelectState) =>
  state.articleFollowing.followingArticleList;
const articleByIdSelector = (state: RidiSelectState) => state.articlesById;

export const getChannelItems = createSelector(
  [channelItemsSelector, channelByIdSelector],
  (channelItems, channelById) => {
    if (channelItems) {
      return channelItems.map(channelName => channelById[channelName].channelMeta!);
    }
    return null;
  },
);

export const getArticleItems = createSelector(
  [articleItemsSelector, articleByIdSelector, getPageQuery],
  (articleItems, articleById, page) => {
    const itemList =
      articleItems &&
      articleItems.itemListByPage &&
      articleItems.itemListByPage[page] &&
      articleItems.itemListByPage[page].itemList
        ? articleItems.itemListByPage[page].itemList
        : [];
    if (itemList) {
      return itemList.map(
        articleKey => articleById[articleKey] && articleById[articleKey].article!,
      );
    }
    return [];
  },
);
