import * as classNames from 'classnames';
import * as React from 'react';
import Lazyload from 'react-lazyload';

import { getThumbnailHeight as getArticleThumbnailHeight } from 'app/components/ArticleThumbnail/helpers';
import {
  ThumbnailShape as ArticleThumbnailShape,
} from 'app/components/ArticleThumbnail/types';
import { DefaultLazyloadPlaceholder } from 'app/components/BookThumbnail/DefaultLazyloadPlaceholder';
import { getThumbnailHeight as getBookThumbnailHeight } from 'app/components/BookThumbnail/helpers';
import { ThumbnailSize as BookThumbnailSize } from 'app/components/BookThumbnail/types';
import { ContentsType } from 'app/constants';

export interface LazyloadWrapperProps {
  width: BookThumbnailSize | number;
  thumbanilShape?: ArticleThumbnailShape;
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
      contentsType = ContentsType.BOOK,
      thumbanilShape = ArticleThumbnailShape.RECTANGLE,
      children,
    } = this.props;

    const sizeStyle = {
      width,
      height:
        contentsType === ContentsType.BOOK
          ? getBookThumbnailHeight(width as BookThumbnailSize)
          : getArticleThumbnailHeight(width, thumbanilShape),
    };

    return lazyload ? (
      <Lazyload
        height={sizeStyle.height}
        offset={100}
        once={true}
        throttle={true}
        resize={true}
        overflow={hasOverflowWrapper}
        placeholder={
          placeholder || <DefaultLazyloadPlaceholder size={sizeStyle} />}
      >
        <div
          className={classNames(
            contentsType === ContentsType.BOOK && 'RSGBookThumbnail_Wrapper-lazyloaded',
            contentsType === ContentsType.ARTICLE && 'ArticleThumbnail_Wrapper-lazyloaded',
          )}
        >
          {children}
        </div>
      </Lazyload>
    ) : (
      <>{children}</>
    );
  }
}
