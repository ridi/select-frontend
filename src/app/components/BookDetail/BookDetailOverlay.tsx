import * as React from 'react';

// Book Services
import { Icon } from '@ridi/rsg';
import { BookThumbnailUrlMap, BookTitle } from 'app/services/book';

interface Props {
  isFetched: boolean;
  thumbnail?: BookThumbnailUrlMap;
  title?: BookTitle;
  thumbnailExapnded: boolean;
  closeThumbnailExapnded: () => void;
}

export const BookDetailOverlay = (props: Props) => {
  const { isFetched, thumbnail, title, thumbnailExapnded, closeThumbnailExapnded } = props;
  if (!isFetched) {
    return <></>;
  }

  return (
    <>
      {thumbnailExapnded && (
        <div
          className="PageBookDetail_ThumbnailPopup"
          onClick={closeThumbnailExapnded}
        >
          <div className="PageBookDetail_ThumbnailPopupContent">
            <button
              className="PageBookDetail_ThumbnailPopupCloseBtn"
              onClick={closeThumbnailExapnded}
            >
              <Icon name="close_2" />
            </button>
            <img
              className="PageBookDetail_ThumbnailPopupImg"
              src={`${thumbnail!.xxlarge}?dpi=xxhdpi`}
              alt={title!.main}
            />
          </div>
        </div>
      )}
    </>
  );
};
