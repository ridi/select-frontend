import classNames from 'classnames';
import React from 'react';

import { getThumbnailHeight } from 'app/components/BookThumbnail/helpers';
import { DEFAULT_THUMBNAIL_SIZE, ThumbnailSize } from 'app/components/BookThumbnail/types';

export interface SizeWrapperProps {
  className?: string;
  width?: ThumbnailSize;
}

export const SizeWrapper: React.SFC<SizeWrapperProps> = props => {
  const { className, width = DEFAULT_THUMBNAIL_SIZE, children } = props;

  const sizeStyle = {
    width,
    height: getThumbnailHeight(width),
    maxHeight: getThumbnailHeight(width),
  };

  return (
    <div className={classNames(['RSGBookThumbnail', className])} style={sizeStyle}>
      {children}
    </div>
  );
};
