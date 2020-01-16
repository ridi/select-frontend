import * as classNames from 'classnames';
import * as React from 'react';

import { ThumbnailSize } from 'app/components/BookThumbnail/types';

export interface CoverImageProps {
  className?: string;
  src: string;
  alt: string;
  width: ThumbnailSize;
  shadow: boolean;
  expired: boolean;
}

interface CoverImageState {
  isLoaded: boolean;
  isEndTransition: boolean;
}

const NotAvailableComponent = (props: any) => {
  // tslint:disable-next-line:max-line-length
  const path = 'M19.41 0a19.42 19.42 0 1 0 13.73 5.69A19.34 19.34 0 0 0 19.41 0zm0 34.29a14.87 14.87 0 0 1-12-23.67L28.2 31.4a14.72 14.72 0 0 1-8.79 2.89zm12-6.09L10.62 7.42a14.86 14.86 0 0 1 19.32 1.47A14.9 14.9 0 0 1 31.4 28.2z';
  return (
    <svg data-name="Layer 1" viewBox="0 0 38.82 38.82" {...props}>
      <path d={path} />
    </svg>
  );
};

export class CoverImage extends React.Component<CoverImageProps, CoverImageState> {
  public render() {
    const {
      className,
      src,
      alt,
      shadow,
      expired,
    } = this.props;

    return (
      <>
        <img
          className={classNames('RSGBookThumbnail_CoverImage', className)}
          src={src}
          alt={alt}
          onLoad={() => this.setState({ isLoaded: true })}
        />
        {shadow && <span className="RSGBookThumbnail_CoverImage_Shadow" />}
        {expired &&
          <React.Fragment>
            <div className={'BookThumbnail_Dimm'} />
            <div className={'BookThumbnail_NotAvailable'}><NotAvailableComponent className={'NotAvailable_Icon'} /></div>
          </React.Fragment>
        }

      </>
    );
  }
}
