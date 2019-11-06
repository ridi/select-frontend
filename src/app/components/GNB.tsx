import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';
import { ConnectedSearch } from 'app/components/Search';
import { GNBColorLevel } from 'app/services/commonUI';

import { RoutePaths } from 'app/constants';
import {
  getBackgroundColorRGBString,
  getGNBType,
} from 'app/services/commonUI/selectors';
import {
  getIsAndroidInApp,
  getIsIntro,
  getIsIosInApp,
  selectIsInApp,
} from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { moveToLogin } from 'app/utils/utils';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

interface Props {
  gnbType: GNBColorLevel;
  backgroundColorRGBString: string;
  BASE_URL_STORE: string;
  BASE_URL_RIDISELECT: string;
  LIBRARY_URL: string;
  isFetching: boolean;
  isInApp: boolean;
  isIosInApp: boolean;
  isAndroidInApp: boolean;
  isLoggedIn: boolean;
  isSubscribing: boolean;
  isIntro: boolean;
}

interface GNBTab {
  name: string;
  classname: string;
  pathname: string;
  active: boolean;
}

const GNBTabMenus: GNBTab[] = [
  {
    name: '도서',
    classname: 'Books',
    pathname: '',
    active: true,
  },
  {
    name: '아티클',
    classname: 'Article',
    pathname: '',
    active: false,
  },
];

export class GNB extends React.Component<Props> {
  private renderServiceLink() {
    const { isInApp, BASE_URL_STORE } = this.props;
    if (isInApp) {
      return;
    }
    return (
      <ul className="GNBServiceList">
        <li className="GNBService">
          <a
            className="GNBServiceLink Ridibooks_Link"
            href={`${BASE_URL_STORE}`}
          >
            <Icon
              name="logo_ridibooks_1"
              className="GNBServiceLogo RidibooksLogo"
            />
            <h2 className="a11y">리디북스</h2>
          </a>
        </li>
      </ul>
    );
  }

  private renderGNBLogo() {
    return (
      <Link className="GNBLogoWrapper" to={RoutePaths.HOME}>
        <Icon
          name="logo_ridiselect_1"
          className="GNBLogo"
        />
        <h1 className="a11y">리디셀렉트</h1>
      </Link>
    );
  }

  private renderGNBTab() {
    return (
      <nav className={'GnbTab_Wrapper'}>
        <h2 className="a11y">GNB 탭 메뉴</h2>
        <ul className="GnbTab_List">
          {GNBTabMenus.map((menu) => (
            <li className={`GnbTab GnbTab_${menu.classname}`} key={menu.pathname}>
              <Link
                className={classNames(['GnbTab_Link', menu.active && 'GnbTab_Link-active'])}
                to={{
                  pathname: menu.pathname,
                }}
              >
                <h3 className="reset-heading">{menu.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  private renderSettingButton() {
    const { isIosInApp } = this.props;

    return (
      <Link className="GNBSettingButton" to="/settings" key="gnb-setting-link-button">
        <h2 className="a11y">셀렉트 관리</h2>
        {isIosInApp ? (
          // TODO: iosInApp 용 아이콘. 이 외에 사용할 곳이 없어서 별도로 처리할지? 그냥 둘지?
          <svg
            className="SettingIcon_IosInApp"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
          >
            <g
              transform="translate(2.000000, 2.000000)"
              stroke="#339CF2"
              strokeWidth="1.5"
              fill="none"
              fillRule="evenodd"
            >
              {/* tslint:disable-next-line:max-line-length */}
              <path d="M10,10.36125 C12.6597033,10.36125 14.8054167,8.21520292 14.8054167,5.55541667 C14.8054167,2.89572751 12.6598004,0.75 10,0.75 C7.34029668,0.75 5.19458333,2.89604708 5.19458333,5.55583333 C5.19458333,8.21552249 7.34019961,10.36125 10,10.36125 Z M0.75,19.25 L19.25,19.25 L19.25,18.5 C19.25,16.2421197 14.1100323,14.0833333 10,14.0833333 C5.88996766,14.0833333 0.75,16.2421197 0.75,18.5 L0.75,19.25 Z" />
            </g>
          </svg>
        ) : (
          <Icon className="SettingIcon" name="account_1" />
        )}
      </Link>
    );
  }

  private renderLibraryButton() {
    const {
      LIBRARY_URL,
      isInApp,
    } = this.props;

    if (isInApp) { return null; }

    return (
      <a
        href={LIBRARY_URL}
        className="GNB_LinkButton GNB_WebLibrary_Button"
        key="gnb-web-library-link-button"
      >
      내 서재
      </a>
    );
  }

  private renderLoginButton() {
    const {
      isInApp,
    } = this.props;

    if (isInApp) {
      // TODO: 안드로이드 인앱에서 postRobot을 지원하기 전까지는 Toast 메세지를 띄우거나 버튼을 숨김처리.
      return null;
    }

    return (
      <button
        type="button"
        onClick={() => moveToLogin()}
        className="GNB_LinkButton"
      >
        로그인
      </button>
    );
  }

  private renderLogoutButton() {
    const {
      isInApp,
      BASE_URL_STORE,
      BASE_URL_RIDISELECT,
    } = this.props;

    if (isInApp) {
      return null;
    }

    return (
      <a
        href={`${BASE_URL_STORE}/account/logout?return_url=${BASE_URL_RIDISELECT}`}
        className="GNB_LinkButton"
      >
        <h2 className="reset-heading">로그아웃</h2>
      </a>
    );
  }

  private renderGNBAccountButtons() {
    const {
      isIntro,
      isLoggedIn,
      isFetching,
    } = this.props;

    if (isFetching) {
      return null;
    }
    return (
      <div className="GNBRightButtonWrapper">
        {!isLoggedIn ?
          this.renderLoginButton() :
          isIntro ?
            this.renderLogoutButton() :
            [
              this.renderSettingButton(),
              this.renderLibraryButton(),
            ]
        }
      </div>
    );
  }

  private renderGNBSearchButton() {
    const {
      isIntro,
    } = this.props;
    return isIntro ? null : (
      <MediaQuery maxWidth={840}>
        {(matches) => <ConnectedSearch isMobile={matches} />}
      </MediaQuery>
    );
  }

  public render() {
    const {
      gnbType,
      backgroundColorRGBString,
    } = this.props;

    return (
      <header
        className={classNames('GNBWrapper', `GNBWrapper-${gnbType}`)}
      >
        <div className="GNBContentWrapper">
          <div className="GNBLeft">
            {this.renderGNBLogo()}
            {this.renderServiceLink()}
          </div>
          <div className="GNBRight">
            {this.renderGNBSearchButton()}
            {this.renderGNBAccountButtons()}
          </div>
        </div>
        <div className="GNBTab">
          {this.renderGNBTab()}
        </div>
      </header>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState) => ({
  gnbType: getGNBType(rootState),
  backgroundColorRGBString: getBackgroundColorRGBString(rootState),
  LIBRARY_URL: rootState.environment.LIBRARY_URL,
  BASE_URL_STORE: rootState.environment.STORE_URL,
  BASE_URL_RIDISELECT: rootState.environment.SELECT_URL,
  isFetching: rootState.user.isFetching,
  isLoggedIn: rootState.user.isLoggedIn,
  isSubscribing: rootState.user.isSubscribing,
  isInApp: selectIsInApp(rootState),
  isIosInApp: getIsIosInApp(rootState),
  isAndroidInApp: getIsAndroidInApp(rootState),
  isIntro: getIsIntro(rootState),
});

export const ConnectedGNB = connect(mapStateToProps)(GNB);
