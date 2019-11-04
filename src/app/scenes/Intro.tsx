import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Icon } from '@ridi/rsg';

import { HelmetWithTitle, TitleType } from 'app/components';
import { PageTitleText } from 'app/constants';
import { Actions as CommonUIActions, FooterTheme, GNBTransparentType } from 'app/services/commonUI';
import { RidiSelectState } from 'app/store';
import { moveToLogin } from 'app/utils/utils';

export const Intro: React.FunctionComponent = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const {
    isLoggedIn,
    hasSubscribedBefore,
    BASE_URL_STORE,
    FREE_PROMOTION_MONTHS,
  } = useSelector((state: RidiSelectState) => ({
    isLoggedIn: state.user.isLoggedIn,
    hasSubscribedBefore: state.user.hasSubscribedBefore,
    BASE_URL_STORE: state.environment.STORE_URL,
    FREE_PROMOTION_MONTHS: state.environment.FREE_PROMOTION_MONTHS,
  }));

  React.useEffect(() => {
    dispatch(CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.transparent }));
    dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.dark }));
    return () => {
      dispatch(CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.default }));
      dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.default }));
    };
  }, []);

  return (
    <main className="SceneWrapper">
      <HelmetWithTitle
        titleName={PageTitleText.INTRO}
        titleType={TitleType.PREFIXED}
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
      <h1 className="a11y">리디셀렉트 인트로</h1>
      <section
        className={classNames({
          Section: true,
          SectionMain: true,
          active: isLoaded,
        })}
      >
        <div className="SectionMain_Content">
          <h2 className="Section_MainCopy SectionMain_MainCopy">
            신간도 베스트셀러도<br />
            월정액으로 제한없이
          </h2>
          <p className="Section_Description SectionMain_Description">
            {FREE_PROMOTION_MONTHS}개월 무료 후 월 6,500원
            <br />
            언제든 원클릭으로 해지
          </p>
          <button
            type="button"
            className={classNames(
              'RUIButton',
              'RUIButton-color-blue',
              'RUIButton-size-large',
              'Section_Button',
              'SectionMain_Button',
            )}
            onClick={() => {
              if (isLoggedIn) {
                window.location.replace(`${BASE_URL_STORE}/select/payments`);
                return;
              }
              moveToLogin(`${BASE_URL_STORE}/select/payments`);
            }}
          >
            {!hasSubscribedBefore ?
              FREE_PROMOTION_MONTHS + '개월 무료로 읽어보기' :
              '리디셀렉트 구독하기'
            }
            <Icon name="arrow_5_right" className="RSGIcon-arrow5Right" />
          </button>
        </div>
      </section>
    </main>
  );
};
