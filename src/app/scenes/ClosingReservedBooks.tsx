import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Empty } from '@ridi/rsg';

import {
  ConnectedGridBookList,
  ConnectedPageHeader,
  HelmetWithTitle,
  Pagination,
} from 'app/components';
import { Tab, Tabs } from 'app/components/Tabs';
import { MAX_WIDTH, PageTitleText, RoutePaths } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Actions, ClosingReservedBooksState } from 'app/services/closingReservedBooks';
import { closingReservedTermType } from 'app/services/closingReservedBooks/requests';
import { getClosingReservedBooksTermQuery, getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';

import { Notice } from 'app/components/Notice';
import history from 'app/config/history';

interface State {
  isInitialized: boolean;
}

interface ClosingReservedBooksStateProps {
  closingReservedBooks: ClosingReservedBooksState;
  currentTerm: closingReservedTermType;
  page: number;
}
interface ClosingReservedBookDispatchProps {
  dispatchLoadClosingReservedBooks: (
    termType: closingReservedTermType,
    page: number,
  ) => ReturnType<typeof Actions.loadClosingReservedBooksRequest>;
}

type OwnProps = RouteComponentProps<{}>;
type Props = ClosingReservedBooksStateProps & ClosingReservedBookDispatchProps & OwnProps;

export class ClosingReservedBooks extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;

  public state: State = {
    isInitialized: false,
  };

  private isFetched = (renderedTerm: closingReservedTermType, page: number) => {
    const { closingReservedBooks } = this.props;

    const currentTermsBooks = closingReservedBooks[renderedTerm];
    return (
      currentTermsBooks &&
      currentTermsBooks.itemListByPage[page] &&
      currentTermsBooks.itemListByPage[page].isFetched
    );
  };

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const { dispatchLoadClosingReservedBooks, page, currentTerm } = this.props;
      if (!this.isFetched(currentTerm, page)) {
        dispatchLoadClosingReservedBooks(currentTerm, page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page || nextProps.currentTerm !== this.props.currentTerm) {
      const { dispatchLoadClosingReservedBooks, page, currentTerm } = nextProps;

      if (!this.isFetched(currentTerm, page)) {
        dispatchLoadClosingReservedBooks(currentTerm, page);
      }
    }

    return true;
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public renderTermText(term: closingReservedTermType) {
    const currentDateObj = new Date();
    const currentMonth = currentDateObj.getMonth();
    let displayYear = currentDateObj.getFullYear();
    let displayMonth = term === 'thisMonth' ? currentMonth + 1 : currentMonth + 2;
    if (displayMonth > 12) {
      displayYear += 1;
      displayMonth -= 12;
    }
    return `${displayYear}년 ${displayMonth}월`;
  }

  public render() {
    const { page, closingReservedBooks, currentTerm } = this.props;
    const { isInitialized } = this.state;
    const { itemCount, itemListByPage } = closingReservedBooks[currentTerm];
    const itemCountPerPage = 24;
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.CLOSING_RESERVED_BOOKS} />
        <ConnectedPageHeader pageTitle={PageTitleText.CLOSING_RESERVED_BOOKS} />
        <Tabs className="ClosingReservedBooks_Tabs">
          <Tab
            className="ClosingReservedBooks_Tab"
            to={`${RoutePaths.CLOSING_RESERVED_BOOKS}?termType=thisMonth`}
            active={currentTerm === 'thisMonth'}
            component={Link}
          >
            {this.renderTermText('thisMonth')}
          </Tab>
          <Tab
            className="ClosingReservedBooks_Tab"
            to={`${RoutePaths.CLOSING_RESERVED_BOOKS}?termType=nextMonth`}
            active={currentTerm === 'nextMonth'}
            component={Link}
          >
            {this.renderTermText('nextMonth')}
          </Tab>
        </Tabs>
        {!this.isFetched(currentTerm, page) || isNaN(page) ? (
          <GridBookListSkeleton />
        ) : (
          <>
            {!itemCount || itemCount === 0 ? (
              <Empty
                className="ClosingReservedBooks_Empty"
                description="종료 예정 도서가 없습니다."
                iconName="book_1"
              />
            ) : (
              <>
                <div className="ClosingReservedBooks_NoticeWrapper">
                  <Notice mainText="각 도서의 서비스 종료 일정은 변경될 수 있습니다." />
                </div>
                <ConnectedGridBookList
                  serviceTitleForTracking="select-book"
                  pageTitleForTracking="closing-reserved"
                  uiPartTitleForTracking="book-list"
                  miscTracking={JSON.stringify({ sect_page: page })}
                  books={itemListByPage[page].itemList}
                />
                <MediaQuery maxWidth={MAX_WIDTH}>
                  {isMobile => (
                    <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(itemCount / itemCountPerPage)}
                      isMobile={isMobile}
                      item={{
                        el: Link,
                        getProps: (p): LinkProps => ({
                          to: `${RoutePaths.CLOSING_RESERVED_BOOKS}?termType=${currentTerm}&page=${p}`,
                        }),
                      }}
                    />
                  )}
                </MediaQuery>
              </>
            )}
          </>
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): ClosingReservedBooksStateProps => ({
  closingReservedBooks: rootState.closingReservedBooks,
  currentTerm: getClosingReservedBooksTermQuery(rootState),
  page: getPageQuery(rootState),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLoadClosingReservedBooks: (termType: closingReservedTermType, page: number) =>
    dispatch(Actions.loadClosingReservedBooksRequest({ termType, page })),
});

export const ConnectedClosingReservedBooks = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClosingReservedBooks),
);
