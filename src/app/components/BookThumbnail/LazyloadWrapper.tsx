import React from 'react';
import Lazyload from 'react-lazyload';

import { DefaultLazyloadPlaceholder } from 'app/components/BookThumbnail/DefaultLazyloadPlaceholder';
import { getThumbnailHeight as getBookThumbnailHeight } from 'app/components/BookThumbnail/helpers';
import { ThumbnailSize as BookThumbnailSize } from 'app/components/BookThumbnail/types';
import { ContentsType } from 'app/constants';

export interface LazyloadWrapperProps {
  width: BookThumbnailSize;
  lazyload: boolean;
  placeholder?: JSX.Element;
  hasOverflowWrapper?: boolean;
  contentsType?: ContentsType;
}

export class LazyloadWrapper extends React.Component<LazyloadWrapperProps> {
  public render() {
    const {
      width,
      lazyload,
      placeholder,
      hasOverflowWrapper,
      children,
    } = this.props;

    const sizeStyle = {
      width,
      height: getBookThumbnailHeight(width as BookThumbnailSize),
    };

    return lazyload ? (
      <Lazyload
        height={sizeStyle.height}
        offset={100}
        once={true}
        throttle={true}
        resize={true}
        overflow={hasOverflowWrapper}
        placeholder={placeholder || <DefaultLazyloadPlaceholder size={sizeStyle} />}
      >
        <div className="RSGBookThumbnail_Wrapper-lazyloaded">
          {children}
        </div>
      </Lazyload>
    ) : (
      <>{children}</>
    );
  }
}
