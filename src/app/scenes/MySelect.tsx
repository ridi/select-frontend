import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { Button, CheckBox, Empty, Icon } from '@ridi/rsg';
import { DTOBookThumbnail, HelmetWithTitle, Pagination, PCPageHeader } from 'app/components';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { FetchStatusFlag, MAX_WIDTH, PageTitleText } from 'app/constants';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { getIsAndroidInApp } from 'app/services/environment/selectors';
import { Actions, MySelectBook, PaginatedMySelectBooks } from 'app/services/mySelect';
import { BookIdsPair } from 'app/services/mySelect/requests';
import { getPageQuery } from 'app/services/routing/selectors';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { downloadBooksInRidiselect } from 'app/utils/downloadUserBook';
import toast from 'app/utils/toast';
import { stringifyAuthors } from 'app/utils/utils';
import * as classNames from 'classnames';

interface StateProps {
  isAndroidInApp: boolean;
  BASE_URL_STORE: string;
  isUserFetching: boolean;
  isLoggedIn: boolean;
  hasAvailableTicket: boolean;
  mySelectBooks: PaginatedMySelectBooks;
  deletionFetchStatus: FetchStatusFlag;
  isReSubscribed?: boolean;
  page: number;
}

type Props = StateProps & ReturnType<typeof mapDispatchToProps>;

interface State {
  bookInputs: {
    [mySelectBookId: string]: boolean;
  };
  isInitialized: boolean;
}

class MySelect extends React.Component<Props, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    bookInputs: {},
    isInitialized: false,
  };

  private handleDeleteButtonClick = () => {
    const { bookInputs } = this.state;
    const { deletionFetchStatus, dispatchDeleteMySelectRequest, mySelectBooks, page } = this.props;
    const isEveryBookChecked = this.areEveryBookChecked();
    const bookEntries: Array<[string, boolean]> = Object.entries(bookInputs);
    if (!bookEntries.some((entry) => entry[1]) || deletionFetchStatus !== FetchStatusFlag.IDLE) {
      toast.failureMessage('삭제할 책을 선택해주세요.');
      return;
    }
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }
    const deleteBookIdPairs = mySelectBooks.itemListByPage[page].itemList
      .filter((book) => !!bookInputs[book.mySelectBookId])
      .map((book) => ({
        bookId: book.id,
        mySelectBookId: book.mySelectBookId,
      }));
    dispatchDeleteMySelectRequest(deleteBookIdPairs, page, isEveryBookChecked);
  }

  private handleDownloadSelectedBooksButtonClick = () => {
    const { bookInputs } = this.state;
    const { mySelectBooks, page } = this.props;
    const bookEntries: Array<[string, boolean]> = Object.entries(bookInputs);
    if (bookEntries.filter(([_, selected]) => selected).length === 0) {
      toast.failureMessage('다운로드할 책을 선택해주세요.');
      return;
    }
    const bookIds = mySelectBooks.itemListByPage[page].itemList
      .filter((book) => !!bookInputs[book.mySelectBookId])
      .map((book) => book.id);
    downloadBooksInRidiselect(bookIds);
  }

  private handleDownloadBookButtonClick = (book: MySelectBook) => () => {
    downloadBooksInRidiselect([book.id]);
  }

  private handleSelectAllCheckBoxChange = () => {
    const { mySelectBooks, page } = this.props;
    const books = mySelectBooks.itemListByPage[page].itemList;
    this.setState({
      bookInputs: books.reduce((prev, book) => ({
        ...prev,
        [book.mySelectBookId]: !this.areEveryBookChecked(),
      }), {}),
    });
  }

  private areEveryBookChecked = () => {
    const { bookInputs } = this.state;
    const { mySelectBooks, page } = this.props;

    const books = mySelectBooks.itemListByPage[page].itemList;

    return Object.keys(bookInputs).length > 0 && books.every((book) => bookInputs[book.mySelectBookId]);
  }

  private isFetched(page: number) {
    const { isLoggedIn, hasAvailableTicket, mySelectBooks } = this.props;

    if (isLoggedIn && !hasAvailableTicket) {
      return true;
    }

    return (
      mySelectBooks.itemListByPage[page] &&
      mySelectBooks.itemListByPage[page].fetchStatus !== FetchStatusFlag.FETCHING
    );
  }

  private fetchMySelectData(props: Props) {
    const {
      page,
      isLoggedIn,
      mySelectBooks,
      hasAvailableTicket,
      BASE_URL_STORE,
      isUserFetching,
      dispatchLoadMySelectRequest,
    } = props;

    if (!isUserFetching && !isLoggedIn) {
      window.location.replace(`${BASE_URL_STORE}/account/oauth-authorize?fallback=login&return_url=${window.location.href}`);
      return;
    }

    if (!isUserFetching && !hasAvailableTicket) {
      return;
    }

    if (
      !mySelectBooks.itemListByPage[page] ||
      mySelectBooks.itemListByPage[page].fetchStatus !== FetchStatusFlag.FETCHING
    ) {
      dispatchLoadMySelectRequest(page);
    }
  }

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      this.fetchMySelectData(this.props);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page) {
      this.fetchMySelectData(nextProps);
    }

    return true;
  }

  public componentDidUpdate(prevProps: Props) {
    const { dispatchResetMySelectPageFetchedStatus, mySelectBooks, page } = this.props;
    if (prevProps.page !== page) {
      this.setState({
        bookInputs: {},
      });
      dispatchResetMySelectPageFetchedStatus(prevProps.page);
    }
    const books =
      mySelectBooks &&
      mySelectBooks.itemListByPage[page] &&
      mySelectBooks.itemListByPage[page].itemList ?
        mySelectBooks.itemListByPage[page].itemList : [];
    const prevBooksLength =
      prevProps.mySelectBooks &&
      prevProps.mySelectBooks.itemListByPage[prevProps.page] &&
      prevProps.mySelectBooks.itemListByPage[prevProps.page].itemList ?
        prevProps.mySelectBooks.itemListByPage[prevProps.page].itemList.length : 0;
    if (prevBooksLength !== books.length) {
      // Set up state for checkboxes
      this.setState({
        bookInputs: Object.values(books).reduce((prev, book: MySelectBook) => ({
          ...prev,
          [book.mySelectBookId]: this.state.bookInputs[book.mySelectBookId] || false,
        }), {}),
      });
    }
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
    }
  }

  public renderBooks(books: MySelectBook[]) {
    const { trackClick } = this.props;
    const section = getSectionStringForTracking('select-book', 'my-select', 'book-list');

    return (
      <div>
        <ul className="MySelectBookList">
          {books.map((book, idx) => (
            <li className="MySelectBookList_Item" key={book.mySelectBookId}>
              <CheckBox
                className="MySelectBookList_CheckBox"
                checked={this.state.bookInputs[book.mySelectBookId] || false}
                onChange={(e) =>
                  this.setState({
                    ...this.state,
                    bookInputs: {
                      ...this.state.bookInputs,
                      [book.mySelectBookId]: e.target.checked,
                    },
                  })
                }
              />
              <ConnectedTrackImpression
                section={section}
                index={idx}
                id={book.id}
              >
                <div className="MySelectBookList_Book">
                  <DTOBookThumbnail
                    book={book}
                    width={100}
                    linkUrl={`/book/${book.id}`}
                    linkType="Link"
                    imageClassName="MySelectBookList_Thumbnail"
                    linkWrapperClassName="MySelectBookList_Link"
                    onLinkClick={() => section && trackClick({
                      section,
                      index: idx,
                      id: book.id,
                    })}
                  />
                  <div className="MySelectBookList_Right">
                    <Link
                      to={`/book/${book.id}`}
                      className="MySelectBookList_Link"
                      onClick={() => section && trackClick({
                        section,
                        index: idx,
                        id: book.id,
                      })}
                    >
                      <div className="MySelectBookList_Meta">
                        <h2 className="MySelectBookList_Title">{book.title.main}</h2>
                        <span className="MySelectBookList_Authors">{stringifyAuthors(book.authors, 2)}</span>
                      </div>
                    </Link>
                    <Button
                      color="blue"
                      className="MySelectBookList_IndividualDownload"
                      onClick={this.handleDownloadBookButtonClick(book)}
                    >
                      다운로드
                    </Button>
                  </div>
                </div>
              </ConnectedTrackImpression>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  public render() {
    const { isUserFetching, isLoggedIn, hasAvailableTicket, mySelectBooks, page, isReSubscribed } = this.props;

    const itemCount: number = mySelectBooks.itemCount ? mySelectBooks.itemCount : 0;
    const itemCountPerPage: number = mySelectBooks.size;
    return (
      <main
        className={classNames(
          'SceneWrapper',
          'SceneWrapper_WithGNB',
          'SceneWrapper_WithLNB',
        )}
      >
        <HelmetWithTitle titleName={PageTitleText.MY_SELECT} />
        <div className="PageMySelect">
          {!this.isFetched(page) ? (
            <LandscapeBookListSkeleton hasCheckbox={true} />
          ) : mySelectBooks.itemCount && mySelectBooks.itemCount > 0 ? (
            <>
              <PCPageHeader pageTitle="마이 셀렉트" />
              <div className="PageMySelect">
                <div className="MySelectControls">
                  <div className="MySelectControls_CheckBoxWrapper">
                    <CheckBox
                      className="MySelectControls_CheckBox"
                      checked={this.areEveryBookChecked()}
                      onChange={this.handleSelectAllCheckBoxChange}
                    >
                      전체 선택
                    </CheckBox>
                  </div>
                  <Button
                    onClick={this.handleDeleteButtonClick}
                    className="MySelectControls_Button"
                    outline={true}
                    spinner={this.props.deletionFetchStatus === FetchStatusFlag.FETCHING}
                  >
                    선택 삭제
                  </Button>
                  <Button
                    className="MySelectControls_Button"
                    color="blue"
                    onClick={this.handleDownloadSelectedBooksButtonClick}
                  >
                    다운로드
                  </Button>
                </div>
                {this.renderBooks(mySelectBooks.itemListByPage[page].itemList)}
              </div>
              <MediaQuery maxWidth={MAX_WIDTH}>
                {(isMobile) => <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(itemCount / itemCountPerPage)}
                  isMobile={isMobile}
                  item={{
                    el: Link,
                    getProps: (p): LinkProps => ({
                      to: `/my-select?page=${p}`,
                    }),
                  }}
                />}
              </MediaQuery>
            </>
          ) : (!isUserFetching && isLoggedIn && hasAvailableTicket && isReSubscribed) ? (
            <>
              <Empty className={'Empty_HasButton'} description="이전에 이용한 책을 도서 이용 내역에서 확인해보세요." iconName="book_1" />
              <Link to={'/my-select-history'} className="MySelectBookList_Link">
                <Button
                  color="blue"
                  outline={true}
                  className="PageSearchResult_RidibooksResult"
                  size="large"
                  style={{
                    marginTop: '10px',
                  }}
                >
                    도서 이용 내역 확인하기
                  <Icon
                    name="arrow_5_right"
                    className="PageSearchResult_RidibooksResultIcon"
                  />
                </Button>
              </Link>
            </>
          ) : (
            <Empty description="마이 셀렉트에 등록된 도서가 없습니다." iconName="book_1" />
          )}
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): StateProps => ({
  isAndroidInApp: getIsAndroidInApp(state),
  BASE_URL_STORE: state.environment.STORE_URL,
  isUserFetching: state.user.isFetching,
  isLoggedIn: state.user.isLoggedIn,
  hasAvailableTicket: state.user.hasAvailableTicket,
  mySelectBooks: state.mySelect.mySelectBooks,
  deletionFetchStatus: state.mySelect.deletionFetchStatus,
  isReSubscribed: state.mySelect.isReSubscribed,
  page: getPageQuery(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLoadMySelectRequest: (page: number) =>
    dispatch(Actions.loadMySelectRequest({ page })),
  dispatchDeleteMySelectRequest: (deleteBookIdPairs: BookIdsPair[], page: number, isEveryBookChecked: boolean) =>
    dispatch(Actions.deleteMySelectRequest({ deleteBookIdPairs, page, isEveryBookChecked })),
  dispatchResetMySelectPageFetchedStatus: (page: number) =>
    dispatch(Actions.resetMySelectPageFetchedStatus({ page })),
  trackClick: (trackingParams: DefaultTrackingParams) => dispatch(TrackingActions.trackClick({ trackingParams })),
});

export const ConnectedMySelect = connect(mapStateToProps, mapDispatchToProps)(MySelect);
