import { Button, Icon } from '@ridi/rsg';
import { ConnectedPageHeader } from 'app/components';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { HelmetWithTitle } from 'app/components';
import env from 'app/config/env';
import { PageTitleText } from 'app/constants';
import { SettingPlaceholder } from 'app/placeholder/SettingPlaceholder';
import { EnvironmentState } from 'app/services/environment';
import { getIsAndroidInApp, getIsIosInApp } from 'app/services/environment/selectors';
import { Actions, SubscriptionState } from 'app/services/user';
import { Ticket } from 'app/services/user/requests';
import { RidiSelectState } from 'app/store';
import { buildDateAndTimeFormat, buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';
import * as classNames from 'classnames';

interface SettingStateProps {
  uId: string;
  isFetching: boolean;
  isAccountMeRetried: boolean;
  isLoggedIn: boolean;
  subscriptionState?: SubscriptionState;
  environment: EnvironmentState;
  latestPurchaseTicket: Ticket;
  isPurchaseCancelFetching: boolean;
  isIosInApp: boolean;
  isAndroidInApp: boolean;
}

type SettingProps = SettingStateProps & ReturnType<typeof mapDispatchToProps>;

const CardIconComponent = (props: {className: string; }) => (
  <svg width={48} height={34} {...props}>
    <title>{'icon_card'}</title>
    {/* tslint:disable-next-line:max-line-length */}
    <path d="M4 15h4v-3H4v3zM2 8V6c0-.565.403-1 1-1h18c.597 0 1 .435 1 1v2H2zm20 9.898c0 .588-.519 1.102-1.111 1.102H3.11C2.52 19 2 18.486 2 17.898V10h20v7.898zM3 3C1.376 3 0 4.35 0 6v12c0 1.65 1.376 3 3 3h18c1.624 0 3-1.35 3-3V6c0-1.65-1.376-3-3-3H3z" fillRule="evenodd" />
  </svg>
);

export class Settings extends React.PureComponent<SettingProps> {

  private handleCancelPurchaseButtonClick = (purchaseId: number) => () => {
    if (this.props.isPurchaseCancelFetching) {
      toast.failureMessage('취소 진행중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }
    if (confirm(`결제를 취소하시겠습니까?\n결제를 취소할 경우 즉시 이용할 수 없습니다.`)) {
      this.props.dispatchCancelPurchase(purchaseId);
    }
  }

  public componentDidMount() {
    const {
      isAccountMeRetried,
      isLoggedIn,
      isFetching,
      dispatchLoadAccountMeRequest,
      dispatchLoadOrderHistory,
      dispatchLoadSubscriptionRequest,
    } = this.props;

    if (!isLoggedIn && !isFetching && !isAccountMeRetried) {
      dispatchLoadAccountMeRequest();
    }

    dispatchLoadSubscriptionRequest();
    dispatchLoadOrderHistory(1);
  }

  public renderSubscriptionInfo() {
    const { uId, subscriptionState, isPurchaseCancelFetching, latestPurchaseTicket, environment } = this.props;
    const { ticketStartDate, ticketEndDate, isOptout } = subscriptionState!;
    const isPurchaseCancellable = !!latestPurchaseTicket && latestPurchaseTicket.isCancellable;
    const latestPurchaseId = latestPurchaseTicket && latestPurchaseTicket.id;
    const latestPurchaseDate = latestPurchaseTicket && latestPurchaseTicket.purchaseDate;

    return (
      <div className="SubscriptionInfoWrapper">
        <h3 className="a11y">구독 정보</h3>
        <ul className="SubscriptionInfoList">
          <li className="AccountInfo">
            <p className="AccountInfo_Id">
              <strong className="Id_Text">{uId}</strong><span className="Id_Postfix">님</span>
            </p>
          </li>
          <li className="CurrentSubscriptionInfo">
            <strong className="CurrentSubscriptionInfo_Title">셀렉트 구독</strong>
            <span className="CurrentSubscriptionInfo_Term">
              {`${buildDateAndTimeFormat(ticketStartDate)} ~ ${buildDateAndTimeFormat(ticketEndDate)}`}
            </span>
          </li>
          {
            !!latestPurchaseTicket &&
            !latestPurchaseTicket.isCanceled &&
            latestPurchaseTicket.price !== 0 &&
            <li className="LatestBillDateInfo">
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
          }
          {
            isOptout &&
            <li className="NextSubscriptionInfo NextSubscriptionInfo-canceled">
              <Icon
                name={isOptout ? 'exclamation_3' : 'payment_3'}
                className="NextSubscriptionInfo_Icon"
              />
              구독 해지가 예약되었습니다. 현재 구독 기간까지 이용 가능합니다.
            </li>
          }
        </ul>
      </div>
    );
  }

  public render() {
    const { environment, subscriptionState, isIosInApp, isAndroidInApp } = this.props;
    const { STORE_URL: BASE_URL_STORE, SELECT_URL: BASE_URL_RIDISELECT } = environment;
    const svgPath = 'M45.67,13.079C47.199,11.743,48,10.181,48,8.51c0-4.735-6.352-8.306-14.775-8.306S18.451,3.775,18.451,8.51c0,0.369,0.04,0.735,0.119,1.097c-1.236-0.177-2.506-0.267-3.795-0.267C6.352,9.34,0,12.912,0,17.647c0,1.39,0.574,2.731,1.671,3.922C0.574,22.759,0,24.1,0,25.49c0,4.735,6.352,8.306,14.775,8.306c3.387,0,6.643-0.621,9.225-1.754c2.582,1.133,5.838,1.754,9.225,1.754C41.648,33.796,48,30.225,48,25.49c0-1.39-0.575-2.731-1.672-3.922C47.425,20.378,48,19.037,48,17.647C48,15.976,47.199,14.413,45.67,13.079z M42.13,20.275c-0.302,0.177-0.635,0.343-0.986,0.504c-2.123,0.967-4.936,1.499-7.919,1.499c-1.858,0-3.618-0.199-5.234-0.591c-0.035-0.04-0.071-0.079-0.107-0.119c0.106-0.115,0.207-0.23,0.3-0.345c0.333-0.41,0.616-0.86,0.838-1.335c0.209-0.446,0.349-0.856,0.427-1.254c0.067-0.337,0.101-0.669,0.101-0.988c0-0.369-0.04-0.735-0.12-1.097c1.237,0.177,2.508,0.267,3.795,0.267c3.369,0,6.496-0.583,9.077-1.688c1.274,0.793,2.023,1.717,2.023,2.518c0,0.652-0.495,1.392-1.393,2.084C42.688,19.918,42.424,20.102,42.13,20.275z M41.933,11.245c-0.328,0.183-0.68,0.358-1.063,0.522c-0.415,0.176-0.862,0.337-1.333,0.485c-3.721,1.167-8.901,1.167-12.623,0c-0.472-0.148-0.919-0.308-1.335-0.486c-0.382-0.163-0.735-0.339-1.064-0.522c-1.495-0.835-2.389-1.857-2.389-2.733c0-1.934,4.222-4.631,11.099-4.631s11.1,2.697,11.1,4.631C44.325,9.386,43.431,10.409,41.933,11.245z M25.874,17.647c0,0.279-0.099,0.587-0.295,0.916c-0.236,0.395-0.605,0.787-1.127,1.191l-0.184,0.141c-0.184,0.131-0.38,0.258-0.59,0.381l0.439,0.748l-0.549-0.688c-0.271,0.155-0.566,0.303-0.906,0.459l-0.254,0.115c-0.246,0.104-0.505,0.202-0.773,0.297c-0.428,0.152-0.882,0.291-1.363,0.415c-1.688,0.436-3.538,0.657-5.498,0.657c-2.983,0-5.795-0.532-7.917-1.499c-0.351-0.159-0.684-0.325-0.983-0.502c-0.296-0.175-0.561-0.358-0.806-0.547c-0.898-0.694-1.393-1.433-1.393-2.084c0-1.934,4.223-4.63,11.099-4.63c2.513,0,4.885,0.37,6.86,1.07c0.354,0.127,0.687,0.262,1.004,0.404c0.332,0.148,0.644,0.305,0.931,0.469C25.012,15.784,25.874,16.789,25.874,17.647z M4.642,23.766c2.712,1.413,6.28,2.187,10.132,2.187c1.62,0,3.23-0.145,4.784-0.429c0.377-0.069,0.748-0.143,1.11-0.228c0.431-0.102,0.85-0.213,1.258-0.334c0.858-0.258,1.681-0.57,2.442-0.928c0.184-0.087,0.364-0.175,0.539-0.267c0.285,0.265,0.509,0.537,0.672,0.809c0.195,0.328,0.295,0.636,0.295,0.915c0,0.857-0.862,1.863-2.305,2.687c-0.288,0.165-0.599,0.321-0.931,0.47c-0.316,0.141-0.648,0.277-1.002,0.402c-1.975,0.701-4.348,1.072-6.861,1.072c-6.877,0-11.099-2.697-11.099-4.631C3.675,24.951,4.015,24.35,4.642,23.766z M29.545,25.701c1.207,0.167,2.441,0.252,3.68,0.252c3.853,0,7.421-0.774,10.133-2.187c0.627,0.584,0.967,1.184,0.967,1.724c0,1.934-4.223,4.631-11.1,4.631c-1.925,0-3.767-0.217-5.412-0.634C28.898,28.342,29.489,27.057,29.545,25.701z'; // tslint:disable-line

    return (
      <main
        className={classNames(
          'SceneWrapper',
          'PageSetting',
        )}
      >
        <HelmetWithTitle titleName={PageTitleText.SETTING} />
        <ConnectedPageHeader pageTitle={PageTitleText.SETTING} />
        {!!subscriptionState ?
          this.renderSubscriptionInfo() : (
            <SettingPlaceholder />
          )
        }
        <ul className="SettingMenu">
          <li className="SettingMenu_Item">
            <Link className="SettingMenu_Link" to="/manage-subscription">
              <Icon name="invoice_1" className="SettingMenu_Icon SettingMenu_Invoice_Icon" />
              구독 관리
            </Link>
          </li>
          <li className="SettingMenu_Item">
            <Link className="SettingMenu_Link" to="/order-history">
              {/* TODO: RIDI UI의 Coin_Bold Icon: 버젼 올리고 대응 필요. - svg 이슈로 업데이트 됨 */}
              <svg x="0px" y="0px" width="48px" height="34px" viewBox="0 0 48 34" className="SettingMenu_Icon SettingMenu_Payment_Icon" >
                <path d={svgPath}/>
              </svg>
              결제 내역
            </Link>
          </li>
        { subscriptionState &&
          subscriptionState.isUsingRidipay &&
          !isIosInApp &&
          <li className="SettingMenu_Item">
            <a className="SettingMenu_Link" href={`${env.PAY_URL}`}>
              <CardIconComponent className="SettingMenu_Icon SettingMenu_Card_Icon" />
              셀렉트 카드 관리
            </a>
          </li>
        }
        </ul>
        {isIosInApp ? (
          <ul className="SettingMenu">
            <li className="SettingMenu_Item">
              <Link to="/my-select-history" className="SettingMenu_Link">
                <Icon name="history_1" className="SettingMenu_Icon SettingMenu_History_Icon" />
                도서 이용 내역
              </Link>
            </li>
          </ul>
        ) : (
          <>
            <ul className="SettingMenu">
              <li className="SettingMenu_Item">
                <Link to="/my-select-history" className="SettingMenu_Link">
                  <Icon name="history_1" className="SettingMenu_Icon SettingMenu_History_Icon" />
                  도서 이용 내역
                </Link>
              </li>
              <li className="SettingMenu_Item">
                <a
                  className="SettingMenu_Link"
                  href={`${BASE_URL_STORE}/review/`}
                  target="_self"
                >
                  <Icon name="pencil_2" className="SettingMenu_Icon SettingMenu_Review_Icon" />
                  내 리뷰 관리
                </a>
              </li>
            </ul>
            <ul className="SettingMenu">
            <li className="SettingMenu_Item">
                <a
                  className="SettingMenu_Link"
                  href="https://ridihelp.zendesk.com/hc/ko/requests/new"
                  target="_blank"
                >
                  <Icon name="speechbubble_5" className="SettingMenu_Icon SettingMenu_FAQ_Icon" />
                  1:1 문의하기
                </a>
              </li>
              <li className="SettingMenu_Item">
                <a
                  className="SettingMenu_Link"
                  href={`${BASE_URL_STORE}/account/modify`}
                  target="_self"
                >
                  <Icon name="identity_1" className="SettingMenu_Icon SettingMenu_ModifyInfo_Icon" />
                  정보 변경
                </a>
              </li>
              {!isAndroidInApp && (
                <li className="SettingMenu_Item">
                  <a
                    className="SettingMenu_Link"
                    href={`${BASE_URL_STORE}/account/logout?return_url=${BASE_URL_RIDISELECT}/`}
                    target="_self"
                  >
                    <Icon name="exit_1" className="SettingMenu_Icon SettingMenu_Logout_Icon" />
                    로그아웃
                  </a>
                </li>
              )}
            </ul>
          </>
        )}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): SettingStateProps => {
  return {
    uId: state.user.uId,
    isFetching: state.user.isFetching,
    isAccountMeRetried: state.user.isAccountMeRetried,
    isLoggedIn: state.user.isLoggedIn,
    subscriptionState: state.user.subscription,
    environment: state.environment,
    latestPurchaseTicket: !!state.user.purchaseHistory.itemListByPage[1] && state.user.purchaseHistory.itemListByPage[1].itemList[0],
    isPurchaseCancelFetching: state.user.purchaseHistory.isCancelFetching,
    isIosInApp: getIsIosInApp(state),
    isAndroidInApp: getIsAndroidInApp(state),
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchLoadAccountMeRequest: () => dispatch(Actions.loadAccountsMeRequest()),
  dispatchLoadSubscriptionRequest: () => dispatch(Actions.loadSubscriptionRequest()),
  dispatchLoadOrderHistory: (page: number) => dispatch(Actions.loadPurchasesRequest({ page })),
  dispatchClearPurchases: () => dispatch(Actions.clearPurchases()),
  dispatchCancelPurchase: (purchaseId: number) => dispatch(Actions.cancelPurchaseRequest({ purchaseId })),
});

export const ConnectedSetting = connect(mapStateToProps, mapDispatchToProps)(Settings);
