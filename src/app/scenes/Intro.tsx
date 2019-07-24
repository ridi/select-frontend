import { RidiSelectState } from 'app/store';
import { sortedIndex, throttle } from 'lodash-es';
import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, withRouter } from 'react-router';

import { Icon } from '@ridi/rsg';
import * as classNames from 'classnames';

import { HelmetWithTitle, TitleType } from 'app/components';
import { PageTitleText } from 'app/constants';
import { Actions as CommonUIActions, FooterTheme, GNBTransparentType } from 'app/services/commonUI';
import { Actions as EnvironmentActions } from 'app/services/environment';
import { Omit } from 'app/types';

interface IntroStateProps {
  hasSubscribedBefore: boolean;
  isLoggedIn: boolean;
  uId: string;
  BASE_URL_STORE: string;
  BASE_URL_STATIC: string;
  BASE_URL_RIDISELECT: string;
  FREE_PROMOTION_MONTHS: number;
}

interface WindowSizeInfoTypes {
  height: number;
  scrollHeight: number;
  initialScrollTop: number;
  distanceToStartPointFromEdge: number;
  sectionMainButtonEndPoint: number;
}

interface IntroPageState {
  isLoaded: boolean;
  currentSection: number;
  windowInfo: WindowSizeInfoTypes;
  buttonFixed: boolean;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps;
type Props = IntroStateProps & OwnProps & ReturnType<typeof mapDispatchToProps>;

export class Intro extends React.Component<Props, IntroPageState> {
  private sections: Array<HTMLElement | null> = [];
  private sectionMainButton: Array<HTMLElement | null> = [];
  private sectionsOffsetTops: number[] = [];

  private throttledResizeFunction: EventListener = throttle(
    () => this.setWindowSize(),
    100,
  );
  private throttledScrollFunction: EventListener = throttle(
    () => this.manageSectionActivation(),
    100,
  );
  public state: IntroPageState = {
    isLoaded: false,
    currentSection: -1,
    windowInfo: {
      height: 0,
      scrollHeight: 0,
      initialScrollTop: 0,
      distanceToStartPointFromEdge: 0,
      sectionMainButtonEndPoint: 0,
    },
    buttonFixed: false,
  };

  private getWindowSize() {
    const windowSize = {
      height: window.innerHeight || document.documentElement!.clientHeight,
      scrollHeight: document.documentElement!.scrollHeight,
      initialScrollTop:
        window.pageYOffset || document.documentElement!.scrollTop,
    };
    return {
      ...windowSize,
      distanceToStartPointFromEdge: (windowSize.height / 5) * 3,
      sectionMainButtonEndPoint:
        this.sectionMainButton[0]!.offsetTop +
        this.sectionMainButton[0]!.offsetHeight,
    };
  }

  private setWindowSize() {
    this.setState({
      windowInfo: this.getWindowSize(),
    });
  }

  private manageSectionActivation() {
    const { currentSection, windowInfo } = this.state;
    const currentScrollTop: number =
      window.pageYOffset || document.documentElement!.scrollTop;
    if (windowInfo.height + currentScrollTop >= windowInfo.scrollHeight) {
      this.setState({ currentSection: this.sections.length });
      return;
    }
    const updatedSectionIndex = sortedIndex(
      this.sectionsOffsetTops,
      currentScrollTop + windowInfo.distanceToStartPointFromEdge,
    );
    const updatedState: { currentSection: number; buttonFixed: boolean } = {
      currentSection:
        currentSection < updatedSectionIndex
          ? updatedSectionIndex
          : currentSection,
      buttonFixed: false,
    };

    if (currentScrollTop >= windowInfo.sectionMainButtonEndPoint) {
      updatedState.buttonFixed = true;
    }

    this.setState({ ...updatedState });
  }

  private afterLoadingComplete() {
    const {
      dispatchUpdateGNBTransparentType,
      dispatchUpdateFooterTheme,
    } = this.props;

    dispatchUpdateGNBTransparentType(GNBTransparentType.transparent);
    dispatchUpdateFooterTheme(FooterTheme.dark);

    this.sectionsOffsetTops = Array.from(this.sections).map(
      (section: HTMLDivElement) => section.offsetTop,
    );

    setTimeout(() => {
      this.setState({
        isLoaded: true,
        currentSection: 1,
        windowInfo: this.getWindowSize(),
      });
      this.props.dispatchCompleteIntroImageLoad();
    }, 100);

    window.addEventListener('resize', this.throttledResizeFunction);
    window.addEventListener('scroll', this.throttledScrollFunction);
  }

  public componentWillUnmount() {
    const {
      dispatchUpdateGNBTransparentType,
      dispatchUpdateFooterTheme,
    } = this.props;
    dispatchUpdateGNBTransparentType(GNBTransparentType.default);
    dispatchUpdateFooterTheme(FooterTheme.default);

    window.removeEventListener('resize', this.throttledResizeFunction);
    window.removeEventListener('scroll', this.throttledScrollFunction);
  }

  public render() {
    const {
      BASE_URL_STORE,
      FREE_PROMOTION_MONTHS,
      isLoggedIn,
      hasSubscribedBefore,
    } = this.props;
    const { isLoaded, currentSection, buttonFixed } = this.state;
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle
          titleName={PageTitleText.INTRO}
          titleType={TitleType.PREFIXED}
        />
        {isLoaded ? null : (
        <img
          className="Load_Trigger_Image"
          src={require('images/intro/hero_bg.jpg')}
          onLoad={() => this.afterLoadingComplete()}
        />
        )}
        <h1 className="a11y">리디셀렉트 인트로</h1>
        <section
          className={classNames({
            'Section': true,
            'SectionMain': true,
            'active': currentSection >= 1,
            'Button-fixed': buttonFixed,
          })}
          ref={(section: HTMLElement | null) => (this.sections[0] = section)}
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
            <a
              id="SectionMain_Button"
              className="Section_Button RUIButton RUIButton-color-blue RUIButton-size-large SectionMain_Button"
              href={
                isLoggedIn
                  ? `${BASE_URL_STORE}/select/payments`
                  : `${BASE_URL_STORE}/account/oauth-authorize?fallback=signup&return_url=${BASE_URL_STORE}/select/payments`
              }
              ref={(button: HTMLElement | null) =>
                this.sectionMainButton.push(button)
              }
            >
              {!hasSubscribedBefore
                ? FREE_PROMOTION_MONTHS + '개월 무료로 읽어보기'
                : '리디셀렉트 구독하기'}
              <Icon name="arrow_5_right" className="RSGIcon-arrow5Right" />
            </a>
          </div>
        </section>
        <section
          className={classNames(
            'Section',
            'SectionFeatured',
            currentSection >= 2 ? 'active' : '',
          )}
          ref={(section: HTMLElement | null) => (this.sections[1] = section)}
        >
          <div className="SectionFeature_Content">
            <div className="SectionFeature_CopyWrapper">
              <h2 className="Section_MainCopy SectionFeatured_MainCopy">
                무엇을 고르든 <br className="BreakRow" />
                인생 책
              </h2>
              <p className="Section_Description SectionFeatured_Description">
                독자 평점으로 검증된 도서들과
                <br />
                많은 사랑을 받은 스테디셀러까지
              </p>
            </div>
            <div className="SectionFeatured_ImageWrapper">
              <img
                src={require('images/intro/life_bg_1.png')}
                className="SectionFeatured_Image_1"
                data-transformed="100"
              />
              <img
                src={require('images/intro/life_bg_2.png')}
                className="SectionFeatured_Image_2"
                data-transformed="30"
              />
              <img
                src={require('images/intro/life.m.png')}
                className="SectionFeatured_Image_3"
                data-transformed="50"
              />
            </div>
          </div>
        </section>
        <MediaQuery maxWidth={840}>
          {(isMobile) => (
            <>
              <section
                className={classNames(
                  'Section',
                  'SectionReasonable',
                  currentSection >= 3 ? 'active' : '',
                )}
                ref={(section: HTMLElement | null) =>
                  (this.sections[2] = section)
                }
              >
                <div className="SectionReasonable_RotateWrapper">
                  <div className="SectionReasonable_BgImageWrapper">
                    <img
                      src={require('images/intro/books_bg_1.jpg')}
                      className="SectionFeatured_Reasonable_1"
                    />
                    <img
                      src={require('images/intro/books_bg_2.jpg')}
                      className="SectionFeatured_Reasonable_2"
                    />
                    <img
                      src={require('images/intro/books_bg_3.jpg')}
                      className="SectionFeatured_Reasonable_3"
                    />
                    <img
                      src={require('images/intro/books_bg_4.jpg')}
                      className="SectionFeatured_Reasonable_4"
                    />
                    <img
                      src={require('images/intro/book.m.png')}
                      className="SectionFeatured_Reasonable_5"
                    />
                  </div>
                </div>
                <div className="SectionReasonable_ContentsWrapper">
                  <h2 className="Section_MainCopy SectionReasonable_MainCopy">
                    이제 책값에서 <br className="BreakRow" />
                    자유롭게
                  </h2>
                  <p className="Section_Description SectionReasonable_Description">
                    원하는 기기로 언제 어디서나
                    <br />
                    추가 결제 없이 마음껏 이용
                  </p>
                </div>
              </section>
              <section
                className={classNames(
                  'Section',
                  'SectionPromotion',
                  (!isMobile || currentSection >= 4) ? 'active' : '',
                )}
                ref={(section: HTMLElement | null) => (this.sections[3] = section)}
              >
                <div className="SectionPromotion_InnerWrapper">
                  <div className="SectionPromotion_Content">
                    <h2 className="Section_MainCopy SectionPromotion_MainCopy">
                      첫 {FREE_PROMOTION_MONTHS}개월은 무료!
                    </h2>
                    <p className="Section_Description SectionPromotion_Description">
                      부담없이 이용해보고,
                      <br />
                      언제든 원클릭으로 해지 가능!
                    </p>
                    <a
                      className="Section_Button RUIButton RUIButton-color-blue RUIButton-size-large SectionMain_Button"
                      href={
                        isLoggedIn
                          ? `${BASE_URL_STORE}/select/payments`
                          : `${BASE_URL_STORE}/account/oauth-authorize?fallback=signup&return_url=${BASE_URL_STORE}/select/payments`
                      }
                      ref={(button: HTMLElement | null) =>
                        this.sectionMainButton.push(button)
                      }
                    >
                      {FREE_PROMOTION_MONTHS}개월 무료로 읽어보기
                      <Icon name="arrow_5_right" className="RSGIcon-arrow5Right" />
                    </a>
                  </div>
                  <div className="SectionPromotion_ImageWrapper">
                    <img
                      src={require('images/intro/free_month_mobile.png')}
                      className="SectionPromotion_Image"
                    />
                  </div>
                </div>
              </section>
            </>
          )}
        </MediaQuery>
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): Omit<IntroStateProps, 'onLoad'> => {
  return {
    uId: rootState.user.uId,
    isLoggedIn: rootState.user.isLoggedIn,
    hasSubscribedBefore: rootState.user.hasSubscribedBefore,
    BASE_URL_STATIC: rootState.environment.SELECT_URL,
    BASE_URL_STORE: rootState.environment.STORE_URL,
    BASE_URL_RIDISELECT: rootState.environment.SELECT_URL,
    FREE_PROMOTION_MONTHS: rootState.environment.FREE_PROMOTION_MONTHS,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchUpdateGNBTransparentType: (transparentType: GNBTransparentType) =>
      dispatch(CommonUIActions.updateGNBTransparent({ transparentType })),
    dispatchUpdateFooterTheme: (theme: FooterTheme) =>
      dispatch(CommonUIActions.updateFooterTheme({ theme })),
    dispatchCompleteIntroImageLoad: () =>
      dispatch(EnvironmentActions.completeIntroImageLoad()),
  };
};
export const ConnectedIntro = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Intro),
);

export default ConnectedIntro;
