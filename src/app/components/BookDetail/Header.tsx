// tslint:disable-next-line
const Vibrant = require('node-vibrant');

import * as React from 'react';
import { connect } from 'react-redux';

import { Palette as VibrantPalette } from 'node-vibrant/lib/color';

import { Actions as BookActions, BookThumbnailUrlMap, BookTitle } from 'app/services/book';
import { Actions as CommonUIActions, GNB_DEFAULT_COLOR, GNBColorLevel, RGB } from 'app/services/commonUI';

import { ConnectedBookDetailOverlays } from 'app/components/BookDetail/Overlays';
import {
  getBackgroundColorGradientToLeft,
  getBackgroundColorGradientToRight,
  getSolidBackgroundColorRGBString,
  getTransparentBackgroundColorRGBString,
} from 'app/services/commonUI/selectors';
import { RidiSelectState } from 'app/store';
import { withThumbnailQuery } from 'app/utils/withThumbnailQuery';
import { FetchStatusFlag } from 'app/constants';

interface BookDetailHeaderPorps {
  bookId: number;
  children?: React.ReactNode;
}

interface BookDetailHeaderStatePorps {
  title?: BookTitle;
  thumbnail?: BookThumbnailUrlMap;
  dominantColor?: RGB;
  gnbColorLevel: GNBColorLevel;
  solidBackgroundColorRGBString: string;
  backgroundColorGradientToLeft: string;
  backgroundColorGradientToRight: string;
  transparentBackgroundColorRGBString: string;
}

type Props = ReturnType<typeof mapDispatchToProps> & BookDetailHeaderPorps & BookDetailHeaderStatePorps;

const BookDetailHeader: React.FunctionComponent<Props> = (props) => {
  const {
    bookId,
    title,
    thumbnail,
    dominantColor,
    gnbColorLevel,
    solidBackgroundColorRGBString,
    backgroundColorGradientToLeft,
    backgroundColorGradientToRight,
    transparentBackgroundColorRGBString,
    dispatchUpdateDominantColor,
    dispatchUpdateGNBColor,
    dispatchUpdateGNBTabExpose,
    children,
  } = props;

  const [thumbnailExapnded, setThumbnailExapnded] = React.useState(false);

  React.useEffect(() => {
    dispatchUpdateGNBTabExpose(false);
    if (dominantColor && dominantColor.r && dominantColor.g && dominantColor.b) {
      dispatchUpdateGNBColor(dominantColor);
    } else if (thumbnail) {
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

    return () => {
      dispatchUpdateGNBColor(GNB_DEFAULT_COLOR);
      dispatchUpdateGNBTabExpose(true);
    };
  }, [bookId, thumbnail]);

  return (
    <div
      className={`PageBookDetail_Header PageBookDetail_Header-${gnbColorLevel}`}
      style={{ background: solidBackgroundColorRGBString }}
    >
      <span
        className="PageBookDetail_HeaderBackground"
        style={{
          backgroundImage: `url(${
            thumbnail ? `${thumbnail.xxlarge}?dpi=xxhdpi` : ''
          })`,
        }}
      >
        <span
          className="Left_GradientOverlay"
          style={{ background: backgroundColorGradientToRight }}
        />
        <span
          className="Right_GradientOverlay"
          style={{ background: backgroundColorGradientToLeft }}
        />
      </span>
      <div
        className="PageBookDetail_HeaderMask"
        style={{ backgroundColor: transparentBackgroundColorRGBString }}
      >
        <div className="PageBookDetail_HeaderContent">
          <div className="PageBookDetail_ThumbnailWrapper">
            <button
              className="PageBookDetail_ThumbnailButton"
              onClick={() => setThumbnailExapnded(true)}
            >
              {thumbnail && (
                <img
                  className="PageBookDetail_Thumbnail"
                  src={`${thumbnail.xxlarge}?dpi=xxhdpi`}
                  alt={title!.main}
                />
              )}
            </button>
          </div>
          {children}
        </div>
      </div>
      <ConnectedBookDetailOverlays
        bookId={bookId}
        thumbnailExapnded={thumbnailExapnded}
        onClick={() => setThumbnailExapnded(false)}
      />
    </div>
  );
};

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailHeaderPorps): BookDetailHeaderStatePorps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const book = stateExists ? bookState.book : undefined;
  const bookDetail = stateExists ? bookState.bookDetail : undefined;

  return {
    gnbColorLevel: state.commonUI.gnbColorLevel,
    dominantColor: stateExists ? bookState.dominantColor : undefined,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    transparentBackgroundColorRGBString: getTransparentBackgroundColorRGBString(state),
    backgroundColorGradientToLeft: getBackgroundColorGradientToLeft(state),
    backgroundColorGradientToRight: getBackgroundColorGradientToRight(state),
    // Data that can be pre-fetched in home
    title: !!bookDetail ? bookDetail.title : !!book ? book.title : undefined,
    thumbnail: !!bookDetail ? bookDetail.thumbnail : !!book ? book.thumbnail : undefined,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchUpdateGNBTabExpose: (isGnbTab: boolean) => dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab })),
  dispatchUpdateGNBColor: (color: RGB) => dispatch(CommonUIActions.updateGNBColor({ color })),
  dispatchUpdateDominantColor: (bookId: number, color: RGB) =>
    dispatch(BookActions.updateDominantColor({ bookId, color })),
});

export const ConnectedBookDetailHeader = connect(mapStateToProps, mapDispatchToProps)(BookDetailHeader);
