import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';

const favoriteArticleItemsSelector = (state: RidiSelectState) => state.favoriteArticle;
const articleListSelector = (state: RidiSelectState) => state.articlesById;

export const getFavoriteArticleList = createSelector(
  [favoriteArticleItemsSelector, articleListSelector, getPageQuery],
  (articleItems, articleById, page) => {
    const itemList =
      articleItems &&
      articleItems.itemListByPage &&
      articleItems.itemListByPage[page] &&
      articleItems.itemListByPage[page].itemList
        ? articleItems.itemListByPage[page].itemList
        : null;
    if (itemList) {
      return itemList.map(
        articleKey => articleById[articleKey] && articleById[articleKey].article!,
      );
    }
    return null;
  },
);
