import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import { PCPageHeader } from 'app/components';
import { ConnectedGridBookList } from 'app/components/GridBookList';
import history from 'app/config/history';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Category as CategoryState, CategoryCollectionState } from 'app/services/category';
import { Actions as categoryActions } from 'app/services/category';
import { getIdFromLocationSearch, isValidNumber } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';

import { Pagination } from 'app/components/Pagination';
import { getPageQuery } from 'app/services/routing/selectors';
import { Link, LinkProps } from 'react-router-dom';

interface CategoryStateProps {
  isCategoryListFetched: boolean;
  categoryList: CategoryState[];
  categoryId: number;
  category: CategoryCollectionState;
  books: BookState;
  page: number;
}

type Props = CategoryStateProps & ReturnType<typeof mapDispatchToProps>;

interface State {
  isInitialized: boolean;
}

export class Category extends React.Component<Props, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  private isFetched = (page: number) => {
    const { category } = this.props;
    return category && category.itemListByPage[page] && category.itemListByPage[page].isFetched;
  }

  private renderSelectBox() {
    const { categoryId, categoryList = [] } = this.props;
    return (
      <div className="RUISelectBox RUISelectBox-outline Category_SelectBox">
        <select
          title="카테고리 선택"
          className="RUISelectBox_Select"
          value={categoryId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            history.push(`/categories?id=${e.currentTarget.value}`);
          }}
        >
          {categoryList.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}}
        </select>
        <svg viewBox="0 0 48 28" className="RUISelectBox_OpenIcon">
          <path d="M48 .6H0l24 26.8z"/>
        </svg>
      </div>
    );
  }

  public componentDidMount() {
    const { categoryId, page,
      isCategoryListFetched,
      dispatchCacheCategoryId,
      dispatchInitializeCategoriesWhole,
      dispatchLoadCategoryBooks } = this.props;

    this.initialDispatchTimeout = window.setTimeout(() => {
      if (isValidNumber(categoryId)) {
        dispatchCacheCategoryId(categoryId);
      }
      dispatchInitializeCategoriesWhole(
        !isCategoryListFetched,
        !isValidNumber(categoryId),
      );

      if (!this.isFetched(page)) {
        dispatchLoadCategoryBooks(categoryId, page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public componentDidUpdate(prevProps: Props) {
    const { categoryId } = this.props;
    if (this.state.isInitialized && isValidNumber(categoryId) && prevProps.categoryId !== categoryId) {
      this.props.dispatchCacheCategoryId(categoryId);
    }

    if (prevProps.page !== this.props.page) {
      const { dispatchLoadCategoryBooks, page } = this.props;

      if (!this.isFetched(page)) {
        dispatchLoadCategoryBooks(categoryId, page);
      }
    }
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    const {
      books,
      category,
      categoryId,
      dispatchLoadCategoryBooks,
      isCategoryListFetched,
      page,
    } = this.props;

    const selectBoxTemplate = (isValidNumber(categoryId) && this.renderSelectBox());
    return (
      <main className="SceneWrapper">
        <Helmet title="카테고리 - 리디셀렉트" />
        <PCPageHeader pageTitle="카테고리">
          {selectBoxTemplate}
        </PCPageHeader>
        <MediaQuery maxWidth={840}>
          {(isMobile) => isMobile
            && (
            <div className="Category_Header GridBookList">
              {selectBoxTemplate}
            </div>
          )}
        </MediaQuery>
        {(
          !this.state.isInitialized || !isCategoryListFetched || !isValidNumber(categoryId)
        ) ? (
          <GridBookListSkeleton />
        ) : (
          <>

          {/* <ConnectedGridBookList
            pageTitleForTracking="category"
            filterForTracking={categoryId.toString()}
            books={category.itemListByPage[page].itemList.map((id) => books[id].book!)}
          /> */}
          {/* <Pagination /> */}
          </>

          // <ConnectedListWithPagination
          //   isFetched={(page) => category && category.itemListByPage[page] && category.itemListByPage[page].isFetched}
          //   fetch={(page) => dispatchLoadCategoryBooks(categoryId, page)}
          //   itemCount={category ? category.itemCount : undefined}
          //   buildPaginationURL={(p: number) => `/categories?id=${categoryId}&page=${p}`}
          //   renderPlaceholder={() => (<GridBookListSkeleton />)}
          //   _key={categoryId.toString()}
          //   renderItems={(page) => (
          //     <ConnectedGridBookList
          //       pageTitleForTracking="category"
          //       filterForTracking={categoryId.toString()}
          //       books={category.itemListByPage[page].itemList.map((id) => books[id].book!)}
          //     />
          //   )}
          // />
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CategoryStateProps => {
  return {
    isCategoryListFetched: rootState.categories.isFetched,
    categoryList: rootState.categories.itemList,
    categoryId: Number(getIdFromLocationSearch(rootState.router.location!.search)),
    category: rootState.categoriesById[Number(getIdFromLocationSearch(rootState.router.location!.search))],
    books: rootState.booksById,
    page: getPageQuery(rootState),
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchInitializeCategoriesWhole: (shouldFetchCategoryList: boolean, shouldInitializeCategoryId: boolean) =>
    dispatch(categoryActions.initializeCategoriesWhole({ shouldFetchCategoryList, shouldInitializeCategoryId })),
  dispatchLoadCategoryList: () =>
    dispatch(categoryActions.loadCategoryListRequest()),
  dispatchInitializeCategoryId: () =>
    dispatch(categoryActions.initializeCategoryId()),
  dispatchCacheCategoryId: (categoryId: number) =>
    dispatch(categoryActions.cacheCategoryId({ categoryId })),
  dispatchLoadCategoryBooks: (categoryId: number, page: number) =>
    dispatch(categoryActions.loadCategoryBooksRequest({ categoryId, page })),
});

export const ConnectedCategory = connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Category);
