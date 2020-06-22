import { rgba } from 'app/utils/colors';
import Colors from 'app/styles/colors';

describe('rgba', () => {
  it('rgba hex 값이 잘 변환 되는가', () => {
    expect(rgba(Colors.slategray_20, 0.5)).toEqual('#d1d5d980');
  });
  it('짧은 rgb hex 값이 잘 변환 되는가', () => {
    expect(rgba('#f0f', 0.5)).toEqual('#ff00ff80');
  });
  describe('잘못된 rgb hex 값 전달시 "magenta" 가 반환 되는가', () => {
    it('길이가 안맞는 경우', () => {
      expect(rgba('#ff', 0.5)).toEqual('magenta');
      expect(rgba('#fff1', 0.5)).toEqual('magenta');
      expect(rgba('#fff1231', 0.5)).toEqual('magenta');
    });
    it('"#" 이 누락된 경우', () => {
      expect(rgba('ff0000', 0.5)).toEqual('magenta');
    });
    it('hex값이 아닌 경우', () => {
      expect(rgba('#qq0000', 0.5)).toEqual('magenta');
    });
  });
  describe('잘못된 alpha 값 전달시 "magenta" 가 반환 되는가', () => {
    it('1보다 큰 경우', () => {
      expect(rgba(Colors.slategray_20, 100)).toEqual('magenta');
    });
    it('0보다 작은 경우', () => {
      expect(rgba(Colors.slategray_20, -10)).toEqual('magenta');
    });
  });
});
