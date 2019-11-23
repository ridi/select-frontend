import * as React from 'react';

import { getThumbnailHeight } from 'app/components/ArticleThumbnail/helpers';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import * as classNames from 'classnames';

export interface ArticleImageProps {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  thumbnailShape: ThumbnailShape;
}

export const ArticleImage: React.FunctionComponent<ArticleImageProps> = (props) => {
  const {
    className,
    src,
    alt,
  } = props;

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isEndTransition, setIsEndTransition] = React.useState(false);
  const [isWrongImage, setIsWrongImage] = React.useState(false);

  React.useEffect(() => {
    if (!src) {
      setIsWrongImage(true);
    }
  }, []);

  return (
    <>
      {!isWrongImage ? (
        <img
          className={classNames(
            'ArticleThumbnail_CoverImage',
            className,
          )}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsWrongImage(true)}
        />
      ) : (
        <span className="ArticleThumbnail_DefaultCoverImage">
          <img
            className="ArticleThumbnail_DefaultCoverImage_Logo"
            src={require('images/article_default_thumbnail_logo.png')}
            alt="리디셀렉트 아티클 빈 썸네일"
          />
        </span>
      )}
      {isLoaded && isEndTransition ? null : (
        <span
          className={classNames(
            'Skeleton',
            'CoverImage_Placeholder',
            isLoaded ? 'CoverImage_Placeholder-fadeout' : null,
          )}
          onTransitionEnd={() => setIsEndTransition(true)}
        />
      )}
    </>
  );
};
