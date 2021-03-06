import { SerializedStyles } from '@emotion/core';
import React from 'react';
import classNames from 'classnames';
import Lazyload from 'react-lazyload';
import { Link } from 'react-router-dom';

import { objectfit } from 'modernizr';
import { ImageSize } from 'app/constants';
import getImageSrc from 'app/utils/getSelectResponsiveImageSrc';
import * as styles from 'app/components/ArticleThumbnail/styles';
import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';
import DisabledIcon from 'svgs/Disabled.svg';

interface ArticleThumbnailProps {
  thumbnailShape?: ThumbnailShape;
  thumbnailClassName?: string;
  imageClassName?: string;
  linkUrl: string;
  imageUrl?: string;
  articleTitle: string;
  isEnabled?: boolean;
  imageSize?: ImageSize;
  onLinkClick?: (event: React.SyntheticEvent<any>) => void;
  thumbnailStyle?: SerializedStyles;
}

export const BlockIconComponent = (props: any) => (
  <svg width={40} height={40} viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2 2 6.5 2 12zm16.3 4.9L7.1 5.7C8.4 4.6 10.1 4 12 4c4.4 0 8 3.6 8 8 0 1.9-.6 3.6-1.7 4.9zM4 12c0-1.9.6-3.6 1.7-4.9l11.2 11.2c-1.3 1.1-3 1.7-4.9 1.7-4.4 0-8-3.6-8-8z" />
  </svg>
);

export const ArticleThumbnail: React.FunctionComponent<ArticleThumbnailProps> = props => {
  const {
    linkUrl,
    imageUrl,
    articleTitle,
    imageClassName,
    thumbnailStyle,
    imageSize = ImageSize.WIDTH_300,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onLinkClick = () => {},
    thumbnailShape = ThumbnailShape.RECTANGLE,
    thumbnailClassName,
    isEnabled = true,
  } = props;

  const [isWrongImage, setIsWrongImage] = React.useState(false);

  React.useEffect(() => {
    if (!imageUrl) {
      setIsWrongImage(true);
    }
  }, []);

  const imageSrc = imageUrl ? getImageSrc(imageUrl, imageSize) : null;

  const renderThumbnailImage = () =>
    objectfit ? (
      <>
        <img
          className={classNames('ArticleThumbnail_CoverImage', imageClassName)}
          alt={articleTitle}
          onError={() => setIsWrongImage(true)}
          {...imageSrc}
        />
        <span className="ArticleThumbnail_CoverShadow" />
      </>
    ) : (
      <>
        <div
          className={classNames('ArticleThumbnail_BackgroundImage', imageClassName)}
          style={{ backgroundImage: `url(${imageUrl}?${imageSize})` }}
        />
        <span className="ArticleThumbnail_CoverShadow" />
      </>
    );

  if (!isEnabled) {
    return (
      <div
        className={classNames(`ArticleThumbnail_Wrapper-${thumbnailShape}`, thumbnailClassName)}
        css={[styles.ArticleThumbnail_Wrapper, thumbnailStyle]}
      >
        <div className="ArticleThumbnail_Block">
          <DisabledIcon width={40} height={40} className="ArticleThumbnail_BlockImage" />
          <p className="ArticleThumbnail_BlockText">이용할 수 없는 아티클입니다.</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={classNames(`ArticleThumbnail_Wrapper-${thumbnailShape}`, thumbnailClassName)}
      css={[styles.ArticleThumbnail_Wrapper, thumbnailStyle]}
    >
      <Link className="ArticleThumbnail_Link" to={linkUrl} onClick={onLinkClick}>
        <Lazyload
          offset={100}
          once
          throttle
          resize
          overflow={false}
          placeholder={<div className="Skeleton ArticleCoverImage_Placeholder" />}
        >
          {!isWrongImage ? (
            renderThumbnailImage()
          ) : (
            <span className="ArticleThumbnail_DefaultCoverImage">
              <img
                className="ArticleThumbnail_DefaultCoverImage_Logo"
                src={require('images/article_default_thumbnail_logo.png')}
                alt="리디셀렉트 아티클 빈 썸네일"
              />
            </span>
          )}
        </Lazyload>
        <span className="a11y">{articleTitle} 상세 바로가기</span>
      </Link>
    </div>
  );
};
