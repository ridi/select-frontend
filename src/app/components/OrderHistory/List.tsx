import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';

import { Empty } from '@ridi/rsg';

import { MAX_WIDTH } from 'app/constants';
import { RidiSelectState } from 'app/store';
import { OrderHistoryListInfo } from 'app/components/OrderHistory/Info';
import { OrderHistoryListAmountInfo } from 'app/components/OrderHistory/AmountInfo';

interface OrderHistoryListProps {
  page: number;
}

export const OrderHistoryList: React.FunctionComponent<OrderHistoryListProps> = (props) =>  {
  const { page } = props;
  const orderHistory = useSelector((state: RidiSelectState) => state.user.purchaseHistory);
  const { itemList } = orderHistory.itemListByPage[page];

  if (!itemList || itemList.length === 0) {
    return (
      <Empty description="결제/이용권 내역이 없습니다." iconName="book_1" />
    );
  }
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
                <div className="OrderHistoryItem_Info">
                  <OrderHistoryListInfo payment={item} />
                </div>
                <div className="OrderHistoryItem_AmountInfo">
                  <OrderHistoryListAmountInfo
                    payment={item}
                  />
                </div>
              </>
            ) : (
              <>
                <OrderHistoryListInfo payment={item} />
                <OrderHistoryListAmountInfo
                  payment={item}
                />
              </>
            )}
          </li>
        ))}
      </MediaQuery>
    </ul>
  );
}
