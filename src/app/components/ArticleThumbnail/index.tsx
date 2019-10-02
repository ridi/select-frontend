import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { ArticleImage } from 'app/components/ArticleThumbnail/ArticleImage';
import { DEFAULT_THUMBNAIL_SIZE, ThumbnailShape, ThumbnailSize } from 'app/components/ArticleThumbnail/types';
import { LazyloadWrapper } from 'app/components/LazyloadWrapper';

interface ArticleThumbnailProps {
  width?: ThumbnailSize;
  thumbnailShape?: ThumbnailShape;
  imageClassName?: string;
  linkUrl: string;
  imageUrl: string;
  articleTitle: string;
  lazyloadThumbnail?: boolean;
}

export const ArticleThumbnail: React.FunctionComponent<ArticleThumbnailProps> = (props) => {
  const {
    linkUrl,
    imageUrl,
    articleTitle,
    imageClassName,
    lazyloadThumbnail = true,
    width = DEFAULT_THUMBNAIL_SIZE,
    thumbnailShape = ThumbnailShape.RECTANGLE,
  } = props;

  return (
    <div
      className={classNames(
        'ArticleThumbanil_Wrapper',
        `ArticleThumbanil_Wrapper-${thumbnailShape}`,
      )}
    >
      <Link to={linkUrl}>
        <LazyloadWrapper
          width={width}
          thumbanilShape={thumbnailShape}
          lazyload={lazyloadThumbnail}
        >
          <ArticleImage
            className={imageClassName}
            src={imageUrl}
            alt={articleTitle}
            width={width}
            thumbnailShape={thumbnailShape}
          />
        </LazyloadWrapper>
      </Link>
    </div>
  );
};
