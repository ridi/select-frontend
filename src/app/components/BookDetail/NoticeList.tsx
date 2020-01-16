import { isWithinInterval } from 'date-fns';
import * as React from 'react';
import { connect } from 'react-redux';

import { NoticeResponse } from 'app/services/book/requests';
import { getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { isInNotAvailableConvertList } from 'app/utils/expiredDate';
import { buildKoreanDayDateFormat } from 'app/utils/formatDate';

import { BookDetailPanelWrapper } from 'app/components/BookDetail/Panel';
import { Notice } from 'app/components/Notice';

interface BookDetailNoticeListProps {
  bookId: number;
  isMobile?: boolean;
}

interface BookDetailNoticeListStateProps {
  isInApp: boolean;
  isIosInApp: boolean;
  bookEndDateTime: string;
  noticeList?: NoticeResponse[];
}

type Props = BookDetailNoticeListProps & BookDetailNoticeListStateProps;

const BookDetailNoticeList: React.FunctionComponent<Props> = (props) => {
  const {
    isMobile = false,
    isInApp,
    isIosInApp,
    noticeList,
    bookEndDateTime,
  } = props;

  const noticeContents = isIosInApp && noticeList ? noticeList.map(({ id, content }) => 
    ({ id, content: content.replace(/<a(\s[^>]*)?>.*?<\/a>/ig, '') })
  ) : noticeList;

  return (
    <>
      <BookDetailPanelWrapper className="PageBookDetail_Panel-notice" renderCondition={!isMobile}>
        {noticeList && noticeList.length > 0 && (
          <>
            <h2 className="a11y">도서 운영 정보</h2>
            <ul className="PageBookDetail_NoticeList">
              {noticeContents && noticeContents.map(({id, content}) => (
                <li className="PageBookDetail_NoticeItem" key={id}>
                  <p
                    className="PageBookDetail_NoticeParagraph"
                    dangerouslySetInnerHTML={{ __html: content.split('\n').join('<br />') }}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </BookDetailPanelWrapper>
      <BookDetailPanelWrapper className="PageBookDetail_Panel-notice" renderCondition={!isMobile}>
        {isInNotAvailableConvertList(bookEndDateTime) && (
          <Notice
            isInApp={isInApp}
            mainText={`이 책은 출판사 또는 저작권자와의 계약 만료로 <strong>${buildKoreanDayDateFormat(bookEndDateTime)}</strong>까지 마이 셀렉트에 추가할 수 있습니다.`}
            detailLink={!isIosInApp ? 'https://help.ridibooks.com/hc/ko/articles/360022565173' : undefined}
          />
        )}
      </BookDetailPanelWrapper>
    </>
  );
};

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailNoticeListProps): BookDetailNoticeListStateProps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const bookDetail = stateExists ? bookState.bookDetail : undefined;
  return {
    isInApp: selectIsInApp(state),
    isIosInApp: getIsIosInApp(state),
    bookEndDateTime: !!bookDetail ? bookDetail.endDatetime : '',
    noticeList: !!bookDetail && !!bookDetail.notices && Array.isArray(bookDetail.notices) ?
      bookDetail.notices.filter((notice) =>
        notice.isVisible && isWithinInterval(new Date(), { start: new Date(notice.beginDatetime), end: new Date(notice.endDatetime) }),
      ) : undefined,
  };
};

export const ConnectBookDetailNoticeList = connect(mapStateToProps, null)(BookDetailNoticeList);
