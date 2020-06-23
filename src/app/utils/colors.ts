/**
 * rgb hex 값과 alpha 값을 조합하여 rgba hex 값을 반환
 * @param rgbHex rgb hex값
 * @param alpha 0 ~ 1 사이의 알파값
 * @return rgbaHex
 */
export const rgba = (rgbHex: string, alpha: number): string => {
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${rgbHex}${alphaHex}`;
};
