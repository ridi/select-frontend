import { Location } from 'history';

export type HistoryStack = Location[];

const BOOK_DETAIL_PATH = '/book/';

export function isUpperPath(currentPath: string, formerPath: string) {
  return (
    currentPath !== formerPath &&
    !(currentPath.includes(BOOK_DETAIL_PATH) && formerPath.includes(BOOK_DETAIL_PATH))
  );
}

export function pushToList(list: any[], item: any) {
  return [...list, item];
}

export function replaceLastItem(list: any[], item: any) {
  list.pop();
  return pushToList(list, item);
}

export function addToHistoryStack(stack: HistoryStack, location: Location) {
  return stack.length &&
    stack[stack.length - 1].pathname === location.pathname &&
    stack[stack.length - 1].search === location.search
    ? replaceLastItem(stack, location)
    : pushToList(stack, location);
}

export function updateHistoryStack(stack: HistoryStack, currentLocation: Location) {
  const index = stack.findIndex(location => !!location.key && location.key === currentLocation.key);
  return index === -1 ? addToHistoryStack(stack, currentLocation) : [...stack.slice(0, index + 1)];
}

export function findUpperPathDiff(stack: HistoryStack) {
  const copiedStack = [...stack];
  const currentLocation = copiedStack.pop()!;
  return copiedStack.reduceRight(
    ({ diff, isDiffFixed }, location) => {
      if (isDiffFixed) {
        return { diff, isDiffFixed };
      }
      if (isUpperPath(currentLocation.pathname, location.pathname)) {
        return {
          diff,
          isDiffFixed: true,
        };
      }
      return {
        diff: diff - 1,
        isDiffFixed,
      };
    },
    { diff: -1, isDiffFixed: false },
  ).diff;
}

const HISTORY_STACK_KEY = 'rs.customHistoryStack';

export const historyStackSessionStorageHelper = {
  saveStack: (stack: HistoryStack) => {
    try {
      window.sessionStorage.setItem(HISTORY_STACK_KEY, JSON.stringify(stack));
    } catch (e) {
      this.clear();
    }
  },
  getStack: () => {
    const sessionStorageData = window.sessionStorage.getItem(HISTORY_STACK_KEY) || '';
    return sessionStorageData.length ? JSON.parse(sessionStorageData) : undefined;
  },
  clear: () => {
    window.sessionStorage.removeItem(HISTORY_STACK_KEY);
  },
};
