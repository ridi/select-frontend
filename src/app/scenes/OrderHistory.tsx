import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link, LinkProps } from 'react-router-dom';
import { Dispatch } from 'redux';

import MediaQuery from 'react-responsive';

import * as classNames from 'classnames';

import { ConnectedPageHeader } from 'app/components';
import { Pagination } from 'app/components/Pagination';
import { FetchStatusFlag } from 'app/constants';

import { SubscriptionListPlaceholder } from 'app/placeholder/SubscriptionListPlaceholder';

import { Actions, PurchaseHistory } from 'app/services/user';
import { Ticket } from 'app/services/user/requests';
import { RidiSelectState } from 'app/store';
import { buildDateAndTimeFormat } from 'app/utils/formatDate';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import toast from 'app/utils/toast';

import { Button, Empty } from '@ridi/rsg';
import { getPageQuery } from 'app/services/routing/selectors';

interface OrderStateProps {
  orderHistory: PurchaseHistory;
  page: number;
}

type Props = OrderStateProps & ReturnType<typeof mapDispatchToProps>;

export class OrderHistory extends React.PureComponent<Props> {
  private handleCancelPurchaseButtonClick = (purchaseId: number) => () => {
    const { orderHistory, dispatchCancelPurchase } = this.props;

    if (orderHistory.isCancelFetching) {
      toast.failureMessage('취소 진행중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }
    if (confirm(`결제를 취소하시겠습니까?\n결제를 취소할 경우 즉시 이용할 수 없습니다.`)) {
      dispatchCancelPurchase(purchaseId);
    }
  }
  private getPaymentMethodTypeName = (payment: Ticket) => {
    const suffix = payment.isCanceled ? ' (취소됨)' : '';
    return `${payment.paymentMethod}${suffix}`;
  }

  private renderHistoryInfo = (payment: Ticket) => {
    return (
      <>
        <p className="Ordered_Date">{buildDateAndTimeFormat(payment.purchaseDate)}</p>
        <p className="Ordered_Name">{payment.title}</p>
        <p className="Ordered_Type">{this.getPaymentMethodTypeName(payment)}</p>
      </>
    );
  }

  private renderAmountInfo = (payment: Ticket, shouldDisplayCancel: boolean) => {
    return (
      <>
        <p className="Ordered_Amount">
          {payment.price === 0 ? '무료' : `${thousandsSeperator(payment.price)}원`}
        </p>
        {shouldDisplayCancel && (
          <div className="CancelOrderButton_Wrapper">
            {payment.isCancellable && (
              <Button
                className="CancelOrderButton"
                color="gray"
                outline={true}
                onClick={this.handleCancelPurchaseButtonClick(payment.id)}
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
        <Empty description="결제 내역이 존재하지 않습니다." iconName="book_1" />
      );
    }
    const cancelableItemExists = itemList.some((item) => item.isCancellable);
    return (
      <ul className="OrderHistoryList">
        <MediaQuery maxWidth={840}>
          {(isMobile) => {
            return itemList.map((item) => (
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
            ));
          }}
        </MediaQuery>
      </ul>
    );
  }

  public componentDidMount() {
    const { dispatchLoadOrderHistory, page } = this.props;
    if (!this.isFetched(page)) {
      dispatchLoadOrderHistory(page);
    }
  }

  public componentWillUnmount() {
    this.props.dispatchClearPurchases();
  }

  public render() {
    const { page, orderHistory } = this.props;

    const itemCount: number = orderHistory.itemCount ? orderHistory.itemCount : 0;
    const itemCountPerPage: number = 24;
    return (
      <main className="SceneWrapper PageOrderHistory">
        <Helmet title="결제 내역 - 리디셀렉트" />
        <ConnectedPageHeader pageTitle="결제 내역" />
        {(
          !this.isFetched(page) || isNaN(page)
        ) ? (
          <SubscriptionListPlaceholder />
        ) : (
          <>
          {this.renderItems(this.props.page)}
          {itemCount > 0 && <MediaQuery maxWidth={840}>
            {
              (isMobile) => <Pagination
                currentPage={page}
                totalPages={Math.ceil(itemCount / itemCountPerPage)}
                isMobile={isMobile}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `/order-history?page=${p}`,
                  }),
                }}
              />
            }
          </MediaQuery>}
          </>
        )}

        <ul className="NoticeList">
          <li className="NoticeItem">결제 취소는 결제일로부터 7일 이내 이용권 대상 도서를 1권 이상 다운로드하지 않는 경우에만 가능합니다.</li>
          <li className="NoticeItem">결제 취소 시 리디셀렉트 구독이 자동으로 해지됩니다.</li>
        </ul>
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): OrderStateProps => {
  return {
    orderHistory: rootState.user.purchaseHistory,
    page: getPageQuery(rootState),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchLoadOrderHistory: (page: number) => dispatch(Actions.loadPurchasesRequest({ page })),
    dispatchClearPurchases: () => dispatch(Actions.clearPurchases()),
    dispatchCancelPurchase: (purchaseId: number) => dispatch(Actions.cancelPurchaseRequest({ purchaseId })),
  };
};

export const ConnectedOrderHistory = connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
