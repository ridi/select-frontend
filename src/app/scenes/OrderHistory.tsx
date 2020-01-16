import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import { Button, Empty } from '@ridi/rsg';

import { ConnectedPageHeader, HelmetWithTitle, Pagination } from 'app/components';
import { FetchStatusFlag, MAX_WIDTH, PageTitleText } from 'app/constants';
import { SubscriptionListPlaceholder } from 'app/placeholder/SubscriptionListPlaceholder';

import { Actions as CommonUIActions } from 'app/services/commonUI';
import { getPageQuery } from 'app/services/routing/selectors';
import { Actions, PurchaseHistory, SubscriptionState } from 'app/services/user';
import { Ticket } from 'app/services/user/requests';
import { RidiSelectState } from 'app/store';
import { buildDateAndTimeFormat, buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';

interface OrderStateProps {
  orderHistory: PurchaseHistory;
  subscriptionFetchStatus: FetchStatusFlag;
  subscriptionState?: SubscriptionState | null;
  page: number;
}

type Props = OrderStateProps & ReturnType<typeof mapDispatchToProps>;

export class OrderHistory extends React.PureComponent<Props> {
  private handleCancelPurchaseButtonClick = (payment: Ticket) => () => {
    const { orderHistory, dispatchCancelPurchase, subscriptionState } = this.props;
    const { id, ticketIdsToBeCanceledWith } = payment;

    if (orderHistory.isCancelFetching) {
      toast.failureMessage('취소 진행중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }
    const comfirmMessageBlocks = [];

    if (subscriptionState && subscriptionState.isSubscribedWithOldPrice) {
      comfirmMessageBlocks.push(`\n결제 금액이 인상되어 결제 취소 이후\n월 ${subscriptionState.formattedNewMonthlyPayPrice}이 적용됩니다.`);
    }
    if (ticketIdsToBeCanceledWith.length > 0) {
      comfirmMessageBlocks.push(`${comfirmMessageBlocks.length > 0 ? '\n\n' : '\n'}미사용된 이용권이 함께 취소되며 이용권은 유효기간 내에 다시 등록 가능합니다.`);
    }
    if (comfirmMessageBlocks.length <= 0) {
      comfirmMessageBlocks.push('\n결제를 취소할 경우 즉시 이용할 수 없습니다.');
    }

    if (confirm(`결제를 취소하시겠습니까?${comfirmMessageBlocks.join('')}`)) {
      dispatchCancelPurchase(id);
    }
  }
  private getPaymentMethodTypeName = (payment: Ticket) => {
    const suffix = payment.isCanceled ? ' (취소됨)' : '';
    return `${payment.paymentMethod}${suffix}`;
  }

  private renderHistoryInfo = (payment: Ticket) => (
    <>
      <p className="Ordered_Date">{buildDateAndTimeFormat(payment.purchaseDate)}</p>
      <p className="Ordered_Name">
        {payment.title}
        {payment.voucherCode && !payment.isFreePromotion ? (
          <>
            <span className="Ordered_VoucherInfo">{payment.voucherCode.match(/.{1,4}/g)!.join('-')} ({buildOnlyDateFormat(payment.voucherExpireDate)}까지)</span>
            <span className="Ordered_Term">이용 기간: {buildOnlyDateFormat(payment.startDate)}~{buildOnlyDateFormat(payment.endDate)}</span>
          </>
        ) : null}
      </p>
      <p className="Ordered_Type">{this.getPaymentMethodTypeName(payment)}</p>
    </>
  )

  private renderAmountInfo = (payment: Ticket, shouldDisplayCancel: boolean) => {
    const { isFreePromotion, formattedPrice, voucherCode, isCancellable, id } = payment;
    return (
      <>
        <p className="Ordered_Amount">
          {isFreePromotion
            ? '무료'
            : voucherCode ? '' : formattedPrice}
        </p>
        {shouldDisplayCancel && (
          <div className="CancelOrderButton_Wrapper">
            {isCancellable && (
              <Button
                className="CancelOrderButton"
                color="gray"
                outline={true}
                onClick={this.handleCancelPurchaseButtonClick(payment)}
                size="medium"
              >
                결제 취소
              </Button>
            )}
          </div>
        )}
      </>
    );
  }

  private isFetched = (page: number) => {
    const { orderHistory } = this.props;
    return (!!orderHistory.itemListByPage[page] && orderHistory.itemListByPage[page].fetchStatus !== FetchStatusFlag.FETCHING);
  }

  public renderItems = (page: number) => {
    const { orderHistory } = this.props;
    const { itemList } = orderHistory.itemListByPage[page];
    if (!itemList || itemList.length === 0) {
      return (
        <Empty description="결제/이용권 내역이 없습니다." iconName="book_1" />
      );
    }
    const cancelableItemExists = itemList.some((item) => item.isCancellable);
    return (
      <ul className="OrderHistoryList">
        <MediaQuery maxWidth={MAX_WIDTH}>
          {(isMobile) => itemList.map((item) => (
            <li
              className={classNames({
                'OrderHistoryItem': true,
                'OrderHistoryItem-canceled': item.isCanceled,
              })}
              key={item.id}
            >
              {isMobile ? (
                <>
                  <div className="OrderHistoryItem_Info">{this.renderHistoryInfo(item)}</div>
                  <div className="OrderHistoryItem_AmountInfo">
                    {this.renderAmountInfo(item, cancelableItemExists)}
                  </div>
                </>
              ) : (
                <>
                  {this.renderHistoryInfo(item)}
                  {this.renderAmountInfo(item, cancelableItemExists)}
                </>
              )}
            </li>
          ))}
        </MediaQuery>
      </ul>
    );
  }

  public componentDidMount() {
    const {
      dispatchLoadOrderHistory,
      dispatchUpdateGNBTabExpose,
      dispatchLoadSubscriptionRequest,
      subscriptionState,
      page,
    } = this.props;
    if (!this.isFetched(page)) {
      dispatchLoadOrderHistory(page);
    }
    if (!subscriptionState) {
      dispatchLoadSubscriptionRequest();
    }
    dispatchUpdateGNBTabExpose(false);
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page) {
      const { dispatchLoadOrderHistory, page } = nextProps;

      if (!this.isFetched(page)) {
        dispatchLoadOrderHistory(page);
      }
    }
    return true;
  }

  public componentWillUnmount() {
    this.props.dispatchClearPurchases();
    this.props.dispatchUpdateGNBTabExpose(true);
  }

  public render() {
    const { page, orderHistory, subscriptionFetchStatus } = this.props;

    const itemCount: number = orderHistory.itemCount ? orderHistory.itemCount : 0;
    const itemCountPerPage = 10;
    return (
      <main
        className={classNames(
          'SceneWrapper',
          'PageOrderHistory',
        )}
      >
        <HelmetWithTitle titleName={PageTitleText.ORDER_HISTORY} />
        <ConnectedPageHeader pageTitle={PageTitleText.ORDER_HISTORY} />
        {(
          !this.isFetched(page) ||
          subscriptionFetchStatus === FetchStatusFlag.FETCHING ||
          isNaN(page)
        ) ? 
          <SubscriptionListPlaceholder />
          : (
            <>
              {this.renderItems(this.props.page)}
              {itemCount > 0 &&
                <>
                  <MediaQuery maxWidth={MAX_WIDTH}>
                    {(isMobile) => <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(itemCount / itemCountPerPage)}
                      isMobile={isMobile}
                      item={{
                        el: Link,
                        getProps: (p): LinkProps => ({
                          to: `/order-history?page=${p}`,
                        }),
                      }}
                    />}
                  </MediaQuery>
                  <ul className="NoticeList">
                    <li className="NoticeItem">결제 취소는 결제일로부터 7일 이내 이용권 대상 도서를 1권 이상 다운로드하지 않는 경우에만 가능합니다.</li>
                    <li className="NoticeItem">결제 취소 시 리디셀렉트 구독이 자동으로 해지됩니다.</li>
                  </ul>
                </>
              }
            </>
          )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): OrderStateProps => ({
  orderHistory: rootState.user.purchaseHistory,
  subscriptionFetchStatus: rootState.user.subscriptionFetchStatus,
  subscriptionState: rootState.user.subscription,
  page: getPageQuery(rootState),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLoadOrderHistory: (page: number) => dispatch(Actions.loadPurchasesRequest({ page })),
  dispatchLoadSubscriptionRequest: () => dispatch(Actions.loadSubscriptionRequest()),
  dispatchClearPurchases: () => dispatch(Actions.clearPurchases()),
  dispatchCancelPurchase: (purchaseId: number) => dispatch(Actions.cancelPurchaseRequest({ purchaseId })),
  dispatchUpdateGNBTabExpose: (isGnbTab: boolean) => dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab })),
});

export const ConnectedOrderHistory = connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
