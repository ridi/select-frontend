import { hasRefreshedForAppDownload, RidiSelectState } from 'app/store';
import { IOS_APPSTORE_URL } from 'app/utils/downloadUserBook';
import toast from 'app/utils/toast';
import { LOCATION_CHANGE, replace } from 'connected-react-router';
import { all, put, select, take } from 'redux-saga/effects';

export function* watchLocationChange() {
  while (true) {
    yield take(LOCATION_CHANGE);
    const state: RidiSelectState = yield select(s => s);
    if (hasRefreshedForAppDownload()) {
      toast.info('리디북스 뷰어에서 책을 이용하실 수 있습니다.', {
        link: {
          url: IOS_APPSTORE_URL,
          label: '앱스토어로 가기',
          showArrowIcon: true,
        },
        durationMs: 5000,
      });
      yield put(
        replace({
          ...state.router.location,
          search: state.router.location.search.replace(/to_app_store=[^&=]+/, ''),
        }),
      );
    }
  }
}

export function* downloadSaga() {
  yield all([watchLocationChange()]);
}
