import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { ArticleImage } from 'app/components/ArticleThumbnail/ArticleImage';
import { DEFAULT_THUMBNAIL_SIZE, ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import { LazyloadWrapper } from 'app/components/LazyloadWrapper';

interface ArticleThumbnailProps {
  width?: number;
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
    thumbnailShape = ThumbnailShape.RECTANGLE,
  } = props;

  const articleThumbRef = React.useRef<HTMLDivElement>(null);
  const [articleWidth, setArticleWidth] = React.useState(DEFAULT_THUMBNAIL_SIZE);

  React.useEffect(() => {
    if (articleThumbRef === null || articleThumbRef.current === null) {
      return;
    }
    setArticleWidth(articleThumbRef.current.offsetWidth);
  }, [articleThumbRef]);

  return (
    <div
      className={classNames(
        'ArticleThumbanil_Wrapper',
        `ArticleThumbanil_Wrapper-${thumbnailShape}`,
      )}
      ref={articleThumbRef}
    >
      <Link to={linkUrl}>
        <LazyloadWrapper
          width={articleWidth}
          thumbanilShape={thumbnailShape}
          lazyload={lazyloadThumbnail}
        >
          <ArticleImage
            className={imageClassName}
            src={imageUrl}
            alt={articleTitle}
            width={articleWidth}
            thumbnailShape={thumbnailShape}
          />
        </LazyloadWrapper>
      </Link>
    </div>
  );
};
