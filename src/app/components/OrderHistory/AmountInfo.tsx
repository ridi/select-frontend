import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '@ridi/rsg';

import toast from 'app/utils/toast';
import { RidiSelectState } from 'app/store';
import { Actions } from 'app/services/user';
import { Ticket } from 'app/services/user/requests';
import * as styles from 'app/components/OrderHistory/styles';
import { CashReceiptIssueModal } from 'app/components/OrderHistory/CashReceiptIssueModal';

interface OrderHistoryListAmountInfoProps {
  payment: Ticket;
}

export const OrderHistoryListAmountInfo: React.FunctionComponent<OrderHistoryListAmountInfoProps> = (props) => {
  const { payment } = props;
  const {
    id,
    voucherCode,
    isCancellable,
    cashReceiptUrl,
    formattedPrice,
    isFreePromotion,
    isCashReceiptIssuable,
    ticketIdsToBeCanceledWith,
  } = payment;
  const orderHistory = useSelector((state: RidiSelectState) => state.user.purchaseHistory);
  const subscriptionState = useSelector((state: RidiSelectState) => state.user.subscription);

  const dispatch = useDispatch();

  const [cashReceiptIssuePopupActive, setCashReceiptIssuePopupActive] = React.useState(false);

  useEffect(() => {
    if (cashReceiptUrl && cashReceiptUrl.length > 0) {
      setCashReceiptIssuePopupActive(false);
    }
  }, [cashReceiptUrl]);

  const handleCancelPurchaseButtonClick = () => {
    if (orderHistory.isCancelFetching) {
      toast.failureMessage('취소 진행중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }
    const comfirmMessageBlocks = [];

    if (subscriptionState && subscriptionState.isSubscribedWithOldPrice) {
      comfirmMessageBlocks.push(`결제 금액이 인상되어 결제 취소 이후\n월 ${subscriptionState.formattedNewMonthlyPayPrice}이 적용됩니다.`);
    }
    if (ticketIdsToBeCanceledWith.length > 0) {
      comfirmMessageBlocks.push(`${comfirmMessageBlocks.length > 0 ? '\n' : ''}미사용된 이용권이 함께 취소되며 이용권은 유효기간 내에 다시 등록 가능합니다.`);
    }
    if (comfirmMessageBlocks.length <= 0) {
      comfirmMessageBlocks.push('결제를 취소할 경우 즉시 이용할 수 없습니다.');
    }

    if (confirm(`결제를 취소하시겠습니까?\n${comfirmMessageBlocks.join('\n')}`)) {
      dispatch(Actions.cancelPurchaseRequest({ purchaseId: id }))
    }
  }

  const handleCandleCashReceiptButtonClick = () => {
    if (orderHistory.isCashReceiptIssueFetching) {
      return;
    }
    dispatch(Actions.cashReceiptIssueRequest({
      ticketId: id,
      method: 'DELETE',
    }));
  }

  return (
    <>
      <p className="Ordered_Amount">
        {isFreePromotion
          ? '무료'
          : voucherCode ? '' : formattedPrice}
      </p>
      <div className="OrderHistoryButtons">
        {isCancellable ? (
          <Button
            className="CancelOrderButton"
            color="gray"
            outline={true}
            onClick={handleCancelPurchaseButtonClick}
            size="medium"
          >
            결제 취소
          </Button>
        ) : null}
        {cashReceiptUrl && cashReceiptUrl.length > 0 ? (
          <>
            <Button
              className="CashReceiptCancel_Button"
              color="gray"
              outline={true}
              size="medium"
              onClick={handleCandleCashReceiptButtonClick}
            >
              발급 취소
            </Button><br/>
            <Button
              className="CashReceiptPrint_Button"
              component="a"
              color="gray"
              outline={true}
              size="medium"
              href={cashReceiptUrl}
              target="_blank"
            >
              영수증 인쇄
            </Button>
          </>
        ) : null}
        {isCashReceiptIssuable ? (
          <Button
            className="CashReceiptIssue_Button"
            color="gray"
            outline={true}
            onClick={() => setCashReceiptIssuePopupActive(true)}
            size="medium"
          >
            영수증 발급
          </Button>
        ) : null}
      </div>
      {cashReceiptIssuePopupActive ? (
        <div css={styles.cashReceiptIssueModalColumn}>
          <CashReceiptIssueModal
            id={id}
            closeModal={() => setCashReceiptIssuePopupActive(false)}
          />
        </div>
      ) : null}
    </>
  );
}
