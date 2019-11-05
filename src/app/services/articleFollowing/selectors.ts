import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';

const channelItemsSelector = (state: RidiSelectState) => state.articleFollowing.followingChannelList;
const channelByIdSelector = (state: RidiSelectState) => state.articleChannelById;
const articleItemsSelector = (state: RidiSelectState) => state.articleFollowing.followingArticleList;
const articleByIdSelector = (state: RidiSelectState) => state.articlesById;

export const getChannelItems = createSelector(
  [channelItemsSelector, channelByIdSelector],
  (channelItems, channelById) => {
    if (channelItems) {
      return channelItems.map((channelId) => channelById[Number(channelId)].channelMeta!);
    }
    return [];
  },
);

export const getArticleItems = createSelector(
  [articleItemsSelector, articleByIdSelector, getPageQuery],
  (articleItems, articleById, page) => {
    if (articleItems) {
      const { itemListByPage } = articleItems;
      return itemListByPage[page].itemList.map((articleId) => articleById[Number(articleId)].article!);
    }
    return [];
  },
);
