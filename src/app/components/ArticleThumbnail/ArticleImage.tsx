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

  return (
    <>
      <img
        className={classNames(
          'ArticleThumbnail_CoverImage',
          className,
        )}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
      />
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
