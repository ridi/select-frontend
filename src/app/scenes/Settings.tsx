import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { SettingMenu, SettingMenuItem } from 'app/components/Settings/SettingMenu';
import { ConnectedSubscriptionInfo } from 'app/components/Settings/SubscriptionInfo';
import env from 'app/config/env';
import { FetchStatusFlag, PageTitleText, RoutePaths } from 'app/constants';
import { SettingPlaceholder } from 'app/placeholder/SettingPlaceholder';
import { Actions as CommonUIActions } from 'app/services/commonUI';
import { EnvironmentState } from 'app/services/environment';
import { getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import { Actions, SubscriptionState } from 'app/services/user';
import { RidiSelectState } from 'app/store';
import { DateDTO } from 'app/types';

interface SettingStateProps {
  isFetching: boolean;
  isAccountMeRetried: boolean;
  isLoggedIn: boolean;
  hasAvailableTicket: boolean;
  ticketFetchStatus: FetchStatusFlag;
  subscriptionFetchStatus: FetchStatusFlag;
  subscriptionState?: SubscriptionState | null;
  environment: EnvironmentState;
  isInApp: boolean;
  isIosInApp: boolean;
}

type SettingProps = SettingStateProps & ReturnType<typeof mapDispatchToProps>;

export class Settings extends React.PureComponent<SettingProps> {
  // 도서/리뷰 메뉴
  private renderSubscriptionMenus() {
    const { isIosInApp } = this.props;
    const { STORE_URL } = this.props.environment;
    return (
      <SettingMenu title={'도서 / 리뷰'} icon={'book'} key="Menus About Books">
        <SettingMenuItem
          linkComponent={Link}
          to="/my-select-history"
          key="ReadHistory"
        >
          도서 이용 내역
        </SettingMenuItem>
        <SettingMenuItem
          key="ManageReview"
          href={`${STORE_URL}/review/`}
          target="_self"
          renderCondition={!isIosInApp}
        >
          내 리뷰 관리
        </SettingMenuItem>
      </SettingMenu>
    );
  }

  // 구독/결제 메뉴
  private renderBooksMenus() {
    const { subscriptionState, isIosInApp, hasAvailableTicket } = this.props;
    return (
      <SettingMenu
        title={'구독 / 결제'}
        icon={'card'}
        key="Menus About Subscription"
      >
        <SettingMenuItem
          linkComponent={Link}
          to={RoutePaths.MANAGE_SUBSCRIPTION}
          key="ManageSubscriptions"
          renderCondition={!!subscriptionState}
        >
          구독 관리
        </SettingMenuItem>
        <SettingMenuItem
          linkComponent={Link}
          to="/order-history"
          key="PaymentHistory"
        >
          결제/이용권 내역
        </SettingMenuItem>
        <SettingMenuItem
          href={`${env.PAY_URL}`}
          renderCondition={
            !isIosInApp &&
            ((hasAvailableTicket && !subscriptionState) ||
              (!!subscriptionState && !!subscriptionState.isUsingRidipay))
          }
          key="ManageCard"
        >
          셀렉트 카드 관리
        </SettingMenuItem>
        <SettingMenuItem
          linkComponent={Link}
          to={RoutePaths.VOUCHER}
          renderCondition={!isIosInApp}
          key="Voucher"
        >
          이용권 등록
        </SettingMenuItem>
      </SettingMenu>
    );
  }

  // 개인 메뉴
  private renderUserMenus() {
    const { isIosInApp, environment, isInApp } = this.props;
    const {
      STORE_URL: BASE_URL_STORE,
      SELECT_URL: BASE_URL_RIDISELECT,
    } = environment;

    return !isIosInApp ? (
      <SettingMenu title={'개인'} icon={'user'} key="Menus About User">
        <SettingMenuItem
          href="https://ridihelp.zendesk.com/hc/ko/requests/new"
          target="_blank"
          rel="noopener"
          renderCondition={!isIosInApp}
          key="FAQ"
        >
          1:1 문의하기
        </SettingMenuItem>
        <SettingMenuItem
          href={`${BASE_URL_STORE}/account/modify`}
          target="_self"
          renderCondition={!isIosInApp}
          key="ModifyInfo"
        >
          정보 변경
        </SettingMenuItem>
        <SettingMenuItem
          href={`${BASE_URL_STORE}/account/logout?return_url=${BASE_URL_RIDISELECT}/`}
          target="_self"
          renderCondition={!isInApp}
          key="Logout"
        >
          로그아웃
        </SettingMenuItem>
      </SettingMenu>
    ) : null;
  }

  private renderMenus() {
    return [
      this.renderBooksMenus(),
      this.renderSubscriptionMenus(),
      this.renderUserMenus(),
    ];
  }
  public componentDidMount() {
    const {
      isAccountMeRetried,
      isLoggedIn,
      isFetching,
      dispatchLoadAccountMeRequest,
      dispatchLoadOrderHistory,
      dispatchLoadSubscriptionRequest,
      dispatchUpdateGNBTabExpose,
      subscriptionState,
    } = this.props;

    if (!isLoggedIn && !isFetching && !isAccountMeRetried) {
      dispatchLoadAccountMeRequest();
    }
    dispatchUpdateGNBTabExpose(false);
    dispatchLoadOrderHistory(1);
    if (!subscriptionState) {
      dispatchLoadSubscriptionRequest();
    }
  }

  public componentWillUnmount() {
    this.props.dispatchUpdateGNBTabExpose(true);
  }

  public render() {
    const {
      isLoggedIn,
      subscriptionFetchStatus,
      ticketFetchStatus,
    } = this.props;

    return (
      <main className={classNames('SceneWrapper', 'PageSetting')}>
        <HelmetWithTitle titleName={PageTitleText.SETTING} />
        <ConnectedPageHeader pageTitle={PageTitleText.SETTING} />
        {subscriptionFetchStatus === FetchStatusFlag.IDLE &&
        ticketFetchStatus === FetchStatusFlag.IDLE &&
        isLoggedIn ? 
          <ConnectedSubscriptionInfo />
          : (
            <SettingPlaceholder />
          )}
        {this.renderMenus()}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): SettingStateProps => ({
  isFetching: state.user.isFetching,
  hasAvailableTicket: state.user.hasAvailableTicket,
  ticketFetchStatus: state.user.ticketFetchStatus,
  isAccountMeRetried: state.user.isAccountMeRetried,
  isLoggedIn: state.user.isLoggedIn,
  subscriptionFetchStatus: state.user.subscriptionFetchStatus,
  subscriptionState: state.user.subscription,
  environment: state.environment,
  isInApp: selectIsInApp(state),
  isIosInApp: getIsIosInApp(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchLoadAccountMeRequest: () => dispatch(Actions.loadAccountsMeRequest()),
  dispatchLoadSubscriptionRequest: () =>
    dispatch(Actions.loadSubscriptionRequest()),
  dispatchLoadOrderHistory: (page: number) =>
    dispatch(Actions.loadPurchasesRequest({ page })),
  dispatchUpdateGNBTabExpose: (isGnbTab: boolean) => dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab })),
});

export const ConnectedSetting = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
