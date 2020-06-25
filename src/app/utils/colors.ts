/**
 * rgb hex 값과 alpha 값을 조합하여 rgba hex 값을 반환
 * @param rgbHex 4자리 혹은 7자리 rgb hex값
 * @param alpha 0 ~ 1 사이의 알파값
 * @return rgbaHex, 파라미터 오류시 magenta 반환
 */
export const ErrorColor = 'magenta';
const RGBHexLength = {
  SHORT: 4,
  FULL: 7,
};
const rgbHexRE = /^#([0-9A-Fa-f]{3}){1,2}/;
const isColorHex = (rgbHex: string) =>
  (rgbHex.length === RGBHexLength.SHORT || rgbHex.length === RGBHexLength.FULL) &&
  rgbHexRE.test(rgbHex);

const toFullHex = (rgbHex: string) =>
  rgbHex.length === RGBHexLength.SHORT
    ? `#${Array.from({ length: RGBHexLength.SHORT - 1 }, (_, index) =>
        rgbHex.charAt(index + 1).repeat(2),
      ).join('')}`
    : rgbHex;

export const rgba = (rgbHex: string, alpha: number): string => {
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  if (alpha > 1 || alpha < 0 || !isColorHex(rgbHex.trim())) {
    return ErrorColor;
  }
  return `${toFullHex(rgbHex)}${alphaHex}`;
};
