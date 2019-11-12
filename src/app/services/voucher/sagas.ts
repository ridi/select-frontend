import { all, call, select, takeLatest } from 'redux-saga/effects';

import { RoutePaths } from 'app/constants';
import { Actions } from 'app/services/voucher';
import { requestUseVoucher, UseVoucherResponseCode } from 'app/services/voucher/requests';
import { RidiSelectState } from 'app/store';
import toast from 'app/utils/toast';

export function* useVoucher({ payload }: ReturnType<typeof Actions.useVoucher>) {
  const { voucherCode } = payload;
  const state: RidiSelectState = yield select((s) => s);
  try {
    yield call(requestUseVoucher, voucherCode);
    window.location.replace(RoutePaths.HOME);
  } catch (e) {
    if (!e.response || !e.response.data) {
      return;
    }

    const { code, message } = e.response.data;

    if (code === UseVoucherResponseCode.subscriptionRequiredVoucher) {
      window.location.href = `${state.environment.STORE_URL}/select/payments?voucher_code=${voucherCode}`;
    } else if (code === UseVoucherResponseCode.notEnoughParams || code === UseVoucherResponseCode.invalidParams) {
      toast.failureMessage(message);
    } else {
      toast.failureMessage('이용권 등록에 실패하였습니다. 이용권 코드를 확인해주세요.');
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
