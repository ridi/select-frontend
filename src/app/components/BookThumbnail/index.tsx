import React from 'react';

import { CoverImage } from 'app/components/BookThumbnail/CoverImage';
import { LazyloadWrapper } from 'app/components/BookThumbnail/LazyloadWrapper';
import { LinkWrapper } from 'app/components/BookThumbnail/LinkWrapper';
import { SizeWrapper } from 'app/components/BookThumbnail/SizeWrapper';
import { DEFAULT_THUMBNAIL_SIZE, ThumbnailSize} from 'app/components/BookThumbnail/types';

export interface BookThumbnailProps {
  sizeWrapperClassName?: string;
  linkWrapperClassName?: string;
  imageClassName?: string;
  imageUrl: string;
  width?: ThumbnailSize;
  bookTitle: string;
  linkUrl?: string;
  linkType?: 'a' | 'Link' | 'button';
  onLinkClick?: (event: React.SyntheticEvent<any>) => void;
  shadow?: boolean;
  lazyload?: boolean;
  hasOverflowWrapper?: boolean;
  placeholder?: JSX.Element;
  expired?: boolean;
}

export const BookThumbnail: React.SFC<BookThumbnailProps> = (props) => {
  const {
    sizeWrapperClassName,
    linkWrapperClassName,
    imageClassName,
    imageUrl,
    width = DEFAULT_THUMBNAIL_SIZE,
    bookTitle,
    linkUrl,
    linkType = 'Link',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onLinkClick = () => {},
    shadow = true,
    lazyload = true,
    hasOverflowWrapper = false,
    placeholder,
    expired = false,
  } = props;

  return (
    <SizeWrapper
      className={sizeWrapperClassName}
      width={width}
    >
      <LinkWrapper
        className={linkWrapperClassName}
        linkUrl={linkUrl}
        linkType={linkType}
        onClick={onLinkClick}
        expired={expired}
      >
        <LazyloadWrapper
          width={width}
          lazyload={lazyload}
          placeholder={placeholder}
          hasOverflowWrapper={hasOverflowWrapper}
        >
          <CoverImage
            className={imageClassName}
            src={imageUrl}
            alt={bookTitle}
            width={width}
            shadow={shadow}
            expired={expired}
          />
        </LazyloadWrapper>
      </LinkWrapper>
    </SizeWrapper>
  );
};

export * from './CoverImage';
export * from './DefaultLazyloadPlaceholder';
export * from './helpers';
export * from './LinkWrapper';
export * from './SizeWrapper';
export * from './types';
