import { BigBannerPlaceholder } from 'app/placeholder/BigBannerPlaceholder';
import { Actions as ArticleBannerActions } from 'app/services/articleHome';
import { selectIsInApp } from 'app/services/environment/selectors';
import { Actions as BookBannerActions, BigBanner } from 'app/services/home';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import classNames from 'classnames';
import { debounce } from 'lodash-es';
import React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';
import { AppStatus } from 'app/services/app/index';
import { BigBannerItem } from './BigBannerItem';
import { SliderControls } from './SliderControls';

const PC_BANNER_WIDTH = 432;
const PC_BANNER_HEIGHT = 432;

interface BigBannerStateProps {
  appStatus: AppStatus;
  fetchedAt: number | null;
  bigBannerList: BigBanner[];
  currentIdx: number;
  isInApp: boolean;
}

type Props = BigBannerStateProps & ReturnType<typeof mapDispatchToProps>;

interface State {
  clientWidth: number;
  currentIdx: number;
  totalIdx: number;
}

export class BigBannerCarousel extends React.Component<Props, State> {
  private static touchThereshold = 10;

  private slider: Slider;

  private wrapper: HTMLElement | null;

  private firstClientX: number;

  private handleWindowResize = debounce(() => {
    this.updateClientWidth();
  }, 100);

  public state: State = {
    clientWidth: 360,
    currentIdx: 0,
    totalIdx: 0,
  };

  private handleTouchStart = (e: TouchEvent) => {
    this.firstClientX = e.touches[0].clientX;
  };

  private preventTouch = (e: TouchEvent) => {
    const clientX = e.touches[0].clientX - this.firstClientX;
    const horizontalScroll = Math.abs(clientX) > BigBannerCarousel.touchThereshold;
    if (horizontalScroll) {
      e.preventDefault();
    }
  };

  private updateClientWidth = () => {
    const { clientWidth } = document.body;
    if (this.state.clientWidth !== clientWidth) {
      this.setState({ clientWidth });
    }
  };

  private setSliderImpression(section: string, Idx: number) {
    const { trackImpression, bigBannerList } = this.props;

    trackImpression({
      section,
      index: Idx,
      id: bigBannerList[Idx].id,
    });
  }

  public UNSAFE_componentWillMount() {
    this.updateClientWidth();
  }

  public componentDidMount() {
    if (this.wrapper) {
      this.wrapper.addEventListener('touchstart', this.handleTouchStart);
      this.wrapper.addEventListener('touchmove', this.preventTouch, { passive: false });
      window.addEventListener('resize', this.handleWindowResize);
    }
    if (this.props.fetchedAt) {
      this.setState({
        currentIdx: this.props.currentIdx,
        totalIdx: this.props.bigBannerList.length,
      });
    }
  }

  public componentDidUpdate(prevProps: Props, nextState: State) {
    if (this.props.fetchedAt !== prevProps.fetchedAt) {
      this.setState({
        currentIdx: this.props.currentIdx,
        totalIdx: this.props.bigBannerList.length,
      });
    }
  }

  public componentWillUnmount() {
    const { updateCurrentIdx, appStatus } = this.props;
    if (this.wrapper) {
      this.wrapper.removeEventListener('touchstart', this.handleTouchStart);
      this.wrapper.removeEventListener('touchmove', this.preventTouch);
      window.removeEventListener('resize', this.handleWindowResize);
    }
    updateCurrentIdx(this.state.currentIdx, appStatus);
  }

  public render() {
    const { fetchedAt, bigBannerList, trackClick, isInApp, appStatus } = this.props;
    const service = appStatus === AppStatus.Articles ? 'select-article' : 'select-book';
    const section = getSectionStringForTracking(service, 'home', 'big-banner');
    if (!fetchedAt || bigBannerList.length === 0) {
      return <BigBannerPlaceholder minHeight={this.state.clientWidth} />;
    }

    return (
      <MediaQuery maxWidth={432}>
        {isMobile => (
          <section
            ref={wrapper => (this.wrapper = wrapper)}
            className={classNames(['BigBanner', isMobile && 'BigBanner-isMobile'])}
            style={{
              maxHeight: isMobile ? document.body.clientWidth : PC_BANNER_HEIGHT,
              overflow: 'hidden',
            }}
          >
            <h2 className="a11y">메인 배너</h2>
            <Slider
              ref={(slider: Slider) => (this.slider = slider)}
              dots={false}
              infinite
              adaptiveHeight={false}
              arrows={false}
              centerMode={!isMobile}
              variableWidth={!isMobile}
              draggable={isMobile}
              speed={200}
              slidesToShow={1}
              slidesToScroll={1}
              onInit={() => this.setSliderImpression(section, this.props.currentIdx)}
              initialSlide={this.props.currentIdx}
              afterChange={currentIdx => {
                this.setState({
                  currentIdx,
                });
                this.setSliderImpression(section, currentIdx);
              }}
              touchThreshold={BigBannerCarousel.touchThereshold}
              dotsClass="BigBanner_Dots"
            >
              {bigBannerList.map((item, index) => (
                <BigBannerItem
                  linkUrl={item.linkUrl}
                  onClick={() =>
                    trackClick({
                      section,
                      index,
                      id: item.id,
                    })
                  }
                  key={index}
                  isInApp={isInApp}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: isMobile ? '100%' : PC_BANNER_WIDTH,
                      height: isMobile ? document.body.clientWidth : PC_BANNER_HEIGHT,
                    }}
                  />
                  <span className="a11y">배너 링크</span>
                </BigBannerItem>
              ))}
            </Slider>
            <div className="BigBanner-Count">
              {this.state.currentIdx + 1} / {this.state.totalIdx}
            </div>
            <SliderControls
              onPrevClick={() => this.slider.slickPrev()}
              onNextClick={() => this.slider.slickNext()}
            />
          </section>
        )}
      </MediaQuery>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): BigBannerStateProps => {
  const { appStatus } = state.app;
  return {
    appStatus,
    fetchedAt: appStatus === AppStatus.Books ? state.home.fetchedAt : state.articleHome.fetchedAt,
    bigBannerList:
      appStatus === AppStatus.Books ? state.home.bigBannerList : state.articleHome.bigBannerList,
    currentIdx:
      appStatus === AppStatus.Books ? state.home.currentIdx : state.articleHome.currentIdx,
    isInApp: selectIsInApp(state),
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  trackClick: (trackingParams: DefaultTrackingParams) =>
    dispatch(Actions.trackClick({ trackingParams })),
  trackImpression: (trackingParams: DefaultTrackingParams) =>
    dispatch(Actions.trackImpression({ trackingParams })),
  updateCurrentIdx: (currentIdx: number, appType: AppStatus) => {
    const targetAction = appType === AppStatus.Books ? BookBannerActions : ArticleBannerActions;

    return dispatch(targetAction.updateBannerIndex({ currentIdx }));
  },
});

export const ConnectedBigBannerCarousel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BigBannerCarousel);
