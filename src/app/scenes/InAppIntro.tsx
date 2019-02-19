import * as React from 'react';

import { Button, Icon } from '@ridi/rsg';
import { ConnectedBookListPreview } from 'app/components/BookListPreview';
import { setDisableScroll } from 'app/utils/utils';

export class InAppIntro extends React.Component {
  public componentDidMount() {
    setDisableScroll(true);
  }
  public componentWillUnmount() {
    setDisableScroll(false);
  }
  public render() {
    return (
      <>
        <ConnectedBookListPreview />
        <div className="InAppIntro_Overlay">
          <div className="InAppIntro_Overlay_BG" />
          <div className="InAppIntro_Overlay_Main">
            <h2 className="InAppIntro_Overlay_Header">
              <Icon
                name="logo_ridiselect_1"
                className="InAppIntro_Overlay_Logo"
              />
              <span className="a11y">리디 셀렉트</span>
            </h2>
            <p className="InAppIntro_Overlay_Description">
              도서 월정액 서비스 리디셀렉트를 구독하여<br />
              앱에서 바로 사용해보세요.
            </p>
            <Button
              className="InAppIntro_Overlay_Button"
              color="blue"
              size="large"
              onClick={() => window.android && window.android.openBrowser && window.android.openBrowser('//select.ridibooks.com')}
            >
              리디셀렉트 구독하러 가기
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="InAppIntro_Overlay_Button_Icon">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
            </Button>
          </div>
        </div>
      </>
    );
  }
}
