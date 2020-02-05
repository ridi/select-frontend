/**
 * made by jeongsik@ridi.com
 */
import horizontalAnimateScroll from 'app/utils/scrollTo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedCallback as useDebounce } from 'use-debounce';

export const useScrollPosition = (
  ref: React.RefObject<HTMLElement>,
  listenResizeEvent = false,
  debounceDelay = 50,
): [boolean, boolean, (leftValue: number) => void, () => void] => {
  const [isOnTheLeft, setIsOnTheLeft] = useState(false);
  const [isOnTheRight, setIsOnTheRight] = useState(false);
  const rafId = useRef<null | number>(null);
  const computePosition = useCallback(() => {
    if (ref.current) {
      setIsOnTheLeft(ref.current && ref.current.scrollLeft > 0);
      setIsOnTheRight(
        ref.current && ref.current.scrollWidth !== ref.current.clientWidth + ref.current.scrollLeft,
      );
    }
  }, [ref]);

  const horizontalScrollTo = useCallback(
    (left: number) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (window && ref.current) {
        try {
          horizontalAnimateScroll(ref, left, 300, rafId);
        } catch (error) {
          // 사파리에서 scrollOptions 지원하지 않음
          // ref.current.scroll({ left: ref.current.scrollLeft + left, behavior: 'smooth' });
        }
      }
    },
    [ref, rafId],
  );

  const handleWheelEvent = useCallback(
    event => {
      if (Math.abs(event.deltaX) > 10 && rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    },
    [rafId],
  );
  const [debouncedHScrollHandler] = useDebounce(computePosition, debounceDelay);
  const [debouncedResizeHandler] = useDebounce(computePosition, 500);
  useEffect(() => {
    if (window && ref.current) {
      ref.current.addEventListener('scroll', debouncedHScrollHandler);
      ref.current.addEventListener('wheel', handleWheelEvent, { passive: false });

      if (listenResizeEvent) {
        window.addEventListener('resize', debouncedResizeHandler);
      }
      computePosition();

      return () => {
        if (!ref.current) {
          return;
        }
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }

        ref.current.removeEventListener('scroll', debouncedHScrollHandler);
        ref.current.removeEventListener('wheel', handleWheelEvent);

        if (listenResizeEvent) {
          window.removeEventListener('resize', debouncedResizeHandler);
        }
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [
    ref,
    computePosition,
    debouncedHScrollHandler,
    debouncedResizeHandler,
    listenResizeEvent,
    handleWheelEvent,
    rafId,
  ]);

  const memoizeIsOnTheLeft = useMemo(() => isOnTheLeft, [isOnTheLeft]);
  const memoizeIsOnTheRight = useMemo(() => isOnTheRight, [isOnTheRight]);

  return [memoizeIsOnTheLeft, memoizeIsOnTheRight, horizontalScrollTo, computePosition];
};
