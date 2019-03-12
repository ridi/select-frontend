import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps, RouteComponentProps, withRouter } from 'react-router-dom';

import { Button, CheckBox, Empty } from '@ridi/rsg';
import { ConnectedPageHeader } from 'app/components';
import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { Pagination } from 'app/components/Pagination';
import { FetchStatusFlag } from 'app/constants';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { MySelectBook } from 'app/services/mySelect';
import { getPageQuery } from 'app/services/routing/selectors';
import { Actions, MySelectHistroyState } from 'app/services/user';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';

interface StateProps {
  mySelectHistory: MySelectHistroyState;
  page: number;
}

type Props = StateProps & ReturnType<typeof mapDispatchToProps>;

interface State {
  inputs: {
    [mySelectBookId: number]: boolean;
  };
}

class MySelectHistory extends React.Component<Props, State> {
  public state: State = {
    inputs: {},
  };
  private handleDeleteButtonClick = () => {
    const { inputs } = this.state;
    const { page } = this.props;
    const { deletionFetchingStatus, itemListByPage } = this.props.mySelectHistory;
    const selectedCurrentPageUbhIds = itemListByPage[page].itemList
      .filter((book) => inputs[book.mySelectBookId])
      .map((book) => book.mySelectBookId);
    if (
      selectedCurrentPageUbhIds.length === 0 ||
      deletionFetchingStatus === FetchStatusFlag.FETCHING
    ) {
      toast.failureMessage('삭제할 책을 선택해주세요.');
      return;
    }
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }
    this.props.dispatchDeleteMySelectHistoryRequest(selectedCurrentPageUbhIds, page);
  }
  private areEveryBookChecked = (page: number): boolean => {
    const { mySelectHistory } = this.props;
    if (
      !mySelectHistory.itemListByPage[page] ||
      mySelectHistory.itemListByPage[page].fetchStatus !== FetchStatusFlag.IDLE
    ) {
      return false;
    }
    const itemList = mySelectHistory.itemListByPage[page].itemList;
    return itemList.every((book) => this.state.inputs[book.mySelectBookId]);
  }
  private handleIndividualCheckBoxClick = (book: MySelectBook) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({
      ...this.state,
      inputs: {
        ...this.state.inputs,
        [book.mySelectBookId]: e.target.checked,
      },
    });
  }
  private handleSelectAllCheckBoxClick = () => {
    const { page } = this.props;
    this.setState({
      inputs: this.props.mySelectHistory.itemListByPage[page].itemList.reduce((prev, book) => {
        return {
          ...prev,
          [book.mySelectBookId]: !this.areEveryBookChecked(page),
        };
      }, {}),
    });
  }

  public componentDidMount() {
    this.props.dispatchLoadMySelectHistoryRequest(this.props.page);
  }
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.page !== this.props.page) {
      this.setState({ inputs: {} });
      this.props.dispatchLoadMySelectHistoryRequest(this.props.page);
    }
  }
  public renderBooks(books: MySelectBook[]) {
    return (
      <ul className="MySelectHistoryBookList">
        {books.map((book) => (
          <li
            className="MySelectHistoryBookList_Item MySelectHistoryBookList_Item-no-bottom-pad"
            key={book.mySelectBookId}
          >
            <CheckBox
              className="MySelectHistoryBookList_CheckBox"
              checked={this.state.inputs[book.mySelectBookId] || false}
              onChange={this.handleIndividualCheckBoxClick(book)}
            />
            <div className="MySelectHistoryBookList_Book">
              <MediaQuery maxWidth={840}>
                <DTOBookThumbnail
                  book={book}
                  width={50}
                  linkUrl={`/book/${book.id}`}
                  linkType="Link"
                  imageClassName="MySelectHistoryBookList_Thumbnail"
                  linkWrapperClassName="MySelectHistoryBookList_Link"
                />
              </MediaQuery>
              <MediaQuery minWidth={841}>
                <DTOBookThumbnail
                  book={book}
                  width={80}
                  linkUrl={`/book/${book.id}`}
                  linkType="Link"
                  imageClassName="MySelectHistoryBookList_Thumbnail"
                  linkWrapperClassName="MySelectHistoryBookList_Link"
                />
              </MediaQuery>
              <Link to={`/book/${book.id}`} className="MySelectHistoryBookList_Link">
                <div className="MySelectHistoryBookList_Meta">
                  <span className="MySelectHistoryBookList_RegisteredDate">
                    {buildOnlyDateFormat(book.startDate)}
                  </span>
                  <h3 className="MySelectHistoryBookList_Title">{book.title.main}</h3>
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  public render() {
    const { mySelectHistory, page } = this.props;
    const { itemListByPage } = this.props.mySelectHistory;
    const noHistory =
      itemListByPage[page] &&
      itemListByPage[page].fetchStatus === FetchStatusFlag.IDLE &&
      itemListByPage[page].itemList.length === 0;

    return (
      <main className="SceneWrapper">
        <Helmet title="도서 이용 내역 - 리디셀렉트" />
        <ConnectedPageHeader pageTitle="도서 이용 내역" />
        {(itemListByPage[page] && itemListByPage[page].fetchStatus === FetchStatusFlag.FETCHING) ? (
          <div className="PageMySelectHistory Skeleton_Wrapper">
            <LandscapeBookListSkeleton
              hasCheckbox={true}
            />
          </div>
        ) : (
          <div className="PageMySelect">
            {noHistory ? (
              <Empty description="도서 이용 내역이 없습니다." iconName="book_1" />
            ) : (
              <div className="ListWithPaginationPage">
                <h2 className="a11y">{page} 페이지</h2>
                <div className="MySelectControls">
                  <div className="MySelectControls_CheckBoxWrapper">
                    <CheckBox
                      className="MySelectControls_CheckBox"
                      checked={this.areEveryBookChecked(page)}
                      onChange={this.handleSelectAllCheckBoxClick}
                    >
                      전체 선택
                    </CheckBox>
                  </div>
                  <Button
                    onClick={this.handleDeleteButtonClick}
                    className="MySelectControls_Button"
                    outline={true}
                    spinner={mySelectHistory.deletionFetchingStatus === FetchStatusFlag.FETCHING}
                  >
                    선택 삭제
                  </Button>
                </div>
                {mySelectHistory.itemListByPage[page] &&
                  this.renderBooks(mySelectHistory.itemListByPage[page].itemList)}
                {!!mySelectHistory.itemCount && (
                  <Pagination
                    currentPage={page}
                    item={{
                      el: Link,
                      getProps: (p) => ({ to: `/my-select-history?page=${p}` } as LinkProps),
                    }}
                    isMobile={true}
                    totalPages={Math.ceil(mySelectHistory.itemCount / 10)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): StateProps => {
  return {
    mySelectHistory: state.user.mySelectHistory,
    page: getPageQuery(state),
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchClearMySelectHistory: () =>
    dispatch(Actions.clearMySelectHistory()),
  dispatchLoadMySelectHistoryRequest: (page: number) =>
    dispatch(Actions.loadMySelectHistoryRequest({ page })),
  dispatchDeleteMySelectHistoryRequest: (mySelectBookIds: number[], page: number) =>
    dispatch(Actions.deleteMySelectHistoryRequest({ mySelectBookIds, page })),
});

export const ConnectedMySelectHistory = connect(mapStateToProps, mapDispatchToProps)(MySelectHistory);
