import * as React from 'react';
import { connect } from 'react-redux';

import { Icon } from '@ridi/rsg';

import { FetchStatusFlag } from 'app/constants';
import { BookThumbnailUrlMap, BookTitle } from 'app/services/book';
import { RidiSelectState } from 'app/store';

interface BookDetailOverlaysProps {
  bookId: number;
  thumbnailExapnded: boolean;
  onClick: () => void;
}

interface BookDetailOverlaysStateProps {
  thumbnail?: BookThumbnailUrlMap;
  title?: BookTitle;
  fetchStatus: FetchStatusFlag;
}

type Props = BookDetailOverlaysProps & BookDetailOverlaysStateProps;

const BookDetailOverlays: React.FunctionComponent<Props> = (props) => props.thumbnailExapnded ? (
  <div
    className="PageBookDetail_ThumbnailPopup"
    onClick={props.onClick}
  >
    <div className="PageBookDetail_ThumbnailPopupContent">
      <button
        className="PageBookDetail_ThumbnailPopupCloseBtn"
        onClick={props.onClick}
      >
        <Icon name="close_2" />
      </button>
      <img
        className="PageBookDetail_ThumbnailPopupImg"
        src={`${props.thumbnail!.xxlarge}?dpi=xxhdpi`}
        alt={props.title!.main}
      />
    </div>
  </div>
) : null;

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailOverlaysProps): BookDetailOverlaysStateProps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const book = stateExists ? bookState.book : undefined;
  const bookDetail = stateExists ? bookState.bookDetail : undefined;
  const fetchStatus = stateExists ? bookState.detailFetchStatus : FetchStatusFlag.IDLE;

  return {
    fetchStatus,
    title: !!bookDetail ? bookDetail.title : !!book ? book.title : undefined,
    thumbnail: !!bookDetail ? bookDetail.thumbnail : !!book ? book.thumbnail : undefined,
  };
};

export const ConnectedBookDetailOverlays = connect(mapStateToProps, null)(BookDetailOverlays);
