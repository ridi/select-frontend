import React from 'react';
import { connect } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { FetchStatusFlag } from 'app/constants';
import { BookOwnershipStatus } from 'app/services/book';
import { EnvironmentState } from 'app/services/environment';
import { getIsAndroidInApp, selectIsInApp } from 'app/services/environment/selectors';
import { Actions as MySelectActions, MySelectState } from 'app/services/mySelect';
import { RidiSelectState } from 'app/store';
import { BookId } from 'app/types';
import { downloadBooksInRidiselect, readBooksInRidiselect } from 'app/utils/downloadUserBook';
import { Link } from 'react-router-dom';

interface BookDetailDownloadButtonProps {
  bookId: number;
}

interface BookDetailDownloadButtonStateProps {
  isLoggedIn: boolean;
  hasAvailableTicket: boolean;
  hasSubscribedBefore: boolean;
  env: EnvironmentState;
  isInApp: boolean;
  isAndroidInApp: boolean;
  ownershipFetchStatus?: FetchStatusFlag;
  ownershipStatus?: BookOwnershipStatus;
  mySelect: MySelectState;
}

type Props = ReturnType<typeof mapDispatchToProps> &
  BookDetailDownloadButtonProps &
  BookDetailDownloadButtonStateProps;

const BookDetailDownloadButton: React.FunctionComponent<Props> = props => {
  const {
    bookId,
    isLoggedIn,
    hasAvailableTicket,
    hasSubscribedBefore,
    isInApp,
    ownershipStatus,
    ownershipFetchStatus,
    mySelect,
    dispatchAddMySelect,
  } = props;

  const checkCanDownload = () => !!ownershipStatus && ownershipStatus.isDownloadAvailable;

  const checkShouldDisplaySpinnerOnDownload = () =>
    (isLoggedIn && !ownershipStatus) ||
    ownershipFetchStatus === FetchStatusFlag.FETCHING ||
    mySelect.additionFetchStatus === FetchStatusFlag.FETCHING;

  const checkCurrentBookExistsInMySelect = () =>
    !!ownershipStatus && ownershipStatus.isCurrentlyUsedRidiSelectBook;

  const shouldDisplaySpinnerOnDownload = checkShouldDisplaySpinnerOnDownload();

  const handleDownloadButtonClick = () => {
    if (checkShouldDisplaySpinnerOnDownload()) {
      return;
    }
    if (checkCanDownload()) {
      if (isInApp) {
        readBooksInRidiselect(bookId);
        return;
      }
      if (
        !checkCurrentBookExistsInMySelect() &&
        !confirm('리디북스에서 이미 구매/대여한 책입니다.\n다운로드하시겠습니까?')
      ) {
        return;
      }
      downloadBooksInRidiselect([bookId]);
      return;
    }

    dispatchAddMySelect(bookId);
  };

  if (checkCanDownload()) {
    return (
      <Button
        color="blue"
        size="large"
        spinner={shouldDisplaySpinnerOnDownload}
        className="PageBookDetail_DownloadButton"
        onClick={handleDownloadButtonClick}
      >
        {isInApp ? '읽기' : '다운로드'}
      </Button>
    );
  }
  if (hasAvailableTicket) {
    return (
      <Button
        color="blue"
        size="large"
        spinner={shouldDisplaySpinnerOnDownload}
        className="PageBookDetail_DownloadButton"
        onClick={handleDownloadButtonClick}
      >
        {!shouldDisplaySpinnerOnDownload && <Icon name="check_6" />}
        마이 셀렉트에 추가
      </Button>
    );
  }

  return (
    <Button
      color="blue"
      size="large"
      component={Link}
      spinner={shouldDisplaySpinnerOnDownload}
      className="PageBookDetail_DownloadButton PageBookDetail_DownloadButton-large"
      to="/intro"
    >
      {`리디셀렉트 구독하고 ${isLoggedIn && hasSubscribedBefore ? '바로' : '무료로'} 보기`}
    </Button>
  );
};

const mapStateToProps = (
  state: RidiSelectState,
  ownProps: BookDetailDownloadButtonProps,
): BookDetailDownloadButtonStateProps => {
  const { bookId } = ownProps;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];

  return {
    hasAvailableTicket: state.user.hasAvailableTicket,
    isLoggedIn: state.user.isLoggedIn,
    hasSubscribedBefore: state.user.hasSubscribedBefore,
    env: state.environment,
    isInApp: selectIsInApp(state),
    isAndroidInApp: getIsAndroidInApp(state),
    mySelect: state.mySelect,
    ownershipFetchStatus: stateExists ? bookState.ownershipFetchStatus : undefined,
    ownershipStatus: stateExists ? bookState.ownershipStatus : undefined,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchAddMySelect: (bookId: BookId) => dispatch(MySelectActions.addMySelectRequest({ bookId })),
});
export const ConnectedBookDetailDownloadButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookDetailDownloadButton);
