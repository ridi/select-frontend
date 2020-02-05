import { select, take } from 'redux-saga/effects';

import { Actions, AppStatus } from 'app/services/app';
import { RidiSelectState } from 'app/store';

const KEY_LOCAL_STORAGE = 'rs.home';
export const localStorageManager = {
  load: (): AppStatus => {
    const data = localStorage.getItem(KEY_LOCAL_STORAGE) as AppStatus;
    return [AppStatus.Books, AppStatus.Articles].includes(data) ? data : AppStatus.Books;
  },
  save: (status: AppStatus) => {
    localStorage.setItem(KEY_LOCAL_STORAGE, status);
  },
};

export function* watchAppState() {
  while (true) {
    yield take(Actions.updateAppStatus.getType());
    const appStatus = yield select((state: RidiSelectState) => state.app.appStatus);
    localStorageManager.save(appStatus);
  }
}
