import request from 'app/config/axios';
import env from 'app/config/env';

export enum UseVoucherResponseCode {
  notEnoughParams = 'SUBSCRIPTION_REQUIRED_VOUCHER',
  subscriptionRequiredVoucher = 'SUBSCRIPTION_REQUIRED_VOUCHER',
  expiredVoucher = 'EXPIRED_VOUCHER',
}

export const requestUseVoucher = (voucherCode: string) =>
  request({
    url: `${env.STORE_API}/api/select/users/me/vouchers`,
    method: 'POST',
    data: {
      voucher_code: voucherCode,
    },
  });
