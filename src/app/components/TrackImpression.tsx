import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { Omit } from 'app/types';
import { isInViewport } from 'app/utils/isInViewport';
import { subscribeToScrollEnd, unsubscribeFromScrollEnd } from 'app/utils/onWindowScrollEnd';
import React from 'react';
import { connect } from 'react-redux';

export type TrackImpressionOwnProps = Omit<DefaultTrackingParams, 'section'> & {
  section?: string;
  misc?: string;
  children?: any;
};

export type TrackImpressionProps = TrackImpressionOwnProps & ReturnType<typeof mapDispatchToProps>;

export class TrackImpression extends React.Component<TrackImpressionProps> {
  constructor(props: TrackImpressionProps) {
    super(props);
    this.ref = React.createRef();
  }

  private ref: React.RefObject<HTMLDivElement>;

  private scrollEndHandlerIndex?: number;

  private initialCheckTimeout?: number;

  public trackEmpression = () => {
    const { trackImpression, section, index, id, misc } = this.props;
    if (!section) {
      return;
    }

    if (isInViewport(this.ref.current!) && this.ref.current!.clientHeight) {
      if (misc) {
        trackImpression({ section, index, id, misc });
      } else {
        trackImpression({ section, index, id });
      }

      if (this.scrollEndHandlerIndex) {
        unsubscribeFromScrollEnd(this.scrollEndHandlerIndex);
        this.scrollEndHandlerIndex = undefined;
      }
    }
  };

  public componentDidMount() {
    const { section } = this.props;
    if (!section || !this.ref.current) {
      return;
    }

    this.scrollEndHandlerIndex = subscribeToScrollEnd(this.trackEmpression);
    this.initialCheckTimeout = window.setTimeout(() => {
      this.trackEmpression();
    }, 300);
  }

  public componentWillUnmount() {
    if (this.initialCheckTimeout) {
      window.clearTimeout(this.initialCheckTimeout);
    }
    if (this.scrollEndHandlerIndex) {
      unsubscribeFromScrollEnd(this.scrollEndHandlerIndex);
      this.scrollEndHandlerIndex = undefined;
    }
  }

  public render() {
    return (
      <div className="pass-through" ref={this.ref}>
        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  trackImpression: (trackingParams: DefaultTrackingParams) =>
    dispatch(Actions.trackImpression({ trackingParams })),
});

export const ConnectedTrackImpression = connect(null, mapDispatchToProps)(TrackImpression);
