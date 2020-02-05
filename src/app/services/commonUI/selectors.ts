import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';

import { GNBColorLevel, GNBTransparentType, RGB } from 'app/services/commonUI';
import { getIsIosInApp } from 'app/services/environment/selectors';

export const selectGnbColor = (state: RidiSelectState): RGB => state.commonUI.gnbColor;
export const selectGnbColorLevel = (state: RidiSelectState): GNBColorLevel =>
  state.commonUI.gnbColorLevel;
export const selectTransparentType = (state: RidiSelectState): GNBTransparentType =>
  state.commonUI.gnbTransparentType;

export const getSolidBackgroundColorRGBString = createSelector(
  [selectGnbColor, getIsIosInApp],
  (gnbColor: RGB, isIosInApp: boolean): string =>
    isIosInApp ? 'rgba(255, 255, 255, 1)' : `rgba(${gnbColor.r}, ${gnbColor.g}, ${gnbColor.b}, 1)`,
);

export const getTransparentBackgroundColorRGBString = createSelector(
  [selectGnbColor],
  (gnbColor: RGB): string => `rgba(${gnbColor.r}, ${gnbColor.g}, ${gnbColor.b}, 0.95)`,
);

export const getBackgroundColorRGBString = createSelector(
  [(state: RidiSelectState): RidiSelectState => state, selectTransparentType],
  (state: RidiSelectState, gnbTransparentType: GNBTransparentType): string =>
    gnbTransparentType === GNBTransparentType.transparent
      ? 'rgba(0,0,0,0)'
      : getSolidBackgroundColorRGBString(state),
);

export const getBackgroundColorGradientToRight = createSelector(
  [selectGnbColor],
  (gnbColor: RGB): string => `linear-gradient(to right,
    rgba(${gnbColor.r},${gnbColor.g},${gnbColor.b},1) 0%,
    rgba(255, 255, 255, 0) 100%`,
);

export const getBackgroundColorGradientToLeft = createSelector(
  [selectGnbColor],
  (gnbColor: RGB): string => `linear-gradient(to left,
    rgba(${gnbColor.r},${gnbColor.g},${gnbColor.b},1) 0%,
    rgba(255, 255, 255, 0) 100%`,
);

export const getGNBType = createSelector(
  [selectTransparentType, selectGnbColorLevel],
  (gnbTransparentType: GNBTransparentType, gnbColorLevel: GNBColorLevel): GNBColorLevel =>
    gnbTransparentType === GNBTransparentType.transparent
      ? GNBColorLevel.TRANSPARENT
      : gnbColorLevel,
);
