import { createAction } from 'redux-act';

export interface DefaultTrackingParams {
  section: string;
  index: number; // index in section
  id: number | string;
  misc?: string;
}

export interface TrakcingCustomEventParams {
  b_id: number;
  eventName: string;
}

export interface TrackingArticleEventParams {
  id: number | string;
  eventName: string;
  misc?: string;
}

export const Actions = {
  trackClick: createAction<{
    trackingParams: DefaultTrackingParams;
  }>('trackClick'),

  trackImpression: createAction<{
    trackingParams: DefaultTrackingParams;
  }>('trackImpression'),

  trackMySelectAdded: createAction<{
    trackingParams: TrakcingCustomEventParams;
  }>('trackMySelectAdded'),
  trackingArgsUpdate: createAction<{
    updateKey: 'userId' | 'deviceType';
    updateValue: string;
  }>('trackingArgsUpdate'),

  trackingArticleActions: createAction<{
    trackingParams: TrackingArticleEventParams;
  }>('trackingArticleActions'),
};
