import * as qs from 'qs';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { HelmetWithTitle, TitleType } from 'app/components';
import { PageTitleText, RoutePaths } from 'app/constants';
import { Actions as CommonUIActions, FooterTheme, GNBTransparentType } from 'app/services/commonUI';
import { Actions as VoucherActions } from 'app/services/voucher';
import { RidiSelectState } from 'app/store';
import toast from 'app/utils/toast';
import { moveToLogin } from 'app/utils/utils';

const TicketSVG: React.FunctionComponent<{ className?: string }> = (props) => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" className={props.className}>
    <g fillRule="nonzero">
      <path d="M22,10 L22,6 C22,4.89 21.1,4 20,4 L4,4 C2.9,4 2.01,4.89 2.01,6 L2.01,10 C3.11,10 4,10.9 4,12 C4,13.1 3.11,14 2,14 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,14 C20.9,14 20,13.1 20,12 C20,10.9 20.9,10 22,10 Z M20,8.54 C18.81,9.23 18,10.53 18,12 C18,13.47 18.81,14.77 20,15.46 L20,18 L4,18 L4,15.46 C5.19,14.77 6,13.47 6,12 C6,10.52 5.2,9.23 4.01,8.54 L4,6 L20,6 L20,8.54 Z M11,15 L13,15 L13,17 L11,17 L11,15 Z M11,11 L13,11 L13,13 L11,13 L11,11 Z M11,7 L13,7 L13,9 L11,9 L11,7 Z" />
    </g>
  </svg>
);

export const Voucher: React.FunctionComponent = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const dispatch = useDispatch();

  const {
    searchQuery,
    isLoggedIn,
    isUserFetching,
    BASE_URL_SELECT,
  } = useSelector((state: RidiSelectState) => ({
    searchQuery: state.router.location.search,
    isLoggedIn: state.user.isLoggedIn,
    isUserFetching: state.user.isFetching,
    BASE_URL_SELECT: state.environment.SELECT_URL,
  }));

  const modifyValue = (value: string) => {
    let resultValue = value.replace(/[^\w]|_/g, '').toUpperCase();
    if (resultValue.length > 0) {
      resultValue = resultValue.match(/.{1,4}/g)!.join('-');
    }
    if (resultValue.length > 19) {
      resultValue = resultValue.slice(0, 19);
    }
    return resultValue;
  };

  const submitVoucherCode = (voucherCode: string) => {
    const trimmedCode = voucherCode.replace(/\-/g, '');
    if (trimmedCode.length < 16) {
      toast.failureMessage('올바른 이용권 코드가 아닙니다.');
      return;
    }
    dispatch(VoucherActions.useVoucher({ voucherCode: trimmedCode }));
  };

  React.useEffect(() => {
    dispatch(CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.transparent }));
    dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.dark }));
    return () => {
      dispatch(CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.default }));
      dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.default }));
    };
  }, []);

  React.useEffect(() => {
    const queryString = qs.parse(searchQuery, { ignoreQueryPrefix: true });
    if (queryString.code) {
      setInputValue(modifyValue(queryString.code));
    }
    return () => {
      setInputValue('');
    };
  }, [searchQuery]);

  return (
    <main className="SceneWrapper PageVoucher">
      <HelmetWithTitle
        titleName={PageTitleText.VOUCHER}
        titleType={TitleType.POSTFIXED}
      />
      {isLoaded ? null : (
        <>
          <img
            className="Load_Trigger_Image"
            src={require('images/intro/hero_bg.jpg')}
            onLoad={() => setIsLoaded(true)}
          />
          <div className="SceneLoadingCover" />
        </>
      )}
      <section className="VoucherContent_Wrapper">
        <div className="VoucherContent">
          <TicketSVG className="VoucherContent_TicketSVG" />
          <h2 className="VoucherContent_MainCopy">리디셀렉트 이용권 등록</h2>
          <p className="VoucherContent_Description">
            {/* 베스트셀러부터 프리미엄 아티클까지<br/> 무제한 월정액 서비스 리디셀렉트 */}
            신간도 베스트셀러도<br />월정액으로 제한없이
          </p>
          {isUserFetching ?
            null :
            isLoggedIn ? (
              <>
                <div className="VoucherContent_CodeInputWrapper">
                  <input
                    type="text"
                    className="VoucherContent_CodeInput"
                    placeholder="이용권 번호 16자리를 입력해주세요."
                    onChange={(e) => setInputValue(modifyValue(e.target.value))}
                    value={inputValue}
                  />
                  {inputValue.length > 0 ? (
                    <button
                      className="VoucherContent_CodeInputClearButton"
                      type="button"
                      onClick={() => setInputValue('')}
                    >
                      <Icon
                        name="close_2"
                        className="VoucherContent_CodeInputClearButtonIcon"
                      />
                      <span className="a11y">검색어 비우기</span>
                    </button>
                  ) : null}
                </div>
                <Button
                  type="button"
                  color="blue"
                  size="large"
                  className="VoucherContent_SubmitButton"
                  onClick={() => submitVoucherCode(inputValue)}
                >
                  이용권 등록
                </Button>
                <p className="VoucherContent_SupportCaption">
                  이용권 등록 후 취소 및 일시 정지할 수 없습니다.
                </p>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  color="blue"
                  size="large"
                  className="VoucherContent_LoginButton"
                  onClick={() => moveToLogin(`${BASE_URL_SELECT}${RoutePaths.VOUCHER}`)}
                >
                  로그인
                </Button>
                <p className="VoucherContent_SupportCaption">
                  로그인 후 이용권을 등록할 수 있습니다.
                </p>
              </>
            )
          }
        </div>
      </section>
    </main>
  );
};
