import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';

import { RoutePaths } from 'app/constants';
import { FooterTheme } from 'app/services/commonUI';
import { RidiSelectState } from 'app/store';
import { ANDROID_APPSTORE_URL, getPlatformDetail, IOS_APPSTORE_URL } from 'app/utils/downloadUserBook';

const URL_APP_DOWNLOAD = 'https://ridibooks.com/support/app/download';

const platformDetail = getPlatformDetail();
let downloadUrl = URL_APP_DOWNLOAD;

if (platformDetail.isAndroid) {
  downloadUrl = ANDROID_APPSTORE_URL;
} else if (platformDetail.isIos) {
  downloadUrl = IOS_APPSTORE_URL;
}

interface Props {
  footerTheme: FooterTheme;
}

export const Footer: React.SFC<Props> = (props) => {
  const { footerTheme } = props;
  return (
    <footer
      className={classNames(
        'Footer',
        { 'Footer-dark': footerTheme === FooterTheme.dark },
      )}
    >
      <ul className="Footer_Headline_List">
        <li className="Footer_Headline_Item">
          <a
            className="Footer_Headline_Link"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            뷰어 다운로드
          </a>
        </li>
        <li className="Footer_Headline_Item">
          <Link className="Footer_Headline_Link" to={RoutePaths.GUIDE}>이용 방법</Link>
        </li>
        <li className="Footer_Headline_Item">
          <Link className="Footer_Headline_Link" to={RoutePaths.VOUCHER}>이용권 등록</Link>
        </li>
        <li className="Footer_Headline_Item">
          <a
            className="Footer_Headline_Link"
            href="https://help.ridibooks.com/hc/ko/categories/360000139267"
            target="_blank"
            rel="noopener noreferrer"
          >
            FAQ
          </a>
        </li>
      </ul>
      <ul className="Footer_BizInfo_List">
        <li className="Footer_BizInfo_Item">서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)</li>
        <li className="Footer_BizInfo_Item">
          <ul className="CompanyInfo_List">
            <li className="CompanyInfo_Item">리디 (주)</li>
            <li className="CompanyInfo_Item">대표 배기식</li>
            <li className="CompanyInfo_Item">사업자등록번호 120-87-27435</li>
          </ul>
        </li>
        <li className="Footer_BizInfo_Item">통신판매업신고 제 2009-서울강남 35-02139호</li>
      </ul>
      <ul className="Footer_Terms_List">
        <li className="Footer_Terms_Item">
          <Link
            className="Footer_Term_Link"
            to={RoutePaths.CLOSING_RESERVED_BOOKS}
          >
            종료 예정 도서
          </Link>
        </li>
        <li className="Footer_Terms_Item">
          <a
            className="Footer_Term_Link"
            href="https://policy.ridi.com/legal/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            이용약관
          </a>
        </li>
        <li className="Footer_Terms_Item">
          <a
            className="Footer_Term_Link Personal_Info_Term_Link"
            href="https://policy.ridi.com/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            개인 정보 처리 방침
          </a>
        </li>
        <li className="Footer_Terms_Item">
          <a
            className="Footer_Term_Link"
            href="https://policy.ridi.com/legal/youth"
            target="_blank"
            rel="noopener noreferrer"
          >
            청소년 보호 정책
          </a>
        </li>
      </ul>
      <p className="Footer_Copyright">© RIDI Corp.</p>
    </footer>
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  footerTheme: rootState.commonUI.footerTheme,
});

export const ConnectedFooter = connect(mapStateToProps)(Footer);
