import React from 'react';
import { Ticket } from 'app/services/user/requests';
import { buildDateAndTimeFormat, buildOnlyDateFormat } from 'app/utils/formatDate';

interface OrderHistoryListAmountInfoProps {
  payment: Ticket;
}
export const OrderHistoryListInfo: React.FunctionComponent<OrderHistoryListAmountInfoProps> = props => {
  const { payment } = props;

  return (
    <>
      <p className="Ordered_Date">{buildDateAndTimeFormat(payment.purchaseDate)}</p>
      <p className="Ordered_Name">
        {payment.title}
        {payment.voucherCode && !payment.isFreePromotion ? (
          <>
            <span className="Ordered_VoucherInfo">
              {payment.voucherCode.match(/.{1,4}/g)!.join('-')} (
              {buildOnlyDateFormat(payment.voucherExpireDate)}까지)
            </span>
            <span className="Ordered_Term">
              이용 기간: {buildOnlyDateFormat(payment.startDate)}~
              {buildOnlyDateFormat(payment.endDate)}
            </span>
          </>
        ) : null}
      </p>
      <p className="Ordered_Type">
        {`${payment.paymentMethod}${payment.isCanceled ? ' (취소됨)' : ''}`}
      </p>
    </>
  );
};
