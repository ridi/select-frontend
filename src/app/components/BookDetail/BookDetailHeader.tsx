import { GNBColorLevel } from 'app/services/commonUI';
import * as React from 'react';

import { BookThumbnailUrlMap, BookTitle } from 'app/services/book';

interface Props {
  solidBackgroundColorRGBString: string;
  transparentBackgroundColorRGBString: string;
  backgroundColorGradientToRight: string;
  backgroundColorGradientToLeft: string;
  gnbColorLevel: GNBColorLevel;
  thumbnail?: BookThumbnailUrlMap;
  title?: BookTitle;
  isMobile: boolean;
  renderMeta: () => any;
}

export const BookDetailHeader = (props: Props) => {
  const { solidBackgroundColorRGBString,
    transparentBackgroundColorRGBString,
    backgroundColorGradientToRight,
    backgroundColorGradientToLeft,
    gnbColorLevel, thumbnail, title, renderMeta, isMobile } = props;

  return (
    <div
      className={`PageBookDetail_Header PageBookDetail_Header-${gnbColorLevel}`}
      style={{ background: solidBackgroundColorRGBString }}
    >
      <span
        className="PageBookDetail_HeaderBackground"
        style={{ backgroundImage: `url(${thumbnail ? `${thumbnail.xxlarge}?dpi=xxhdpi` : ''})` }}
      >
        <span className="Left_GradientOverlay" style={{ background: backgroundColorGradientToRight }} />
        <span className="Right_GradientOverlay" style={{ background: backgroundColorGradientToLeft }} />
      </span>
    <div className="PageBookDetail_HeaderMask" style={{ backgroundColor: transparentBackgroundColorRGBString }}>
      <div className="PageBookDetail_HeaderContent">
        <div className="PageBookDetail_ThumbnailWrapper">
          <button
            className="PageBookDetail_ThumbnailButton"
            onClick={() => this.setState({ thumbnailExapnded: true })}
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
          {!isMobile && renderMeta}
        </div>
      </div>
    </div>
  );
};
