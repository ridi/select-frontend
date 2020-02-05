import { createAction, createReducer } from 'redux-act';

export const isDefaultColor = (color: RGB) =>
  color.r === GNB_DEFAULT_COLOR.r &&
  color.g === GNB_DEFAULT_COLOR.g &&
  color.b === GNB_DEFAULT_COLOR.b;

export const toRGBString = (rgb: RGB): string => `rgb(${rgb.r},${rgb.g},${rgb.b})`;

export const Actions = {
  updateGNBColor: createAction<{
    color: RGB;
  }>('updateGNBColor'),
  updateSearchActiveType: createAction<{
    gnbSearchActiveType: GNBSearchActiveType;
  }>('updateSearchActiveType'),
  updateGNBTransparent: createAction<{
    transparentType: GNBTransparentType;
  }>('updateGNBTransparent'),
  updateFooterTheme: createAction<{
    theme: FooterTheme;
  }>('updateFooterTheme'),
  updateGNBTabExpose: createAction<{
    isGnbTab: boolean;
  }>('updateGNBTabExpose'),
};

export const GNB_DEFAULT_COLOR: RGB = {
  r: 255,
  g: 255,
  b: 255,
};
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export enum GNBSearchActiveType {
  cover,
  block,
}

export enum GNBTransparentType {
  transparent,
  default,
}

export enum FooterTheme {
  default,
  dark,
}

export enum GNBColorLevel {
  DARK = 'dark',
  BRIGHT = 'bright',
  TRANSPARENT = 'transparent',
  DEFAULT = 'default',
}

export interface CommonUIState {
  gnbColor: RGB;
  gnbColorLevel: GNBColorLevel;
  gnbSearchActiveType: GNBSearchActiveType;
  gnbTransparentType: GNBTransparentType;
  isGnbTab: boolean;
  footerTheme: FooterTheme;
}

export const INITIAL_STATE: CommonUIState = {
  gnbColor: GNB_DEFAULT_COLOR,
  gnbColorLevel: GNBColorLevel.DEFAULT,
  gnbSearchActiveType: GNBSearchActiveType.cover,
  gnbTransparentType: GNBTransparentType.default,
  isGnbTab: true,
  footerTheme: FooterTheme.default,
};

export const commonUIReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

commonUIReducer.on(Actions.updateSearchActiveType, (state, action) => ({
  ...state,
  gnbSearchActiveType: action.gnbSearchActiveType,
}));

commonUIReducer.on(Actions.updateGNBColor, (state, action) => {
  const { color } = action;
  const redCalc = color.r * 0.299;
  const greenCalc = color.g * 0.587;
  const blueCalc = color.b * 0.114;
  return {
    ...state,
    gnbColor: color,
    gnbColorLevel: isDefaultColor(color)
      ? GNBColorLevel.DEFAULT
      : color.r === GNB_DEFAULT_COLOR.r && redCalc + greenCalc + blueCalc > 186
      ? GNBColorLevel.BRIGHT
      : GNBColorLevel.DARK,
  };
});

commonUIReducer.on(Actions.updateGNBTransparent, (state, action) => ({
  ...state,
  gnbTransparentType: action.transparentType,
}));

commonUIReducer.on(Actions.updateFooterTheme, (state, action) => ({
  ...state,
  footerTheme: action.theme,
}));

commonUIReducer.on(Actions.updateGNBTabExpose, (state, action) => ({
  ...state,
  isGnbTab: action.isGnbTab,
}));
