import { all, call, select, takeLatest } from 'redux-saga/effects';

import { RoutePaths } from 'app/constants';
import { Actions } from 'app/services/voucher';
import { requestUseVoucher, UseVoucherResponseCode } from 'app/services/voucher/requests';

export function* useVoucher({ payload }: ReturnType<typeof Actions.useVoucher>) {
  const { voucherCode } = payload;
  const { STORE_URL } = yield select((s) => ({ STORE_URL: s.envirionment.STORE_URL }));
  try {
    yield call(requestUseVoucher, voucherCode);
    window.location.replace(RoutePaths.HOME);
  } catch (e) {
    if (e.data.response.code === UseVoucherResponseCode.subscriptionRequiredVoucher) {
      window.location.href = `${STORE_URL}/select/payments/ridi-pay/request?voucher_code=${voucherCode}`;
      return;
    }
  }
}

export function* watchUseVoucher() {
  yield takeLatest(Actions.useVoucher.getType(), useVoucher);
}

export function* voucherRootSaga() {
  yield all([
    watchUseVoucher(),
  ]);
}
