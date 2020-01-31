import React from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';

import { BookDetailPanel, BookDetailPanelWrapper } from 'app/components/BookDetail/Panel';
import { Book } from 'app/services/book';
import { BookDetailResponse } from 'app/services/book/requests';
import { EnvironmentState } from 'app/services/environment';
import { selectIsInApp } from 'app/services/environment/selectors';
import { ConnectedReviews } from 'app/services/review';
import { RidiSelectState } from 'app/store';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';
import { moveToLogin } from 'app/utils/utils';
import { ExpandableBookList } from '../ExpandableBookList';

interface BookDetailContentPanelsProps {
  bookId: number;
  isMobile: boolean;
}

interface BookDetailContentPanelsStateProps {
  env: EnvironmentState;
  isInApp: boolean;
  isLoggedIn: boolean;
  bookDetail?: BookDetailResponse;
  seriesBookList?: Book[];
  recommendedBooks?: Book[];
}

type Props = BookDetailContentPanelsProps & BookDetailContentPanelsStateProps;

const BookDetailContentPanels: React.FunctionComponent<Props> = (props) => {
  const {
    env,
    isLoggedIn,
    isInApp,
    isMobile,
    bookId,
    bookDetail,
    seriesBookList,
    recommendedBooks,
  } = props;
  const {
    introImageUrl,
    introduction,
    publisherReview,
    authorIntroduction,
    tableOfContents,
    publishingDate,
  } = bookDetail ? bookDetail : {};

  return (
    <>
      <BookDetailPanel
        title="책 소개"
        imageUrl={introImageUrl}
        isMobile={isMobile}
        useSkeleton={true}
      >
        {introduction}
      </BookDetailPanel>
      <ExpandableBookList
        books={seriesBookList}
        className="PageBookDetail_Panel"
        listTitle="이 책의 시리즈"
        pageTitleForTracking="book-detail"
        uiPartTitleForTracking="series-list"
      />
      <BookDetailPanel title="출판사 서평" isMobile={isMobile}>
        {publisherReview}
      </BookDetailPanel>
      <BookDetailPanel title="저자 소개" isMobile={isMobile}>
        {authorIntroduction}
      </BookDetailPanel>
      <BookDetailPanel title="목차" isMobile={isMobile}>
        {tableOfContents}
      </BookDetailPanel>
      <BookDetailPanel title="출간일" useTruncate={false}>
        {publishingDate && (publishingDate.ebookPublishDate || publishingDate.paperBookPublishDate) && (
          publishingDate.ebookPublishDate === publishingDate.paperBookPublishDate
            ? `${buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책, 종이책 동시 출간` : (
              <>
                {publishingDate.ebookPublishDate && <>{buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책 출간<br /></>}
                {publishingDate.paperBookPublishDate && `${buildOnlyDateFormat(publishingDate.paperBookPublishDate)} 종이책 출간`}
              </>
            )
        )}
      </BookDetailPanel>
      <ExpandableBookList
        books={recommendedBooks}
        className="PageBookDetail_Panel"
        listTitle="'마이 셀렉트'에 함께 추가된 책"
        pageTitleForTracking="book-detail"
        uiPartTitleForTracking="book-to-book-recommendation"
      />
      <BookDetailPanelWrapper className="Reviews_Wrapper">
        <LazyLoad height={200} once={true} offset={400}>
          <ConnectedReviews
            bookId={bookId}
            checkAuth={() => {
              if (isLoggedIn) {
                return true;
              }
              if (isInApp && !env.platform.appVersion) {
                // TODO: 안드로이드 인앱에서 postRobot을 지원하기 전까지는 Toast 메세지를 띄우는 처리.
                toast.info('로그인 후 이용할 수 있습니다.');
              } else if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                moveToLogin();
              }
              return false;
            }}
          />
        </LazyLoad>
      </BookDetailPanelWrapper>
    </>
  );
};

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailContentPanelsProps): BookDetailContentPanelsStateProps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const bookDetail = stateExists ? bookState.bookDetail : undefined;

  return {
    isLoggedIn: state.user.isLoggedIn,
    isInApp: selectIsInApp(state),
    bookDetail,
    env: state.environment,
    seriesBookList: !!bookDetail ? bookDetail.seriesBooks : undefined,
    recommendedBooks: !!bookDetail && bookState.recommendedBooks ? bookState.recommendedBooks : undefined,
  };
};

export const ConnectedBookDetailContentPanels = connect(mapStateToProps, null)(BookDetailContentPanels);
