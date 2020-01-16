/**
 * made by jeongsik@ridi.com
 */
import { useCallback } from 'react';
import { useScrollPosition } from './useScrollPosition';

export const useScrollSlider = (
  ref: React.RefObject<HTMLElement>,
  listenResizeEvent = false,
  debounceDelay = 50,
): [() => void, () => void, boolean, boolean] => {
  const [isOnTheLeft, isOnTheRight, scrollTo] = useScrollPosition(
    ref,
    listenResizeEvent,
    debounceDelay,
  );

  // Todo 디자이너와 협의 후 다른 비율로 움직일지 확인
  const moveRight = useCallback(() => {
    scrollTo(ref.current!.clientWidth);
  }, [scrollTo, ref]);

  const moveLeft = useCallback(() => {
    scrollTo(ref.current!.clientWidth * -1);
  }, [scrollTo, ref]);

  return [moveLeft, moveRight, isOnTheLeft, isOnTheRight];
};
