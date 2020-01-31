import classNames from 'classnames';
import React from 'react';
import { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';

import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { ConnectedBookDetailContentPanels } from 'app/components/BookDetail/ContentPanels';
import { ConnectedBookDetailHeader } from 'app/components/BookDetail/Header';
import { ConnectedBookDetailMetaContents } from 'app/components/BookDetail/MetaContents';
import { ConnectBookDetailMovieTrailer } from 'app/components/BookDetail/MovieTrailer';
import { ConnectBookDetailNoticeList } from 'app/components/BookDetail/NoticeList';
import { BookDetailPanelWrapper } from 'app/components/BookDetail/Panel';
import { FetchStatusFlag, MAX_WIDTH } from 'app/constants';
import { BookDetailPlaceholder } from 'app/placeholder/BookDetailPlaceholder';
import {
  Actions as BookActions,
  Book,
  BookOwnershipStatus,
  BookTitle,
} from 'app/services/book';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { EnvironmentState } from 'app/services/environment';
import { Actions as MySelectActions } from 'app/services/mySelect';
import { RidiSelectState } from 'app/store';
import { BookId } from 'app/types';

interface BookDetailStateProps {
  bookId: BookId;
  fetchStatus: FetchStatusFlag;
  isLoggedIn: boolean;
  title?: BookTitle;
  bookEndDateTime: string;
  bookToBookRecommendationFetchStatus: FetchStatusFlag;
  recommendedBooks?: Book[];
  env: EnvironmentState;
  solidBackgroundColorRGBString: string;
  ownershipStatus?: BookOwnershipStatus;
  ownershipFetchStatus?: FetchStatusFlag;
}

type RouteProps = RouteComponentProps<{ bookId: string; }>;

type OwnProps = RouteProps & {};

type Props = ReturnType<typeof mapDispatchToProps> & BookDetailStateProps & OwnProps;

export class BookDetail extends React.Component<Props> {
  private fetchBookDetailPageData = (props: Props) => {
    if (props.fetchStatus !== FetchStatusFlag.FETCHING && !props.bookEndDateTime) {
      props.dispatchLoadBookRequest(props.bookId);
    }
  }

  private fetchBookDetailAdditionalData = (props: Props) => {
    if (props.fetchStatus !== FetchStatusFlag.IDLE || !props.bookEndDateTime) {
      return;
    }
    if (props.isLoggedIn && props.ownershipFetchStatus !== FetchStatusFlag.FETCHING && !props.ownershipStatus) {
      props.dispatchLoadBookOwnershipRequest(props.bookId);
    }
    if (props.bookToBookRecommendationFetchStatus !== FetchStatusFlag.FETCHING && !props.recommendedBooks) {
      props.dispatchLoadBookToBookRecommendation(props.bookId);
    }
  }

  public componentDidMount() {
    this.fetchBookDetailPageData(this.props);
    requestAnimationFrame(forceCheck);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.bookId !== prevProps.bookId) {
      this.fetchBookDetailPageData(this.props);
    } else {
      this.fetchBookDetailAdditionalData(this.props);
    }
  }

  public render() {
    const {
      bookId,
      title,
      env,
      solidBackgroundColorRGBString,
    } = this.props;

    if (!title || !title.main) {
      return <BookDetailPlaceholder />;
    }
    return (
      <MediaQuery maxWidth={MAX_WIDTH}>
        {(isMobile) => (
          <main
            className={classNames(
              'SceneWrapper',
              'PageBookDetail',
            )}
          >
            <HelmetWithTitle
              titleName={title && title.main ? title.main : null}
              meta={[{
                name: 'theme-color',
                content: solidBackgroundColorRGBString,
              }]}
            />
            {env.platform.isRidibooks && <ConnectedPageHeader pageTitle={title.main} />}
            <ConnectedBookDetailHeader bookId={bookId}>
              {!isMobile && (
                <ConnectedBookDetailMetaContents bookId={bookId} isMobile={false} />
              )}
            </ConnectedBookDetailHeader>
            <BookDetailPanelWrapper renderCondition={isMobile}>
              {isMobile ? (
                <>
                  <ConnectedBookDetailMetaContents bookId={bookId} isMobile={isMobile} />
                  <ConnectBookDetailNoticeList bookId={bookId} isMobile={isMobile} />
                  <ConnectBookDetailMovieTrailer bookId={bookId} isMobile={isMobile} />
                </>
              ) : (
                <ConnectBookDetailNoticeList bookId={bookId} isMobile={isMobile} />
              )}
            </BookDetailPanelWrapper>
            {!isMobile && <ConnectBookDetailMovieTrailer bookId={bookId} isMobile={isMobile} />}
            <ConnectedBookDetailContentPanels bookId={bookId} isMobile={isMobile} />
          </main>
        )}
      </MediaQuery>
    );
  }
}

const mapStateToProps = (state: RidiSelectState, ownProps: OwnProps): BookDetailStateProps => {
  const bookId = Number(ownProps.match.params.bookId);
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const book = stateExists ? bookState.book : undefined;
  const bookDetail = stateExists ? bookState.bookDetail : undefined;
  const fetchStatus = stateExists ? bookState.detailFetchStatus : FetchStatusFlag.IDLE;

  return {
    bookId,
    fetchStatus,
    isLoggedIn: state.user.isLoggedIn,
    ownershipStatus: stateExists ? bookState.ownershipStatus : undefined,
    ownershipFetchStatus: stateExists ? bookState.ownershipFetchStatus : undefined,
    bookEndDateTime: !!bookDetail ? bookDetail.endDatetime : '',
    env: state.environment,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    bookToBookRecommendationFetchStatus: !!bookDetail ? bookState.bookToBookRecommendationFetchStatus : FetchStatusFlag.IDLE,
    recommendedBooks: !!bookDetail && bookState.recommendedBooks ? bookState.recommendedBooks : undefined,
    // Data that can be pre-fetched in home
    title: !!bookDetail ? bookDetail.title : !!book ? book.title : undefined,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchLoadBookRequest: (bookId: number) => dispatch(BookActions.loadBookDetailRequest({ bookId })),
  dispatchLoadBookToBookRecommendation: (bookId: number) => dispatch(BookActions.loadBookToBookRecommendationRequest({ bookId })),
  dispatchLoadBookOwnershipRequest: (bookId: number) =>
    dispatch(BookActions.loadBookOwnershipRequest({ bookId })),
  dispatchAddMySelect: (bookId: BookId) => dispatch(MySelectActions.addMySelectRequest({ bookId })),
});

export const ConnectedBookDetail = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookDetail),
);
