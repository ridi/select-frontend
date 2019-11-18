import request from 'app/config/axios';
import env from 'app/config/env';

export enum UseVoucherResponseCode {
  notEnoughParams = 'SUBSCRIPTION_REQUIRED_VOUCHER',
  invalidParams = 'INVALID_PARAM',
  voucherNotFound  = 'VOUCHER_NOT_FOUND',
  subscriptionRequiredVoucher = 'SUBSCRIPTION_REQUIRED_VOUCHER',
  expiredVoucher = 'EXPIRED_VOUCHER',
  deactivatedVoucher = 'DEACTIVATED_VOUCHER',
  oneTimeRedeemableVoucher = 'ONE_TIME_REDEEMABLE_VOUCHER',
  redeemedVoucher = 'REDEEMED_VOUCHER',
}

export const requestUseVoucher = (voucherCode: string) =>
  request({
    url: `${env.STORE_API}/api/select/users/me/vouchers`,
    method: 'POST',
    data: {
      voucher_code: voucherCode,
    },
  });
