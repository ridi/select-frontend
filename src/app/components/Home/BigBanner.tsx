import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { AppStatus } from 'app/services/app';
import { getBooksBannerCurrentIdx, getArticlesBannerCurrentIdx } from 'app/services/home/selectors';
import TopBannerCarousel, { TopBannerCarouselProps } from 'app/components/TopBanner';
import { TOP_BANNER_IMAGE_WIDTH as IMAGE_WIDTH } from 'app/constants';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { Actions as ArticleActions } from 'app/services/articleHome';
import { Actions as HomeActions } from 'app/services/home';

const TopBannerSkeleton = styled.div`
  width: 100%;
  height: 100vw;
  max-height: ${IMAGE_WIDTH}px;
  background: #eee;
`;

const BookCarousel: React.FunctionComponent<TopBannerCarouselProps> = props => (
  <TopBannerCarousel {...props} />
);

const ArticlesCarousel: React.FunctionComponent<TopBannerCarouselProps> = props => (
  <TopBannerCarousel {...props} />
);

const BigBanner: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { appStatus } = useSelector((state: RidiSelectState) => state.app);
  const isBooks = appStatus === AppStatus.Books;
  const fetchedAt = useSelector((state: RidiSelectState) =>
    isBooks ? state.home.fetchedAt : state.articleHome.fetchedAt,
  );
  const savedIdx = isBooks
    ? useSelector(getBooksBannerCurrentIdx)
    : useSelector(getArticlesBannerCurrentIdx);
  const service = isBooks ? 'select-book' : 'select-article';
  const section = getSectionStringForTracking(service, 'home', 'big-banner');
  const bigBannerList = useSelector((state: RidiSelectState) =>
    isBooks ? state.home.bigBannerList : state.articleHome.bigBannerList,
  );
  const banners = bigBannerList.map(bannerItem => ({
    id: bannerItem.id,
    landing_url: bannerItem.linkUrl,
    main_image_url: bannerItem.imageUrl,
    title: bannerItem.title,
  }));
  const onChangeCurrentIdx = (currentIdx: number) => {
    isBooks
      ? dispatch(HomeActions.updateBannerIndex({ currentIdx }))
      : dispatch(ArticleActions.updateBannerIndex({ currentIdx }));
  };
  const carouselProps: TopBannerCarouselProps = {
    banners,
    appStatus,
    section,
    savedIdx,
    onChangeCurrentIdx,
  };

  if (!fetchedAt) {
    return <TopBannerSkeleton />;
  }
  return isBooks ? <BookCarousel {...carouselProps} /> : <ArticlesCarousel {...carouselProps} />;
};

export default BigBanner;
