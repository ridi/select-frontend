import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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

const RidibooksLogoIcon = (props: { className: string; }) => (
  <svg enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" {...props}>
    {/* tslint:disable:max-line-length */}
    <g fill="#fff">
      <path d="m10.311 13.259h1.04c.126 0 .173-.047.173-.173v-5.002c0-.126-.047-.174-.173-.174h-1.04c-.127 0-.174.047-.174.174v5.002c.001.126.048.173.174.173z"/>
      <path d="m5.565 13.259h1.032c.127 0 .174-.047.174-.173v-1.399-.062h.062.285.039l.017.035.688 1.432c.057.114.147.167.284.167h1.047c.088 0 .102-.031.107-.042.017-.038.008-.088-.024-.15l-.836-1.584-.03-.057.058-.028.029-.014c.551-.264.831-.793.831-1.574 0-.703-.162-1.201-.48-1.478-.324-.279-.858-.422-1.587-.422h-1.696c-.126 0-.173.047-.173.173v5.002c0 .127.047.174.173.174zm1.205-2.784v-1.336-.061h.062.414c.254 0 .427.055.529.167.1.11.149.295.149.566 0 .255-.048.434-.148.549-.101.117-.28.176-.531.176h-.413-.062z"/>
      <path d="m18.447 14.647h-1.123c-.674 0-2.811.018-3.635.17-.652.122-1.221.391-1.645.779l-.042.038-.042-.038c-.426-.388-.994-.657-1.645-.779-.815-.151-3.618-.17-3.632-.17h-1.118c-.126 0-.173.047-.173.173v.586c0 .123.045.17.163.172h1.224c.313 0 2.784.011 3.371.15.925.219 1.411.879 1.511 1.029h.68c.1-.15.586-.81 1.512-1.029.569-.135 3.028-.149 3.455-.149h1.127c.126 0 .173-.047.173-.173v-.586c0-.123-.045-.17-.161-.173z"/>
      <path d="m18.435 7.91h-1.04c-.127 0-.174.047-.174.174v5.002c0 .127.047.174.174.174h1.04c.126 0 .173-.047.173-.174v-5.002c0-.127-.047-.174-.173-.174z"/>
      <path d="m12.594 13.259h1.54c.792 0 1.374-.201 1.729-.598.358-.4.539-1.099.539-2.076 0-.978-.183-1.676-.543-2.076-.358-.397-.944-.599-1.741-.599h-1.524c-.126 0-.173.047-.173.174v5.002c0 .126.046.173.173.173zm1.213-1.26v-2.828-.062h.062.211c.334 0 .575.109.718.323.135.205.202.582.202 1.153 0 .57-.064.947-.194 1.152-.137.215-.377.324-.711.324h-.226-.062z"/>
    </g>
    <path d="m7.246 10.537c.251 0 .43-.059.531-.176.099-.115.148-.294.148-.549 0-.271-.049-.457-.149-.566-.103-.114-.277-.168-.53-.168h-.414-.062v.062 1.336.062h.062.414z" fill="#1f8ce6"/>
    <path d="m14.095 12.061c.334 0 .573-.109.711-.324.13-.205.194-.582.194-1.152 0-.571-.066-.948-.203-1.153-.143-.214-.384-.323-.718-.323h-.211-.062v.062 2.829.062h.062.227z" fill="#1f8ce6"/>
    <path d="m19.333 2h-14.666c-1.467 0-2.667 1.2-2.667 2.667v14.667c0 1.466 1.2 2.666 2.667 2.666h14.667c1.466 0 2.666-1.2 2.666-2.667v-14.666c0-1.467-1.2-2.667-2.667-2.667zm-6.912 6.084c0-.126.047-.174.173-.174h1.524c.797 0 1.383.201 1.741.599.36.4.543 1.098.543 2.076 0 .977-.181 1.676-.539 2.076-.355.397-.937.598-1.729.598h-1.54c-.126 0-.173-.047-.173-.173zm-2.283 0c0-.126.047-.174.174-.174h1.04c.126 0 .173.047.173.174v5.002c0 .126-.047.173-.173.173h-1.04c-.127 0-.174-.047-.174-.173zm-4.746 0c0-.127.047-.173.173-.173h1.696c.729 0 1.262.142 1.585.423.319.277.48.775.48 1.478 0 .781-.28 1.31-.831 1.574l-.029.014-.058.028.03.057.836 1.584c.033.062.041.113.024.15-.005.012-.019.042-.107.042h-1.046c-.137 0-.227-.053-.284-.167l-.688-1.432-.017-.035h-.04-.284-.062v.062 1.399c0 .126-.047.173-.174.173h-1.031c-.126 0-.173-.047-.173-.173zm13.216 7.321c0 .126-.047.173-.173.173h-1.127c-.427 0-2.886.015-3.455.149-.926.219-1.412.879-1.512 1.029h-.68c-.1-.15-.587-.81-1.511-1.029-.587-.139-3.058-.15-3.371-.15h-1.224c-.118-.003-.163-.05-.163-.172 0-.124 0-.461 0-.586 0-.126.047-.173.173-.173h1.118c.013 0 2.816.019 3.632.17.651.121 1.22.391 1.645.779l.042.038.042-.038c.424-.388.993-.657 1.645-.779.824-.152 2.961-.17 3.635-.17h1.123c.117.003.162.051.162.172v.587zm0-2.319c0 .127-.047.174-.173.174h-1.04c-.127 0-.174-.047-.174-.174v-5.002c0-.126.047-.174.174-.174h1.04c.126 0 .173.047.173.174z" fill="#1f8ce6"/>
    {/* tslint:enable:max-line-length */}
  </svg>
);

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
          >
            <RidibooksLogoIcon
              className="Ridibooks_Logo_Icon"
            />
            뷰어 다운로드
          </a>
        </li>
        <li className="Footer_Headline_Item">
          <Link className="Footer_Headline_Link" to="/guide">이용 방법</Link>
        </li>
        <li className="Footer_Headline_Item">
          <a
            className="Footer_Headline_Link"
            href="https://help.ridibooks.com/hc/ko/categories/360000139267"
            target="_blank"
          >
            리디셀렉트 FAQ
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
            to={RoutePaths.AVAILABLE_BOOKS}
          >
            서비스 도서 목록
          </Link>
        </li>
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
            href="https://ridibooks.com/legal/terms"
            target="_blank"
          >
            이용약관
          </a>
        </li>
        <li className="Footer_Terms_Item">
          <a
            className="Footer_Term_Link Personal_Info_Term_Link"
            href="https://ridibooks.com/legal/privacy"
            target="_blank"
          >
            개인 정보 처리 방침
          </a>
        </li>
        <li className="Footer_Terms_Item">
          <a
            className="Footer_Term_Link"
            href="https://ridibooks.com/legal/youth"
            target="_blank"
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
