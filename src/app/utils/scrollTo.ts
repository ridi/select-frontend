// easing functions
// https://gist.github.com/gre/1650294
const easings: { [key: string] : (t:number) => number } = {
  linear(t: number) {
    return t;
  },
  easeInQuad(t: number) {
    return t * t;
  },
  easeOutQuad(t: number) {
    return t * (2 - t);
  },
  easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeInCubic(t: number) {
    return t * t * t;
  },
  easeOutCubic(t: number) {
    // eslint-disable-next-line no-param-reassign
    return --t * t * t + 1;
  },
  easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  easeInQuart(t: number) {
    return t * t * t * t;
  },
  easeOutQuart(t: number) {
    // eslint-disable-next-line no-param-reassign
    return 1 - --t * t * t * t;
  },
  easeInOutQuart(t: number) {
    // eslint-disable-next-line no-param-reassign
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },
  easeInQuint(t: number) {
    return t * t * t * t * t;
  },
  easeOutQuint(t: number) {
    // eslint-disable-next-line no-param-reassign
    return 1 + --t * t * t * t * t;
  },
  easeInOutQuint(t: number) {
    // eslint-disable-next-line no-param-reassign
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  },
};

const horizontalAnimateScroll = (
  element: React.RefObject<HTMLElement>,
  moveTo: number,
  duration: number,
  refRafId: React.MutableRefObject<null | number>,
  easing = 'easeInOutQuad',
) => {
  if (!element.current) {
    return;
  }
  const startScrollPosition = element.current.scrollLeft;
  const startTime =
    'now' in window.performance ? performance.now() : new Date().getTime();

  const scrollToPosition =
    element.current.scrollLeft + moveTo <= 0
      ? 0
      : Math.round(element.current.scrollLeft + moveTo);

  if ('requestAnimationFrame' in window) {
    const scroll = () => {
      if (!element.current) {
        return;
      }
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, (now - startTime) / duration);
      const timeFunction = easings[easing](time);

      if (element.current.scroll) {
        element.current.scroll(
          Math.ceil(
            timeFunction * (scrollToPosition - startScrollPosition) + startScrollPosition,
          ),
          0,
        );
      } else {
        element.current.scrollLeft = Math.ceil(
          timeFunction * (scrollToPosition - startScrollPosition) + startScrollPosition,
        );
      }

      const isRightScrollMax =
        moveTo > 0 &&
        element.current.scrollWidth ===
          element.current.scrollLeft + element.current.clientWidth;
      const finished =
        element.current.scrollLeft === scrollToPosition || isRightScrollMax;

      if (finished) {
        return;
      }
      refRafId.current = requestAnimationFrame(scroll);
    };
    scroll();
  }
  if (element.current.scroll) {
    element.current.scroll(scrollToPosition, 0);
  } else {
    element.current.scrollLeft = scrollToPosition;
  }
};

export default horizontalAnimateScroll;
