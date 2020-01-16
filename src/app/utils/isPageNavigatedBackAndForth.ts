export function isPageNavigatedBackAndForth() {
  const { type, TYPE_BACK_FORWARD } = window.performance.navigation;
  return type === TYPE_BACK_FORWARD;
}
