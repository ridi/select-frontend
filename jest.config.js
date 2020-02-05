const testAndCoverageIgnorePatterns = ['/node_modules/', '/__mocks__/', '__stories', 'd.ts'];

module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  testRegex: '(/__tests__/.*|(\\.|/|__)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transformIgnorePatterns: ['node_modules/(?!lodash-es|@ridi/rsg/)'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/types/**/*', '!**/__test__/*.*'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    'app(.*)$1': '<rootDir>/src/app/$1',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: testAndCoverageIgnorePatterns,
  moduleDirectories: ['node_modules', 'src'],
};
