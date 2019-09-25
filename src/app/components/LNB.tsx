import { RoutePaths } from 'app/constants';
import { AppStatus } from 'app/services/app';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { getIsAndroidInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import * as classNames from 'classnames';
import { assignIn, flow, omit } from 'lodash-es';
import * as qs from 'qs';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

interface MenuStateProps {
  appStatus: AppStatus;
  isAndroidInApp: boolean;
  isLoggedIn: boolean;
  solidBackgroundColorRGBString: string;
  currentPathname: string;
  currentSearch: string;
  lastSelectedCategoryId?: number;
}

interface Menu {
  name: string;
  classname: string;
  pathname: string;
  pathRegExp: RegExp;
  defaultSearch?: {
    searchKey: string,
    propKeyForValue: keyof MenuStateProps,
  };
}

const menus: Menu[] = [
  {
    name: '홈',
    classname: 'Home',
    pathname: RoutePaths.HOME,
    pathRegExp: /\/home/,
  },
  {
    name: '최신 업데이트',
    classname: 'RecentUpdates',
    pathname: RoutePaths.NEW_RELEASE,
    pathRegExp: /\/new-releases(\/.+)?/,
  },
  {
    name: '카테고리',
    classname: 'Categories',
    pathname: RoutePaths.CATEGORY,
    pathRegExp: /\/categories(\/.+)?/,
    defaultSearch: {
      searchKey: 'id',
      propKeyForValue: 'lastSelectedCategoryId',
    },
  },
  {
    name: '마이 셀렉트',
    classname: 'MySelect',
    pathname: RoutePaths.MY_SELECT,
    pathRegExp: /\/my-select/,
  },
];

const articleMenus: Menu[] = [
  {
    name: '홈',
    classname: 'ArticleHome',
    pathname: RoutePaths.ARTICLE_HOME,
    pathRegExp: /\/article\/home/,
  },
  {
    name: '팔로잉',
    classname: 'ArticleFollowing',
    pathname: RoutePaths.ARTICLE_FOLLOWING,
    pathRegExp: /\/article\/follow/,
  },
  {
    name: '전체 채널',
    classname: 'ArticleChannel',
    pathname: RoutePaths.ARTICLE_CHANNEL,
    pathRegExp: /\/article\/channel/,
  },
  {
    name: '좋아한 아티클',
    classname: 'ArticleStored',
    pathname: RoutePaths.ARTICLE_STORED,
    pathRegExp: /\/article\/store/,
  },
];

function getLNBMenuSearch(menu: Menu, props: MenuStateProps) {
  const { currentPathname, currentSearch } = props;
  return flow(
    (search: string) => qs.parse(search, { ignoreQueryPrefix: true }),
    (parsedSearch: object) => menu.defaultSearch ?
        assignIn(
          parsedSearch,
          { [menu.defaultSearch.searchKey]: props[menu.defaultSearch.propKeyForValue] },
        ) :
        parsedSearch,
    (searchObject: object) => qs.stringify(searchObject, { addQueryPrefix: true }),
  )(currentPathname === menu.pathname ? currentSearch : '');
}

function getFilteredLNBMenu(isAndroidInApp: boolean, isLoggedIn: boolean) {
  if (!isAndroidInApp || isLoggedIn) {
    return menus;
  }
  return menus.filter((menu) => menu.classname !== 'MySelect');
}

export const LNB: React.SFC<MenuStateProps> = (props) => {
  const { isLoggedIn, isAndroidInApp, currentPathname, solidBackgroundColorRGBString, appStatus } = props;
  const filteredMenu = appStatus === AppStatus.Books ? getFilteredLNBMenu(isAndroidInApp, isLoggedIn) : articleMenus;
  return (
    <nav
      className={classNames(
        'LnbMenu_Wrapper',
        `LnbMenu_Wrapper-count${filteredMenu.length}`,
      )}
      style={{ backgroundColor: solidBackgroundColorRGBString }}
    >
      <h2 className="a11y">메인 메뉴</h2>
      <ul className="LnbMenu_List">
        {filteredMenu.map((menu) => (
          <li className={`LnbMenu LnbMenu_${menu.classname}`} key={menu.pathname}>
            <Link
              className={classNames(['LnbMenu_Link', !!currentPathname.match(menu.pathRegExp) && 'LnbMenu_Link-active'])}
              to={{
                pathname: menu.pathname,
                search: getLNBMenuSearch(menu, props),
              }}
            >
              <h3 className="reset-heading">{menu.name}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state: RidiSelectState): MenuStateProps => {
  return {
    appStatus: state.app.appStatus,
    isLoggedIn: state.user.isLoggedIn,
    isAndroidInApp: getIsAndroidInApp(state),
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    currentPathname: state.router.location!.pathname,
    currentSearch: state.router.location!.search,
    lastSelectedCategoryId: state.categories.lastSelectedCategoryId,
  };
};

export const ConnectedLNB = connect(mapStateToProps)(LNB);
