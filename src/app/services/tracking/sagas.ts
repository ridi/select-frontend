import { DeviceType, Tracker } from '@ridi/event-tracker';
import env from 'app/config/env';
import { MAX_WIDTH } from 'app/constants';
import { Actions } from 'app/services/tracking';
import {
  hasCompletedPayletterSubscription,
  hasCompletedRidiPaySubscription,
  RidiSelectState,
} from 'app/store';
import { clearScrollEndHandlers } from 'app/utils/onWindowScrollEnd';
import { LOCATION_CHANGE, replace } from 'connected-react-router';
import { all, put, select, take, takeLatest } from 'redux-saga/effects';

export const PIXEL_ID = '417351945420295';
let tracker: Tracker;

const initializeTracker = (state: RidiSelectState) => {
  let deviceType: DeviceType;
  if (document.body.clientWidth < MAX_WIDTH) {
    deviceType = DeviceType.Mobile;
  } else {
    deviceType = DeviceType.PC;
  }

  tracker = new Tracker({
    debug: !env.production,
    deviceType,
    userId: state.user.uId,
    tagManagerOptions: {
      trackingId: 'GTM-WLRHQ86',
    },
  });
  tracker.initialize();
};

export function* watchLocationChange() {
  let { referrer } = document;
  while (true) {
    yield take(LOCATION_CHANGE);
    const state: RidiSelectState = yield select(s => s);
    const { href } = window.location;

    if (!tracker) {
      initializeTracker(state);
    }

    clearScrollEndHandlers();

    if (referrer) {
      tracker.sendPageView(href, referrer);
    } else {
      tracker.sendPageView(href);
    }
    referrer = href;

    const isCompletedThroughRidiPay = hasCompletedRidiPaySubscription();
    const isCompletedThroughPayletter = hasCompletedPayletterSubscription();
    if (isCompletedThroughRidiPay || isCompletedThroughPayletter) {
      tracker.sendEvent('New Subscription', {
        method: isCompletedThroughPayletter ? 'payletter' : 'ridipay',
      });
      // Remove new subscription search string for tracking and move to entry page if there is one
      yield put(
        replace({
          ...state.router.location,
          search: state.router.location.search.replace(
            /[&?](new_subscription|new_payletter_subscription)=[^&=]+/,
            '',
          ),
        }),
      );
    }
  }
}

export function* watchTrackClick() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.trackClick> = yield take(
      Actions.trackClick.getType(),
    );

    if (!tracker) {
      initializeTracker(yield select(s => s));
    }

    tracker.sendEvent('Click', payload.trackingParams);
  }
}

export function* watchTrackImpressions() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.trackImpression> = yield take(
      Actions.trackImpression.getType(),
    );

    if (!tracker) {
      initializeTracker(yield select(s => s));
    }

    tracker.sendEvent('Impression', payload.trackingParams);
  }
}

export function* watchTrackMySelectAdded() {
  while (true) {
    const {
      payload: { trackingParams },
    }: ReturnType<typeof Actions.trackMySelectAdded> = yield take(
      Actions.trackMySelectAdded.getType(),
    );

    if (!tracker) {
      initializeTracker(yield select(s => s));
    }

    tracker.sendEvent(trackingParams.eventName, { b_id: trackingParams.b_id });
  }
}

export function* trackingArgsUpdate({ payload }: ReturnType<typeof Actions.trackingArgsUpdate>) {
  if (!tracker) {
    initializeTracker(yield select(s => s));
  }

  tracker.set({
    [payload.updateKey]: payload.updateValue,
  });
}

export function* trackingArticleActions({
  payload,
}: ReturnType<typeof Actions.trackingArticleActions>) {
  if (!tracker) {
    initializeTracker(yield select(s => s));
  }
  const { trackingParams } = payload;
  tracker.sendEvent(trackingParams.eventName, { id: trackingParams.id });
}

export function* watchTrackingArgsUpdate() {
  yield takeLatest(Actions.trackingArgsUpdate.getType(), trackingArgsUpdate);
}

export function* watchTrackingArticleActions() {
  yield takeLatest(Actions.trackingArticleActions.getType(), trackingArticleActions);
}

export function* trackingSaga() {
  yield all([
    watchLocationChange(),
    watchTrackClick(),
    watchTrackImpressions(),
    watchTrackMySelectAdded(),
    watchTrackingArgsUpdate(),
    watchTrackingArticleActions(),
  ]);
}
