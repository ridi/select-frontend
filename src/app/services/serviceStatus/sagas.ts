import { AxiosResponse } from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { Actions, ErrorResponseData } from 'app/services/serviceStatus';
import { requestMaintenanceData } from 'app/services/serviceStatus/requests';

export function* loadMaintenanceData() {
  try {
    const response: AxiosResponse<ErrorResponseData> = yield call(requestMaintenanceData);
    yield put(
      Actions.setState({
        status: 503,
        data: response.data,
      }),
    );
  } catch (e) {
    yield put(
      Actions.setState({
        status: 404,
      }),
    );
  }
}

export function* watchLoadMaintenanceData() {
  yield takeLatest(Actions.loadMaintenanceData.getType(), loadMaintenanceData);
}

export function* serviceStatusSaga() {
  yield all([watchLoadMaintenanceData()]);
}
