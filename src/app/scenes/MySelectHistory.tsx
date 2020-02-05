import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

import { Button, CheckBox, Empty } from '@ridi/rsg';

import { ConnectedPageHeader, DTOBookThumbnail, HelmetWithTitle, Pagination } from 'app/components';
import { FetchStatusFlag, MAX_WIDTH, PageTitleText } from 'app/constants';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

import { ExpireRemaningTime } from 'app/components/ExpireRemainingTime';
import { Actions as CommonUIActions } from 'app/services/commonUI';
import { MySelectBook } from 'app/services/mySelect';
import { getPageQuery } from 'app/services/routing/selectors';
import { Actions, MySelectHistroyState } from 'app/services/user';
import { RidiSelectState } from 'app/store';
import { getNotAvailableConvertDateDiff } from 'app/utils/expiredDate';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';
import classNames from 'classnames';

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
      .filter(book => inputs[book.mySelectBookId])
      .map(book => book.mySelectBookId);
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
  };

  private areEveryBookChecked = (page: number): boolean => {
    const { mySelectHistory } = this.props;
    if (
      !mySelectHistory.itemListByPage[page] ||
      mySelectHistory.itemListByPage[page].fetchStatus !== FetchStatusFlag.IDLE
    ) {
      return false;
    }
    const { itemList } = mySelectHistory.itemListByPage[page];
    return itemList.every(book => this.state.inputs[book.mySelectBookId]);
  };

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
  };

  private handleSelectAllCheckBoxClick = () => {
    const { page } = this.props;
    this.setState({
      inputs: this.props.mySelectHistory.itemListByPage[page].itemList.reduce(
        (prev, book) => ({
          ...prev,
          [book.mySelectBookId]: !this.areEveryBookChecked(page),
        }),
        {},
      ),
    });
  };

  private isFetched = () => {
    const { page } = this.props;
    const { itemListByPage } = this.props.mySelectHistory;
    return itemListByPage[page] && itemListByPage[page].isFetched;
  };

  public componentDidMount() {
    this.props.dispatchLoadMySelectHistoryRequest(this.props.page);
    this.props.dispatchUpdateGNBTabExpose(false);
  }

  public componentWillUnmount() {
    this.props.dispatchUpdateGNBTabExpose(true);
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
        {books.map(book => (
          <li
            className="MySelectHistoryBookList_Item MySelectHistoryBookList_Item-no-bottom-pad"
            key={book.mySelectBookId}
          >
            <CheckBox
              className="MySelectHistoryBookList_CheckBox"
              checked={this.state.inputs[book.mySelectBookId] || false}
              onChange={this.handleIndividualCheckBoxClick(book)}
            />
            <div
              className={classNames(
                'MySelectHistoryBookList_Book',
                getNotAvailableConvertDateDiff(book.endDatetime) < 0 ? 'not_available' : null,
              )}
            >
              <MediaQuery maxWidth={MAX_WIDTH}>
                {isMobile => (
                  <DTOBookThumbnail
                    book={book}
                    width={isMobile ? 50 : 80}
                    linkUrl={`/book/${book.id}`}
                    linkType="Link"
                    imageClassName="MySelectHistoryBookList_Thumbnail"
                    linkWrapperClassName="MySelectHistoryBookList_Link"
                    expired={getNotAvailableConvertDateDiff(book.endDatetime) < 0}
                  />
                )}
              </MediaQuery>
              <Link to={`/book/${book.id}`} className="MySelectHistoryBookList_Link">
                <div className="MySelectHistoryBookList_Meta">
                  <span className="MySelectHistoryBookList_RegisteredDate">
                    {buildOnlyDateFormat(book.startDate)}
                  </span>
                  <h3 className="MySelectHistoryBookList_Title">{book.title.main}</h3>
                  {getNotAvailableConvertDateDiff(book.endDatetime) < 0 && (
                    <ExpireRemaningTime expireDate={book.endDatetime} />
                  )}
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
        <HelmetWithTitle titleName={PageTitleText.MY_SELECT_HISTORY} />
        <ConnectedPageHeader pageTitle={PageTitleText.MY_SELECT_HISTORY} />
        {!this.isFetched() ? (
          <div className="PageMySelectHistory Skeleton_Wrapper">
            <LandscapeBookListSkeleton hasCheckbox />
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
                    outline
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
                      getProps: p => ({ to: `/my-select-history?page=${p}` } as LinkProps),
                    }}
                    isMobile
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

const mapStateToProps = (state: RidiSelectState): StateProps => ({
  mySelectHistory: state.user.mySelectHistory,
  page: getPageQuery(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchClearMySelectHistory: () => dispatch(Actions.clearMySelectHistory()),
  dispatchLoadMySelectHistoryRequest: (page: number) =>
    dispatch(Actions.loadMySelectHistoryRequest({ page })),
  dispatchDeleteMySelectHistoryRequest: (mySelectBookIds: number[], page: number) =>
    dispatch(Actions.deleteMySelectHistoryRequest({ mySelectBookIds, page })),
  dispatchResetMySelectHistoryFetchedStatus: () =>
    dispatch(Actions.resetMySelectHistoryFetchedStatus()),
  dispatchUpdateGNBTabExpose: (isGnbTab: boolean) =>
    dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab })),
});

export const ConnectedMySelectHistory = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MySelectHistory);
