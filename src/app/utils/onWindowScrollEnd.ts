const scrollEndHandlers: Array<(e?: Event) => void> = [];
let scrollTimeout: number;

function onWindowScrollEnd(e: Event) {
  if (scrollTimeout) {
    window.clearTimeout(scrollTimeout);
  }
  scrollTimeout = window.setTimeout(() => {
    scrollEndHandlers.forEach(handler => handler(e));
  }, 300);
}

export function subscribeToScrollEnd(callback: (e?: Event) => void) {
  scrollEndHandlers.push(callback);
  return scrollEndHandlers.length - 1;
}

export function unsubscribeFromScrollEnd(index: number) {
  delete scrollEndHandlers[index];
}

export function clearScrollEndHandlers() {
  scrollEndHandlers.splice(0, scrollEndHandlers.length);
}

export function initializeScrollEnd() {
  window.addEventListener('scroll', onWindowScrollEnd);
}
