import * as qs from 'qs';

import request from 'app/config/axios';
import env from 'app/config/env';
import { store } from 'app/store';
import { BookId } from 'app/types';
import { getBaseUrl } from 'app/utils/getBaseUrl';
import { stateHydrator } from 'app/utils/stateHydrator';
import toast from 'app/utils/toast';

// ridibooks.com/api/user_books/trigger_download
// b_ids[], preprocess
// 마이 셀렉트에 있으면 바로 앱 트리거*
// 서점에 있으면 추가 confirm 후 앱 트리거* -> saga에서 bookstate에 따라 처리
// 추후 페이퍼 대비 필요

const DOWNLOAD_URL = env.production
  ? '//ridibooks.com/api/user_books/trigger_download' :
  `//${getBaseUrl(location.host)}/api/user_books/trigger_download`;

export const IOS_APPSTORE_URL = 'http://itunes.apple.com/kr/app/id338813698?mt=8';
export const ANDROID_APPSTORE_URL = 'https://play.google.com/store/apps/details?id=com.initialcoms.ridi';
export const PC_DOWNLOAD_IFRAME_ID = 'bookDownloadIframe';

interface PlatformDetail {
  isIos: boolean;
  isAndroid: boolean;
  isIE: boolean;
  isFirefox: boolean;
  isRidiApp: boolean;
}

export function getPlatformDetail(): PlatformDetail {
  return {
    isIos: (/iphone|ipad|ipod/gi).test(navigator.appVersion),
    isAndroid: (/android/gi).test(navigator.appVersion),
    isIE: (/MSIE|Trident\//g).test(navigator.appVersion),
    isFirefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    isRidiApp: (/RIDIBOOKS\/[0-9]+\.[0-9]*/).test(navigator.userAgent),
  };
}

export function getAppUri(bookIds: number[], appUriFromResponse: string, isRead: boolean) {
  const bookIdData = isRead ?
    `&b_id=${bookIds[0]}` :
    `&payload=${encodeURIComponent(JSON.stringify({ b_ids: bookIds }))}`;
  return `${appUriFromResponse}${bookIdData}`;
}

// 앱 호출 URI를 안드로이드 intent를 이용해 호출할 수 있는 URI로 변환해주는 함수
function convertUriToAndroidIntentUri(appUri: string, packageName: string) {
  const scheme = /(.+):\/\//.exec(appUri)![1];
  /* tslint:disable-next-line:max-line-length */
  return `${appUri.replace(`${scheme}://`, 'intent://')}#Intent;scheme=${scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=${packageName};end`;
}

export function setAttributeForDesktopDownloadIframe(attrName: string, attrValue: string) {
  const iframe = document.getElementById(PC_DOWNLOAD_IFRAME_ID);
  if (iframe) {
    iframe.setAttribute(attrName, attrValue);
  }
}

export function requestDownloadUserBook(bookIds: number[], preprocess: boolean, isRead: boolean) {
  return request({
    url: DOWNLOAD_URL,
    method: 'GET',
    params: {
      b_ids: bookIds,
      preprocess,
      is_read: isRead,
    },
    withCredentials: true,
  }).then((response) => {
    if (response.data.result) {
      return Promise.resolve(getAppUri(response.data.b_ids, response.data.url, isRead));
    } else {
      return Promise.reject(response.data.message);
    }
  }).catch(() => {
    toast.failureMessage();
  });
}

// Trigger App
// In app Download
export function downloadUserBookInApp(appUri: string) {
  // 6.x 버전까지는 goDownload 지원 필요
  const uri = (Number(window.navigator.appVersion) <= 6.30)
    ? 'app:/goDownload/'
    : appUri;
  window.location.assign(uri);
}

// Launch app
export function moveToAppStore(platformDetail: PlatformDetail) {
  if (platformDetail.isIos) {
    window.location.replace(
      `${window.location.pathname}?${qs.stringify({
        ...qs.parse(window.location.search, { ignoreQueryPrefix: true }),
        to_app_store: true,
      })}`,
    );
  } else if (platformDetail.isAndroid) {
    window.location.assign(ANDROID_APPSTORE_URL);
  } else {
    // cancel launchAppFromDesktopBrowser
    setAttributeForDesktopDownloadIframe('src', '');
    toast.info(
      '리디북스 뷰어 내 구매 목록에서 다운로드해주세요.',
      {
        link: {
          url: `//${getBaseUrl(window.location.host)}/support/app/download`,
          label: '뷰어 다운로드',
          showArrowIcon: true,
        },
        durationMs: 8000,
      },
    );
  }
}

export function launchAppOrMoveToAppStore(appUri: string, hooks?: DownloaBooksHooks) {
  const platformDetail = getPlatformDetail();
  const appStoreTimer = window.setTimeout(() => {
    if (hooks && hooks.beforeMoveToAppStore) {
      hooks.beforeMoveToAppStore(platformDetail);
    }
    moveToAppStore(platformDetail);
  }, 1500);

  if (platformDetail.isIos) {
    setTimeout(() => {
      if (hooks && hooks.beforeLaunchApp) {
        hooks.beforeLaunchApp(platformDetail);
      }
      try {
        window.location.assign(appUri);
      } catch (e) {
        // TODO: Handle error.
      }
      clearTimeout(appStoreTimer);
    }, 300);
    // launchAppFromIos(appUri);
  } else if (platformDetail.isAndroid) {
    const androidUri = platformDetail.isFirefox ? appUri : convertUriToAndroidIntentUri(appUri, 'com.initialcoms.ridi');
    setTimeout(() => {
      if (hooks && hooks.beforeLaunchApp) {
        hooks.beforeLaunchApp(platformDetail);
      }
      try {
        window.location.assign(androidUri);
      } catch (e) {
        window.location.assign(appUri);
      }
      clearTimeout(appStoreTimer);
    }, 300);
    // launchAppFromAndroid(platformDetail, appUri, appStoreTimer);
  } else {
    if (hooks && hooks.beforeLaunchApp) {
      hooks.beforeLaunchApp(platformDetail);
    }
    setAttributeForDesktopDownloadIframe('src', appUri);
    // launchAppFromDesktopBrowser(appUri);
  }
}

export interface DownloaBooksHooks {
  beforeRequestDownloadUrl?: () => any;
  afterRequestDownloadUrlSuccess?: (url: string) => any;
  beforeLaunchApp?: (platformDetail: PlatformDetail) => any;
  beforeMoveToAppStore?: (platformDetail: PlatformDetail) => any;
}

export const downloadBooks = (bookIds: BookId[], hooks?: DownloaBooksHooks) => {
  if (hooks && hooks.beforeRequestDownloadUrl) {
    hooks.beforeRequestDownloadUrl();
  }
  requestDownloadUserBook(bookIds, true, false).then((url) => {
    if (url) {
      launchAppOrMoveToAppStore(url, hooks);
    }
  });
};

export const downloadBooksInRidiselect = (bookIds: BookId[]) => {
  downloadBooks(bookIds, {
    beforeMoveToAppStore: (platformDetail) => {
      if (platformDetail.isIos) {
        stateHydrator.save(store.getState());
      }
    },
  });
};

export const readBooksInRidiselect = (bookId: BookId) => {
  requestDownloadUserBook([bookId], true, true).then((url) => {
    if (url) {
      launchAppOrMoveToAppStore(url);
    }
  });
};
