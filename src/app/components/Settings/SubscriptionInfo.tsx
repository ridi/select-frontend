import { Button, Icon } from '@ridi/rsg';
import { FetchStatusFlag, RoutePaths } from 'app/constants';
import { Actions, SubscriptionState } from 'app/services/user';
import { Ticket } from 'app/services/user/requests';
import { RidiSelectState } from 'app/store';
import { DateDTO } from 'app/types';
import { buildDateAndTimeFormat, buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

interface SubscriptionInfoStateProps {
  uId: string;
  BASE_URL_STORE: string;
  ticketEndDate?: DateDTO;
  hasSubscribedBefore: boolean;
  subscriptionState?: SubscriptionState | null;
  latestPurchaseTicket: Ticket;
  isPurchaseCancelFetching: boolean;
}

type SubscriptionInfoProps = SubscriptionInfoStateProps & ReturnType<typeof mapDispatchToProps>;
class SubscriptionInfo extends React.PureComponent<SubscriptionInfoProps> {
  private handleCancelPurchaseButtonClick = (purchaseId: number) => () => {
    if (this.props.isPurchaseCancelFetching) {
      toast.failureMessage('취소 진행중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }
    if (confirm(`결제를 취소하시겠습니까?\n결제를 취소할 경우 즉시 이용할 수 없습니다.`)) {
      this.props.dispatchCancelPurchase(purchaseId);
    }
  }

  private renderAccountInfo() {
    const { uId } = this.props;

    return (
      <li className="AccountInfo">
        <p className="AccountInfo_Id">
          <strong className="Id_Text">{uId}</strong><span className="Id_Postfix">님</span>
        </p>
      </li>
    );
  }

  private renderSubscriptionTermInfo() {
    const { ticketEndDate } = this.props;

    return (
      <li className="CurrentSubscriptionInfo" key="current-subscription-info">
        <strong className="CurrentSubscriptionInfo_Title">셀렉트 구독</strong>
        <span className="CurrentSubscriptionInfo_Term">
          {`${buildDateAndTimeFormat(ticketEndDate)} 까지`}
        </span>
      </li>
    );
  }

  private renderLatestBillDateInfo() {
    const { isPurchaseCancelFetching, latestPurchaseTicket } = this.props;
    const isPurchaseCancellable = !!latestPurchaseTicket && latestPurchaseTicket.isCancellable;
    const latestPurchaseId = latestPurchaseTicket && latestPurchaseTicket.id;
    const latestPurchaseDate = latestPurchaseTicket && latestPurchaseTicket.purchaseDate;

    if (
      !latestPurchaseTicket ||
      latestPurchaseTicket.isCanceled ||
      latestPurchaseTicket.price === 0
    ) {
      return null;
    }

    return (
      <li className="LatestBillDateInfo" key="latest-bill-date-info">
        <strong className="LatestBillDateInfo_Title">최근 결제일</strong>
        <span className="LatestBillDateInfo_Term">
        {`${buildOnlyDateFormat(latestPurchaseDate)}`}
          {isPurchaseCancellable && latestPurchaseId &&
            <span className="CancelSubscriptionButton_Wrapper">
              <Button
                color="gray"
                size="small"
                className="CancelSubscriptionButton"
                onClick={this.handleCancelPurchaseButtonClick(latestPurchaseId)}
                spinner={isPurchaseCancelFetching}
              >
                결제 취소
              </Button>
            </span>
          }
        </span>
      </li>
    );
  }
  private renderCancelReservedInfo() {
    const { subscriptionState } = this.props;
    const { isOptout } = subscriptionState!;

    return isOptout && (
      <li className="NextSubscriptionInfo NextSubscriptionInfo-canceled" key="subscription-cancel-reserved-info">
        <Icon
          name={isOptout ? 'exclamation_3' : 'payment_3'}
          className="NextSubscriptionInfo_Icon"
        />
        구독 해지가 예약되었습니다. 현재 구독 기간까지 이용 가능합니다.
      </li>
    );
  }

  private renderSubscribeButton() {
    const { hasSubscribedBefore, BASE_URL_STORE } = this.props;

    return (
      <Button
        className="SubscribeToUseButton"
        component="a"
        color="blue"
        size="large"
        href={`${BASE_URL_STORE}/select/payments`}
      >
        {hasSubscribedBefore ? '리디셀렉트 구독하기' : '1개월 무료로 읽어보기'}
      </Button>
    );
  }

  public render() {
    const { subscriptionState } = this.props;
    return (
      <div className="SubscriptionInfoWrapper">
        <h3 className="a11y">구독 정보</h3>
        <ul className="SubscriptionInfoList">
          {this.renderAccountInfo()}
          {subscriptionState ? [
            this.renderSubscriptionTermInfo(),
            this.renderLatestBillDateInfo(),
            this.renderCancelReservedInfo(),
          ] : this.renderSubscribeButton()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): SubscriptionInfoStateProps => {
  return {
    uId: state.user.uId,
    BASE_URL_STORE: state.environment.STORE_URL,
    ticketEndDate: state.user.ticketEndDate,
    subscriptionState: state.user.subscription,
    hasSubscribedBefore: state.user.hasSubscribedBefore,
    latestPurchaseTicket: !!state.user.purchaseHistory.itemListByPage[1] && state.user.purchaseHistory.itemListByPage[1].itemList[0],
    isPurchaseCancelFetching: state.user.purchaseHistory.isCancelFetching,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchCancelPurchase: (purchaseId: number) => dispatch(Actions.cancelPurchaseRequest({ purchaseId })),
});

export const ConnectedSubscriptionInfo = connect(mapStateToProps, mapDispatchToProps)(SubscriptionInfo);
