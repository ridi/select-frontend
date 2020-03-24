import styled from '@emotion/styled';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getIsResponsiveBanner } from 'app/services/commonUI/selectors';
import { TOP_BANNER_IMAGE_WIDTH as IMAGE_WIDTH } from 'app/constants';
import { AppStatus } from 'app/services/app';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import ArrowRight from 'svgs/ArrowHeadRight.svg';
import ArrowLeft from 'svgs/ArrowHeadLeft.svg';

import BigBannerCarousel from './BigBannerCarousel';
import CarouselItem from './CarouselItem';

const SLIDE_RADIUS = 1;
const SCROLL_DURATION = 5000;

const CarouselWrapper = styled.div<{ itemWidth: number }>`
  width: 100%;
  max-width: ${props => props.itemWidth * (SLIDE_RADIUS * 2 + 1)}px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: #151829;
`;

const CarouselControllerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
`;

const CarouselController = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: ${IMAGE_WIDTH}px;
  max-height: ${IMAGE_WIDTH}px;
`;

const SlideBadge = styled.p`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 54px;
  height: 12px;
  padding: 5px 0;
  margin: 0;

  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;

  font-family: Roboto, Sans-serif;
  font-size: 12px;
  line-height: 1em;
  text-align: center;
  color: white;
`;

const ArrowWrapper = styled.div`
  margin: 0 10px;
  pointer-events: auto;

  @media (max-width: ${IMAGE_WIDTH}px) {
    display: none;
  }
`;

const Arrow = styled.button`
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: solid 1px rgba(0, 0, 0, 0.07);
  background-color: rgba(255, 255, 255, 0.15);
  transition: background-color 0.2s;

  .ControllArrow {
    width: 8px;
    height: 13px;
    fill: white;
  }

  :hover,
  :focus {
    background-color: rgba(209, 213, 217, 0.25);
  }
  @media (hover: none) {
    :hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
`;

function calcItemWidth(isResponsive: boolean) {
  return isResponsive ? null : IMAGE_WIDTH;
}

/**
 * 고리 형태의 리스트에서 idx가 [start, end] 사이에 있는지 확인합니다.
 *
 * @argument start - 시작점
 * @argument end - 끝점
 * @argument idx - 확인할 인덱스
 */
function checkWithinRingRange(start: number, end: number, idx: number): boolean {
  // start <= end일 때: [... len-1, 0 ... start ... end ... len-1, 0 ...]
  // idx가 start와 end 사이에 있는지 확인하면 됩니다.
  if (start <= end) {
    return start <= idx && idx <= end;
  }
  // end < start일 때: [... start ... len-1, 0, ... end ...]
  // idx가 start 이상이거나 end 이하인지 확인하면 됩니다.
  return idx <= end || start <= idx;
}

interface TopBanner {
  landing_url: string;
  title: string;
  main_image_url: string;
  id: number;
}

export interface TopBannerCarouselProps {
  banners: TopBanner[];
  section: string;
  appStatus: AppStatus;
  savedIdx: number;
  onChangeCurrentIdx: (currentIdx: number) => void;
}

export default function TopBannerCarousel(props: TopBannerCarouselProps) {
  const dispatch = useDispatch();
  const { banners, section, appStatus, savedIdx, onChangeCurrentIdx } = props;
  const len = banners.length;
  const [currentIdx, setCurrentIdx] = React.useState(savedIdx);
  const [touchDiff, setTouchDiff] = React.useState<number>();

  const handleLeftClick = React.useCallback(() => setCurrentIdx(idx => (idx - 1 + len) % len), [
    len,
  ]);
  const handleRightClick = React.useCallback(() => setCurrentIdx(idx => (idx + 1) % len), [len]);

  // 반응형 너비 조정
  const isResponsive = useSelector(getIsResponsiveBanner);
  const initialWidth = window.innerWidth > IMAGE_WIDTH ? IMAGE_WIDTH : window.innerWidth;

  const [width, setWidth] = React.useState(initialWidth);
  React.useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    const newWidth = calcItemWidth(isResponsive);
    if (newWidth == null) {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
    setWidth(newWidth);
  }, [isResponsive]);

  // 터치 핸들링
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const touchRef: any = React.useRef(null);

  const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchRef.current != null) {
      return;
    }
    setTouchDiff(0);
    const touch = e.touches[0];
    touchRef.current = {
      id: touch.identifier,
      startX: touch.clientX,
      at: window.performance.now(),
    };
  }, []);

  // passive: false 때문에 useEffect
  React.useEffect(() => {
    function handleTouchMove(e: TouchEvent) {
      if (touchRef.current == null) {
        return;
      }
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i += 1) {
        const touch = touches[i];
        if (touch.identifier === touchRef.current.id) {
          const diff = touch.clientX - touchRef.current.startX;
          setTouchDiff(diff);
          break;
        }
      }
    }
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  const handleTouchEnd = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (touchRef.current == null) {
        return;
      }
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i += 1) {
        const touch = touches[i];
        if (touch.identifier === touchRef.current.id) {
          const diff = touch.clientX - touchRef.current.startX;
          const dTime = window.performance.now() - touchRef.current.at;
          const velocity = diff / dTime; // px/ms
          const vThreshold = width / 200 / 3;
          // threshold 처리
          if (diff > width / 3 || velocity > vThreshold) {
            setCurrentIdx(idx => (idx - 1 + len) % len);
          }
          if (diff < -width / 3 || velocity < -vThreshold) {
            setCurrentIdx(idx => (idx + 1) % len);
          }
          setTouchDiff(undefined);
          touchRef.current = null;
          break;
        }
      }
    },
    [width],
  );

  const handleTouchCancel = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (touchRef.current == null) {
      return;
    }
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      if (touches[i].identifier === touchRef.current.id) {
        setTouchDiff(undefined);
        touchRef.current = null;
        break;
      }
    }
  }, []);

  // 포커스 시 스크롤 안 되게 막는 부분
  const [focused, setFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback(() => setFocused(false), []);

  React.useEffect(() => {
    if (touchDiff != null || focused) {
      return;
    }
    const handle = window.setTimeout(handleRightClick, SCROLL_DURATION);
    return () => window.clearTimeout(handle);
  }, [handleRightClick, currentIdx, touchDiff, focused]);

  // currentIdx 저장 및 트래킹
  React.useEffect(() => {
    onChangeCurrentIdx(currentIdx);
    const trackingParams: DefaultTrackingParams = {
      section,
      index: currentIdx,
      id: banners[currentIdx].id,
    };
    dispatch(TrackingActions.trackImpression({ trackingParams }));
  }, [currentIdx]);

  return (
    <CarouselWrapper
      ref={wrapperRef}
      itemWidth={width}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <BigBannerCarousel
        totalItems={len}
        itemWidth={width}
        currentIdx={currentIdx}
        touchDiff={touchDiff}
      >
        {({ index, activeIndex, itemWidth }) => (
          <CarouselItem
            key={`${appStatus}_${index}`}
            index={index}
            itemWidth={itemWidth}
            banner={banners[index]}
            active={index === activeIndex}
            invisible={
              !checkWithinRingRange(
                (activeIndex - SLIDE_RADIUS + len) % len,
                (activeIndex + SLIDE_RADIUS) % len,
                index,
              )
            }
            section={section}
          />
        )}
      </BigBannerCarousel>
      <CarouselControllerWrapper>
        <CarouselController>
          <SlideBadge>{`${currentIdx + 1} / ${len}`}</SlideBadge>
        </CarouselController>
      </CarouselControllerWrapper>
      {!isResponsive && (
        <CarouselControllerWrapper>
          <ArrowWrapper>
            <Arrow onClick={handleLeftClick}>
              <ArrowLeft className="ControllArrow" />
              <span className="a11y">이전 배너 보기</span>
            </Arrow>
          </ArrowWrapper>
          <CarouselController />
          <ArrowWrapper>
            <Arrow onClick={handleRightClick}>
              <ArrowRight className="ControllArrow" />
              <span className="a11y">다음 배너 보기</span>
            </Arrow>
          </ArrowWrapper>
        </CarouselControllerWrapper>
      )}
    </CarouselWrapper>
  );
}
