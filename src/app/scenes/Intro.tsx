import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { HelmetWithTitle, TitleType } from 'app/components';
import { PageTitleText } from 'app/constants';
import { Actions as CommonUIActions, FooterTheme, GNBTransparentType } from 'app/services/commonUI';
import { RidiSelectState } from 'app/store';
import { moveToLogin } from 'app/utils/utils';

const Intro: React.FunctionComponent = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const dispatch = useDispatch();
  const { isLoggedIn, hasSubscribedBefore, BASE_URL_STORE, FREE_PROMOTION_MONTHS } = useSelector(
    (state: RidiSelectState) => ({
      isLoggedIn: state.user.isLoggedIn,
      hasSubscribedBefore: state.user.hasSubscribedBefore,
      BASE_URL_STORE: state.environment.STORE_URL,
      FREE_PROMOTION_MONTHS: state.environment.FREE_PROMOTION_MONTHS,
    }),
  );

  React.useEffect(() => {
    dispatch(
      CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.transparent }),
    );
    dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.dark }));
    return () => {
      dispatch(
        CommonUIActions.updateGNBTransparent({ transparentType: GNBTransparentType.default }),
      );
      dispatch(CommonUIActions.updateFooterTheme({ theme: FooterTheme.default }));
    };
  }, []);

  return (
    <main className="SceneWrapper">
      <HelmetWithTitle titleName={PageTitleText.INTRO} titleType={TitleType.PREFIXED} />
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
      <section className={classNames(['SectionMain', isLoaded && 'active'])}>
        <div className="SectionMain_Content">
          <h2 className="SectionMain_MainCopy">
            베스트셀러부터
            <br />
            프리미엄 아티클까지
          </h2>
          <p className="SectionMain_Description">
            {isLoggedIn && hasSubscribedBefore ? '모두 무제한으로' : '1개월 무료'}
          </p>
          <Button
            type="button"
            className="SectionMain_Button"
            color="blue"
            size="large"
            onClick={() => {
              if (isLoggedIn) {
                window.location.replace(`${BASE_URL_STORE}/select/payments`);
                return;
              }
              moveToLogin(`${BASE_URL_STORE}/select/payments`);
            }}
          >
            {isLoggedIn && hasSubscribedBefore ? '다시 시작하기' : '무료로 시작하기'}
            <Icon name="arrow_5_right" className="RSGIcon-arrow5Right" />
          </Button>
          {isLoggedIn && hasSubscribedBefore ? null : (
            <p className="SectionMain_ButtonCaption">
              {`${FREE_PROMOTION_MONTHS}개월 후 월 9,900원. 언제든 원클릭으로 해지`}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Intro;
