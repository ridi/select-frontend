import { createAction } from 'redux-act';

export const Actions = {
  useVoucher: createAction<{
    voucherCode: string,
  }>('useVoucher'),
};
