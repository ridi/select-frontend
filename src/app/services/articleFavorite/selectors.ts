import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';

const favoriteArticleItemsSelector = (state: RidiSelectState) => state.favoriteArticle;
const articleListSelector = (state: RidiSelectState) => state.articlesById;

export const getFavoriteArticleList = createSelector(
  [favoriteArticleItemsSelector, articleListSelector, getPageQuery],
  (articleItems, articleById, page) => {
    const { itemListByPage } = articleItems;
    if (itemListByPage[page]) {
      return itemListByPage[page].itemList.map((articleId) => articleById[Number(articleId)].article!);
    }
    return null;
  },
);
