import * as classNames from 'classnames';
import * as React from 'react';
import Lazyload from 'react-lazyload';
import { Link } from 'react-router-dom';

import { ArticleImage } from 'app/components/ArticleThumbnail/ArticleImage';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';

interface ArticleThumbnailProps {
  thumbnailShape?: ThumbnailShape;
  imageClassName?: string;
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
    thumbnailShape = ThumbnailShape.RECTANGLE,
  } = props;

  return (
    <div
      className={classNames(
        'ArticleThumbnail_Wrapper',
        `ArticleThumbnail_Wrapper-${thumbnailShape}`,
      )}
    >
      <Link
        className="ArticleThumbnail_Link"
        to={linkUrl}
      >
        <Lazyload
          offset={100}
          once={true}
          throttle={true}
          resize={true}
          overflow={false}
          placeholder={<div className="Skeleton" />}
        >
          <ArticleImage
            className={imageClassName}
            src={imageUrl}
            alt={articleTitle}
            thumbnailShape={thumbnailShape}
          />
        </Lazyload>
      </Link>
    </div>
  );
};
