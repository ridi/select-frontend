
// 외부 라이브러리
import * as classNames from 'classnames';
import * as isWithinRange from 'date-fns/is_within_range';
import * as qs from 'qs';

// 리액트 관련 라이브러리
import * as React from 'react';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';

// tslint:disable-next-line
const Vibrant = require('node-vibrant');
import { Palette as VibrantPalette } from 'node-vibrant/lib/color';

import { Button, Icon } from '@ridi/rsg';

// Component, Constants, Placeholder
import { ConnectedInlineHorizontalBookList, ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { FetchStatusFlag } from 'app/constants';
import { BookDetailPlaceholder } from 'app/placeholder/BookDetailPlaceholder';

// Book Services
import {
  Actions as BookActions, Book, BookAuthors,
  BookOwnershipStatus, BookReviewSummary, BookThumbnailUrlMap,
  BookTitle,
} from 'app/services/book';
import { BookDetailSectionPlaceholder, Expander, TextTruncate } from 'app/services/book/components';
import { BookDetailPublishingDate, BookFile, NoticeResponse, Publisher } from 'app/services/book/requests';

// Category Services
import { Category } from 'app/services/category';
// CommonUI
import { Actions as CommonUIActions, GNB_DEFAULT_COLOR, GNBColorLevel, RGB } from 'app/services/commonUI';
import {
  getBackgroundColorGradientToLeft,
  getBackgroundColorGradientToRight,
  getSolidBackgroundColorRGBString,
  getTransparentBackgroundColorRGBString,
} from 'app/services/commonUI/selectors';

// Environment Services
import { EnvironmentState } from 'app/services/environment';
import { getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import { Actions as MySelectActions, MySelectState } from 'app/services/mySelect';

// Review Services
import { ConnectedReviews } from 'app/services/review';

import { RidiSelectState } from 'app/store';
import { BookId, TextWithLF } from 'app/types';

// Utils
import { BookDetailHeader } from 'app/components/BookDetail/BookDetailHeader';
import { BookDetailNotice } from 'app/components/BookDetail/BookDetailNotice';
import { BookDetailOverlay } from 'app/components/BookDetail/BookDetailOverlay';
import { BookDetailAuthor, BookDetailCategory, BookDetailDownload,
  BookDetailFile, BookDetailPublisher, BookDetailRating,
  BookDetailTitle } from 'app/components/BookDetail/Meta';
import {
  buildOnlyDateFormat, downloadBooksInRidiselect,
  readBooksInRidiselect, withThumbnailQuery,
} from 'app/utils';

interface BookDetailStateProps {
  bookId: BookId;
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
  fetchStatus: FetchStatusFlag;
  isFetched: boolean;
  isLoggedIn: boolean;
  isIosInApp: boolean;
  isInApp: boolean;

  title?: BookTitle;
  authors?: BookAuthors;
  reviewSummary?: BookReviewSummary;
  thumbnail?: BookThumbnailUrlMap;

  previewAvailable: boolean;
  hasPreview: boolean;
  previewBId: BookId;

  categories?: Category[][];
  file?: BookFile;
  seriesBookList?: Book[];
  publisherReview?: TextWithLF;
  authorIntroduction?: TextWithLF;
  introduction?: TextWithLF;
  introImageUrl?: string;
  introVideoUrl?: string;
  tableOfContents?: TextWithLF;
  noticeList?: NoticeResponse[];
  publisher?: Publisher;
  publishingDate?: BookDetailPublishingDate;
  dominantColor?: RGB;

  mySelect: MySelectState;
  env: EnvironmentState;
  gnbColorLevel: GNBColorLevel;
  solidBackgroundColorRGBString: string;
  transparentBackgroundColorRGBString: string;
  backgroundColorGradientToRight: string;
  backgroundColorGradientToLeft: string;

  ownershipFetchStatus?: FetchStatusFlag;
  ownershipStatus?: BookOwnershipStatus;
}

type RouteProps = RouteComponentProps<{
  bookId: string;
}>;

type OwnProps = RouteProps & {};

type Props = ReturnType<typeof mapDispatchToProps> & BookDetailStateProps & OwnProps;

interface State {
  thumbnailExapnded: boolean;
  seriesListExpanded: boolean;
}

export class BookDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.checkAuth = this.checkAuth.bind(this);
  }

  public state = {
    thumbnailExapnded: false,
    seriesListExpanded: false,
  };

  // Saga에서 업데이트 하는게 나을것 같음..
  private updateDominantColor = (props: Props) => {
    const {
      dominantColor,
      thumbnail,
      dispatchUpdateDominantColor,
      dispatchUpdateGNBColor,
      bookId,
    } = props;

    if (dominantColor && dominantColor.r && dominantColor.g && dominantColor.b) {
      dispatchUpdateGNBColor(dominantColor);
      return;
    }

    if (thumbnail) {
      try {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = withThumbnailQuery(thumbnail.large!);
        Vibrant
          .from(image)
          .getPalette()
          .then((palette: VibrantPalette) => {
            const rgb =
              palette.DarkVibrant ||
              palette.Vibrant ||
              palette.LightMuted ||
              GNB_DEFAULT_COLOR;
            dispatchUpdateGNBColor(rgb);
            dispatchUpdateDominantColor(bookId, rgb);
          });
      } catch (e) {
        dispatchUpdateGNBColor(GNB_DEFAULT_COLOR);
      }
    } else {
      dispatchUpdateGNBColor(GNB_DEFAULT_COLOR);
    }
  }

  private handleDownloadButtonClick = () => {
    const { bookId, isInApp } = this.props;
    if (this.shouldDisplaySpinnerOnDownload()) {
      return;
    }
    if (this.canDownload()) {
      if (isInApp) {
        readBooksInRidiselect(bookId);
        return;
      }
      if (!this.currentBookExistsInMySelect() && !confirm('리디북스에서 이미 구매/대여한 책입니다.\n다운로드하시겠습니까?')) {
        return;
      }
      downloadBooksInRidiselect([bookId]);
    } else {
      this.props.dispatchAddMySelect(bookId);
    }
  }

  // state에 넣어놓고 쓰는게 매번 함수 호출보다는 좋을 것 같음
  private canDownload = () =>
    (!!this.props.ownershipStatus && this.props.ownershipStatus.isDownloadAvailable)

  // state에 넣어놓고 쓰는게 매번 함수 호출보다는 좋을 것 같음
  private currentBookExistsInMySelect = () =>
    (!!this.props.ownershipStatus && this.props.ownershipStatus.isCurrentlyUsedRidiSelectBook)

  // 얜 머하는애인가?
  private shouldDisplaySpinnerOnDownload = () =>
    (this.props.isLoggedIn && !this.props.ownershipStatus) ||
    this.props.ownershipFetchStatus === FetchStatusFlag.FETCHING ||
    this.props.mySelect.additionFetchStatus === FetchStatusFlag.FETCHING

  // 북 상세페이지 데이터 request
  private fetchBookDetailAndOwnership = (props: Props) => {
    if (!props.isFetched) {
      props.dispatchLoadBookRequest(props.bookId);
    }
    if (!props.ownershipStatus && props.isLoggedIn) {
      props.dispatchLoadBookOwnershipRequest(props.bookId);
    }
  }

  private renderMeta() {
    return (
      <MediaQuery maxWidth={840}>
        {(isMobile) => (
          <div className="PageBookDetail_Meta">
            <BookDetailCategory categories={this.props.categories} />
            <BookDetailTitle title={this.props.title} />
            <p className="PageBookDetail_BookElements">
              <BookDetailAuthor authors={this.props.authors} />
              <BookDetailPublisher publisher={this.props.publisher} />
              <BookDetailFile file={this.props.file} />
            </p>
            <p className="PageBookDetail_RatingSummary">
              <BookDetailRating reviewSummary={this.props.reviewSummary} isMobile={isMobile} gnbColorLevel={this.props.gnbColorLevel} />
            </p>
            <div className="PageBookDetail_DownloadWrapper">
              <BookDetailDownload
                isSubscribing={this.props.isSubscribing}
                isMobile={isMobile}
                hasPreview={this.props.hasPreview}
                previewAvailable={this.props.previewAvailable}
                shouldDisplaySpinnerOnDownload={this.shouldDisplaySpinnerOnDownload()}
                canDownload={this.canDownload()}
                isLoggedIn={this.props.isLoggedIn}
                hasSubscribedBefore={this.props.hasSubscribedBefore}
                env={this.props.env}
              />
            </div>
          </div>
        )}
      </MediaQuery>
    );
  }

  private getVideoSrc = (videoUrl: string): string | null => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const token = videoUrl.match(/[\w-_]{10,}/);
      if (token) {
        return `//www.youtube-nocookie.com/embed/${token[0]}?rel=0`;
      }
    } else if (videoUrl.includes('vimeo')) {
      const token = videoUrl.match(/\d[\w-_]{7,}/);
      if (token) {
        return `//player.vimeo.com/video/${token[0]}?byline=0&amp;portrait=0&amp;badge=0`;
      }
    }
    return null;
  }

  private renderMovieTrailer = (videoUrl: string, isMobile: boolean) => {
    const videoSrc = this.getVideoSrc(videoUrl);
    return videoSrc ? (
      <section
        className={classNames(
          'PageBookDetail_Panel',
          { 'PageBookDetail_Panel-inMeta': isMobile },
        )}
      >
        <h2 className={isMobile ? 'a11y' : 'PageBookDetail_PanelTitle'}>북 트레일러</h2>
        <div className="PageBookDetail_PanelContent PageBookDetail_PanelContent-trailer">
          <iframe
            src={videoSrc}
            width={isMobile ? 300 : 800}
            height={isMobile ? 225 : 450}
            frameBorder="0"
            allowFullScreen={true}
          />
        </div>
      </section>
    ) : null;
  }

  private renderPanelContent = (text: TextWithLF, isMobile: boolean) => {
    return (
      <TextTruncate
        lines={9}
        text={text}
        lineHeight={isMobile ? 23 : 25}
        renderExpander={(({ expand, isExpanded, isTruncated }) => !isTruncated || isExpanded ? null : (
          <div className="BookDetail_ContentTruncWrapper">
            <Expander
              onClick={expand}
              text="계속 읽기"
              isExpanded={false}
            />
          </div>
        ))}
      />
    );
  }

  public componentDidMount() {
    this.fetchBookDetailAndOwnership(this.props);
    this.updateDominantColor(this.props);
    requestAnimationFrame(forceCheck);
  }
  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.bookId !== nextProps.bookId) {
      this.updateDominantColor(nextProps);
      this.fetchBookDetailAndOwnership(nextProps);
    }
    if (
      (!this.props.thumbnail && nextProps.thumbnail) ||
      (!this.props.isFetched && nextProps.isFetched)
    ) {
      this.updateDominantColor(nextProps);
    }
  }
  public componentWillUnmount() {
    this.props.dispatchUpdateGNBColor(GNB_DEFAULT_COLOR);
  }

  public checkAuth() {
    if (this.props.isLoggedIn) {
      return true;
    }
    if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
      window.location.replace(`${ this.props.env.STORE_URL }/account/oauth-authorize?fallback=login&return_url=${window.location.href}`);
    }
    return false;
  }
  public render() {
    const {
      bookId,
      thumbnail,
      tableOfContents,
      authorIntroduction,
      publishingDate,
      noticeList,
      introduction,
      introImageUrl,
      introVideoUrl,
      title,
      publisherReview,
      seriesBookList,
      isFetched,
      env,
      gnbColorLevel,
      solidBackgroundColorRGBString,
      transparentBackgroundColorRGBString,
      backgroundColorGradientToLeft,
      backgroundColorGradientToRight,
    } = this.props;
    const { seriesListExpanded } = this.state;

    if (!title || !title.main) {
      return <BookDetailPlaceholder />;
    }
    return (
      <MediaQuery maxWidth={840}>
        {(isMobile) => (
           <main className="SceneWrapper PageBookDetail">
            <HelmetWithTitle
              titleName={title && title.main ? title.main : null}
              meta={[
                {
                  name: 'theme-color',
                  content: solidBackgroundColorRGBString,
                },
              ]}
            />
            {
              env.platform.isRidibooks &&
              <ConnectedPageHeader pageTitle={title.main} />
            }
            <BookDetailHeader
              solidBackgroundColorRGBString={solidBackgroundColorRGBString}
              transparentBackgroundColorRGBString={transparentBackgroundColorRGBString}
              backgroundColorGradientToLeft={backgroundColorGradientToLeft}
              backgroundColorGradientToRight={backgroundColorGradientToRight}
              gnbColorLevel={gnbColorLevel}
              thumbnail={thumbnail}
              title={title}
              isMobile={isMobile}
              renderMeta={this.renderMeta()}
            />

            {/* PC일때, */}
            {!isMobile &&
              <section className="PageBookDetail_Panel PageBookDetail_Panel-notice">
                <BookDetailNotice noticeList={noticeList} />
              </section>
            }
            {/* Mobile 기기일때, */}
            {isMobile &&
              <section className="PageBookDetail_Panel">
                {this.renderMeta()}
                <BookDetailNotice noticeList={noticeList} />
              </section>
            }
            {introVideoUrl && this.renderMovieTrailer(introVideoUrl, isMobile)}
            {introduction ? (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">책 소개</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(`${introImageUrl ? `<img src="${introImageUrl}" /><br /><br />` : ''}${introduction}`, isMobile)}
                </div>
              </section>
            ) : <BookDetailSectionPlaceholder />}
            {seriesBookList &&
              seriesBookList.length > 0 && (
                <section className="PageBookDetail_Panel">
                  <h2 className="PageBookDetail_PanelTitle">이 책의 시리즈</h2>
                  <div className="PageBookDetail_PanelContent">
                    <ConnectedInlineHorizontalBookList
                      pageTitleForTracking="book-detail"
                      uiPartTitleForTracking="series-list"
                      disableInlineOnPC={seriesListExpanded}
                      books={seriesBookList!}
                      lazyloadThumbnail={false}
                    />
                    {!seriesListExpanded && seriesBookList.length > 6 &&
                      !isMobile && (
                        <div className="BookDetail_ContentTruncWrapper">
                          <Expander
                            onClick={() => {
                              this.setState({ seriesListExpanded: true });
                            }}
                            text="펼쳐 보기"
                            isExpanded={seriesListExpanded}
                          />
                        </div>
                      )}
                  </div>
                </section>
              )}
            {publisherReview && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">출판사 서평</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(publisherReview, isMobile)}
                </div>
              </section>
            )}
            {authorIntroduction && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">저자 소개</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(authorIntroduction, isMobile)}
                </div>
              </section>
            )}
            {tableOfContents && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">목차</h2>
                <div className="PageBookDetail_PanelContent">
                  {this.renderPanelContent(tableOfContents, isMobile)}
                </div>
              </section>
            )}
            {publishingDate && (publishingDate.ebookPublishDate || publishingDate.paperBookPublishDate) && (
              <section className="PageBookDetail_Panel">
                <h2 className="PageBookDetail_PanelTitle">출간일</h2>
                <div className="PageBookDetail_PanelContent">
                  {publishingDate.ebookPublishDate === publishingDate.paperBookPublishDate
                    ? (
                      `${buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책, 종이책 동시 출간`
                    )
                    : <>
                      {publishingDate.ebookPublishDate && <>{buildOnlyDateFormat(publishingDate.ebookPublishDate)} 전자책 출간<br /></>}
                      {publishingDate.paperBookPublishDate && `${buildOnlyDateFormat(publishingDate.paperBookPublishDate)} 종이책 출간`}
                    </>
                  }
                </div>
              </section>
            )}
            <section className="PageBookDetail_Panel Reviews_Wrapper">
              <h2 className="a11y">리뷰</h2>
              <LazyLoad height={200} once={true} offset={400}>
                <ConnectedReviews
                  bookId={bookId}
                  checkAuth={this.checkAuth}
                />
              </LazyLoad>
            </section>
            <BookDetailOverlay
              isFetched={isFetched}
              thumbnail={thumbnail}
              title={title}
              thumbnailExapnded={this.state.thumbnailExapnded}
              closeThumbnailExapnded={() => { this.setState({thumbnailExapnded: false}); }}
            />
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

  return {
    bookId,
    isSubscribing: state.user.isSubscribing,
    isLoggedIn: state.user.isLoggedIn,
    hasSubscribedBefore: state.user.hasSubscribedBefore,
    fetchStatus: FetchStatusFlag.IDLE,
    isFetched: stateExists && bookState.isDetailFetched,
    ownershipStatus: stateExists ? bookState.ownershipStatus : undefined,
    ownershipFetchStatus: stateExists ? bookState.ownershipFetchStatus : undefined,
    dominantColor: stateExists ? bookState.dominantColor : undefined,

    // Data that can be pre-fetched in home
    title: !!bookDetail ? bookDetail.title : !!book ? book.title : undefined,
    authors: !!bookDetail ? bookDetail.authors : !!book ? book.authors : undefined,
    thumbnail: !!bookDetail ? bookDetail.thumbnail : !!book ? book.thumbnail : undefined,
    reviewSummary: !!bookDetail
      ? bookDetail.reviewSummary
      : !!book
        ? book.reviewSummary
        : undefined,
    previewAvailable: !!bookDetail ? bookDetail.previewAvailable : false,
    hasPreview: !!bookDetail ? bookDetail.hasPreview : false,
    previewBId: !!bookDetail ? bookDetail.previewBId : bookId,

    introduction: !!bookDetail ? bookDetail.introduction : undefined,
    introImageUrl: !!bookDetail ? bookDetail.introImageUrl : undefined,
    introVideoUrl: !!bookDetail ? bookDetail.introVideoUrl : undefined,
    categories: !!bookDetail ? bookDetail.categories : undefined,
    authorIntroduction: !!bookDetail ? bookDetail.authorIntroduction : undefined,
    tableOfContents: !!bookDetail ? bookDetail.tableOfContents : undefined,
    seriesBookList: !!bookDetail ? bookDetail.seriesBooks : undefined,
    publisherReview: !!bookDetail ? bookDetail.publisherReview : undefined,
    publisher: !!bookDetail ? bookDetail.publisher : undefined,
    publishingDate: !!bookDetail ? bookDetail.publishingDate : undefined,
    noticeList: !!bookDetail && !!bookDetail.notices && Array.isArray(bookDetail.notices) ?
      bookDetail.notices.filter((notice) =>
        notice.isVisible && isWithinRange(new Date(), notice.beginDatetime, notice.endDatetime),
      ) : undefined,
    file: !!bookDetail ? bookDetail.file : undefined,
    mySelect: state.mySelect,
    env: state.environment,
    gnbColorLevel: state.commonUI.gnbColorLevel,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    transparentBackgroundColorRGBString: getTransparentBackgroundColorRGBString(state),
    backgroundColorGradientToLeft: getBackgroundColorGradientToLeft(state),
    backgroundColorGradientToRight: getBackgroundColorGradientToRight(state),
    isIosInApp: getIsIosInApp(state),
    isInApp: selectIsInApp(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadBookRequest: (bookId: number) => dispatch(BookActions.loadBookDetailRequest({ bookId })),
    dispatchUpdateGNBColor: (color: RGB) => dispatch(CommonUIActions.updateGNBColor({ color })),
    dispatchUpdateDominantColor: (bookId: number, color: RGB) =>
      dispatch(BookActions.updateDominantColor({ bookId, color })),
    dispatchLoadBookOwnershipRequest: (bookId: number) =>
      dispatch(BookActions.loadBookOwnershipRequest({ bookId })),
    dispatchAddMySelect: (bookId: BookId) => dispatch(MySelectActions.addMySelectRequest({ bookId })),
  };
};

export const ConnectedBookDetail = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookDetail),
);
