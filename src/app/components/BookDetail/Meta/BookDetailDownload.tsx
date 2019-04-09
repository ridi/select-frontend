import * as qs from 'qs';
import * as React from 'react';

import { Button, Icon } from '@ridi/rsg';
import { EnvironmentState } from 'app/services/environment';

interface Props {
  isSubscribing: boolean;
  previewAvailable: boolean;
  hasPreview: boolean;
  isMobile: boolean;
  isLoggedIn: boolean;
  hasSubscribedBefore: boolean;
  env: EnvironmentState;
  shouldDisplaySpinnerOnDownload: boolean;
  canDownload: boolean;
}

export const BookDetailDownload = (props: Props) => {
  const { isSubscribing, isMobile, hasPreview, previewAvailable, shouldDisplaySpinnerOnDownload, canDownload } = props;

  const { isLoggedIn, hasSubscribedBefore, env } = props;
  const { STORE_URL: BASE_URL_STORE } = props.env;

  const queryString = qs.stringify(qs.parse(location.search, { ignoreQueryPrefix: true }), {
    filter: (prefix, value) => {
      if (prefix.includes('utm_')) {
        return;
      }
      return value;
    },
    addQueryPrefix: true,
  });
  const paymentsUrl = `${BASE_URL_STORE}/select/payments?return_url=${location.origin + location.pathname + encodeURIComponent(queryString)}`;
  const paymentsWithAuthorizeUrl = `${BASE_URL_STORE}/account/oauth-authorize?fallback=signup&return_url=${paymentsUrl}`;

  return (
    <>
      {isSubscribing && previewAvailable && hasPreview ? (
        <Button
          color={isMobile ? 'blue' : undefined}
          outline={true}
          size="large"
          className="PageBookDetail_PreviewButton"
          component="a"
          href={``}
        >
          <Icon name="book_1" />
          <span className="PageBookDetail_PreviewButtonLabel">미리보기</span>
        </Button>
      ) : null}

      { canDownload ?
        <Button
          color="blue"
          size="large"
          spinner={shouldDisplaySpinnerOnDownload}
          className="PageBookDetail_DownloadButton"
          onClick={() => {}}
        >
          {env.platform.isRidibooks ? '읽기' : '다운로드'}
        </Button> :
        isSubscribing ?
        <Button
          color="blue"
          size="large"
          spinner={shouldDisplaySpinnerOnDownload}
          className="PageBookDetail_DownloadButton"
          onClick={() => {}}
        >
          {!shouldDisplaySpinnerOnDownload && <Icon name="check_6" />}
          마이 셀렉트에 추가
        </Button> :
        <Button
          color="blue"
          size="large"
          spinner={shouldDisplaySpinnerOnDownload}
          className="PageBookDetail_DownloadButton PageBookDetail_DownloadButton-large"
          component="a"
          href={isLoggedIn ? paymentsUrl : paymentsWithAuthorizeUrl}
        >
          {hasSubscribedBefore ? '리디셀렉트 구독하기' : '구독하고 무료로 읽어보기'}
        </Button>
      }
    </>
  );
};
