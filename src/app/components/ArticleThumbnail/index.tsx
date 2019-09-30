import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { ArticleImage } from 'app/components/ArticleThumbnail/ArticleImage';
import { DEFAULT_THUMBNAIL_SIZE, ThumbnailShape, ThumbnailSize } from 'app/components/ArticleThumbnail/types';
import { LazyloadWrapper } from 'app/components/LazyloadWrapper';

interface ArticleThumbnailProps {
  width?: ThumbnailSize;
  thumbnailShape?: ThumbnailShape;
  imageClassName: string;
  linkUrl: string;
  imageUrl: string;
  articleTitle: string;
}

export const ArticleThumbnail: React.FunctionComponent<ArticleThumbnailProps> = (props) => {
  const {
    linkUrl,
    imageUrl,
    articleTitle,
    imageClassName,
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
          lazyload={true}
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
