import React, { useEffect } from 'react';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


import { FetchStatusFlag, MAX_WIDTH, PageTitleText } from 'app/constants';
import { ConnectedPageHeader, HelmetWithTitle, Pagination } from 'app/components';
import { SubscriptionListPlaceholder } from 'app/placeholder/SubscriptionListPlaceholder';

import { RidiSelectState } from 'app/store';
import { Actions } from 'app/services/user';
import { getPageQuery } from 'app/services/routing/selectors';
import { Actions as CommonUIActions } from 'app/services/commonUI';
import { OrderHistoryList } from 'app/components/OrderHistory/List';

export const OrderHistory: React.FunctionComponent = () => {
  const currentPage = useSelector(getPageQuery);
  const orderHistory = useSelector((state: RidiSelectState) => state.user.purchaseHistory);
  const subscriptionState = useSelector((state: RidiSelectState) => state.user.subscription);
  const subscriptionFetchStatus = useSelector((state: RidiSelectState) => state.user.subscriptionFetchStatus);

  const dispatch = useDispatch();

  const isFetched = () => (
    orderHistory.itemListByPage[currentPage] &&
    orderHistory.itemListByPage[currentPage].fetchStatus !== FetchStatusFlag.FETCHING
  );

  useEffect(() => {
    if (!isFetched()) {
      dispatch(Actions.loadPurchasesRequest({ page: currentPage }));
    }

    if (!subscriptionState) {
      dispatch(Actions.loadSubscriptionRequest());
    }

    dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab: false }));

    return () => {
      dispatch(Actions.clearPurchases());
      dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab: true }));
    }
  }, []);

  useEffect(() => {
    if (!isFetched()) {
      dispatch(Actions.loadPurchasesRequest({ page: currentPage }));
    }
  }, [currentPage]);

  const itemCount: number = orderHistory.itemCount ? orderHistory.itemCount : 0;
  const itemCountPerPage = 10;
  return (
    <main className="SceneWrapper PageOrderHistory">
      <HelmetWithTitle titleName={PageTitleText.ORDER_HISTORY} />
      <ConnectedPageHeader pageTitle={PageTitleText.ORDER_HISTORY} />
      {(
        !isFetched() ||
        subscriptionFetchStatus === FetchStatusFlag.FETCHING ||
        isNaN(currentPage)
      ) ?
        <SubscriptionListPlaceholder />
        : (
          <>
            <OrderHistoryList
              page={currentPage}
            />
            {itemCount > 0 &&
              <>
                <MediaQuery maxWidth={MAX_WIDTH}>
                  {(isMobile) => <Pagination
                    currentPage={currentPage}
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
