import { DeviceType, Tracker } from '@ridi/event-tracker';
import { LOCATION_CHANGE, replace } from 'connected-react-router';
import { all, put, select, take, takeLatest } from 'redux-saga/effects';

import { MOBILE_MAX_WIDTH } from 'app/constants';
import { Actions } from 'app/services/tracking';
import {
  hasCompletedPayletterSubscription,
  hasCompletedRidiPaySubscription,
  RidiSelectState,
} from 'app/store';
import { clearScrollEndHandlers } from 'app/utils/onWindowScrollEnd';

const deviceType: DeviceType =
  document.body.clientWidth < MOBILE_MAX_WIDTH ? DeviceType.Mobile : DeviceType.PC;

const tracker: Tracker = new Tracker({
  deviceType,
  tagManagerOptions: {
    trackingId: 'GTM-WLRHQ86',
  },
});

window.requestIdleCallback(
  () => {
    tracker.initialize();
  },
  { timeout: 500 },
);

export function* watchLocationChange() {
  let { referrer } = document;
  while (true) {
    yield take(LOCATION_CHANGE);
    const location = yield select((state: RidiSelectState) => state.router.location);
    const { href } = window.location;

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
          ...location,
          search: location.search.replace(
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

    tracker.sendEvent('Click', payload.trackingParams);
  }
}

export function* watchTrackImpressions() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.trackImpression> = yield take(
      Actions.trackImpression.getType(),
    );

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

    tracker.sendEvent(trackingParams.eventName, { b_id: trackingParams.b_id });
  }
}

export function trackingArgsUpdate({ payload }: ReturnType<typeof Actions.trackingArgsUpdate>) {
  tracker.set({
    [payload.updateKey]: payload.updateValue,
  });
}

export function trackingArticleActions({
  payload,
}: ReturnType<typeof Actions.trackingArticleActions>) {
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
