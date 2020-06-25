import styled from '@emotion/styled';
import React from 'react';
import Lazyload from 'react-lazyload';
import { Link } from 'react-router-dom';

import { objectfit } from 'modernizr';
import { ImageSize } from 'app/constants';
import getImageSrc from 'app/utils/getSelectResponsiveImageSrc';
import DisabledIcon from 'svgs/Disabled.svg';
import Colors from 'app/styles/colors';

interface ArticleChannelThumbnailProps {
  linkUrl: string;
  imageUrl?: string;
  imageSize?: ImageSize;
  channelName: string;
  isEnabled?: boolean;
  onLinkClick?: (event: React.SyntheticEvent<any>) => void;
}

const Thumbnail = {
  Wrapper: styled.div`
    position: relative;
    flex: none;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    overflow: hidden;
  `,
  CoverImage: styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  `,
  CoverBackgroundImage: styled.div`
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 999px;
    box-sizing: border-box;
    background-image: url(${(props: { imageUrl: string }) => props.imageUrl});
    background-size: cover;
    background-position: center center;
    z-index: 1;
  `,
  CoverShadow: styled.div`
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    display: block;
    z-index: 1;
  `,
  Disabled: styled.div`
    width: 40px;
    height: 40px;
    border-radius: 999px;
    overflow: hidden;
    background-color: ${Colors.gray_30};
    line-height: 31px;
    text-align: center;
  `,
  DisabledIcon: styled(DisabledIcon)`
    fill: ${Colors.gray_10};
    vertical-align: middle;
    margin-top: 4px;
    width: 24px;
    height: 24px;
  `,
  DefaultCoverImageWrapper: styled.div`
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: ${Colors.slategray_10};
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: 999px;
    box-sizing: border-box;
  `,
  DefaultCoverImage: styled.img`
    display: block;
    align-self: center;
    width: 50%;
    margin: 0 auto;
  `,
};

export const ArticleChannelThumbnail: React.FunctionComponent<ArticleChannelThumbnailProps> = props => {
  const {
    linkUrl,
    imageUrl,
    channelName,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onLinkClick = () => {},
    isEnabled = true,
    imageSize = ImageSize.HEIGHT_100,
  } = props;

  const [isWrongImage, setIsWrongImage] = React.useState(false);
  const imageSrc = imageUrl ? getImageSrc(imageUrl, imageSize) : null;

  const renderThumbnailImage = React.useCallback(
    () =>
      objectfit ? (
        <>
          <Thumbnail.CoverImage
            alt={channelName}
            onError={() => setIsWrongImage(true)}
            {...imageSrc}
          />
          <Thumbnail.CoverShadow />
        </>
      ) : (
        <>
          <Thumbnail.CoverBackgroundImage imageUrl={imageUrl || ''} />
          <Thumbnail.CoverShadow />
        </>
      ),
    [channelName, imageSrc, imageUrl],
  );

  React.useEffect(() => {
    if (!imageUrl) {
      setIsWrongImage(true);
    }
  }, []);

  if (isEnabled) {
    return (
      <Thumbnail.Wrapper className="ArticleChannelThumbnail_Wrapper">
        <Link to={linkUrl} onClick={onLinkClick}>
          <Lazyload
            offset={100}
            once
            throttle
            resize
            overflow={false}
            placeholder={<div className="Skeleton" />}
          >
            {isWrongImage ? (
              <Thumbnail.DefaultCoverImageWrapper>
                <Thumbnail.DefaultCoverImage
                  src={require('images/article_default_thumbnail_logo.png')}
                  alt="리디셀렉트 채널 빈 썸네일"
                />
              </Thumbnail.DefaultCoverImageWrapper>
            ) : (
              renderThumbnailImage()
            )}
          </Lazyload>
        </Link>
      </Thumbnail.Wrapper>
    );
  }

  return (
    <Thumbnail.Wrapper className="ArticleChannelThumbnail_Wrapper">
      <Thumbnail.Disabled>
        <Thumbnail.DisabledIcon />
      </Thumbnail.Disabled>
    </Thumbnail.Wrapper>
  );
};
