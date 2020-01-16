const getEnv = (key: string, env?: string) => process.env.NODE_ENV !== 'production'
  ? localStorage.getItem(key) || env
  : env;

export default {
  SORRY_URL: 'https://sorry.ridibooks.com',
  SELECT_URL: getEnv('SELECT_URL', process.env.SELECT_URL) || 'https://select.ridibooks.com',
  SELECT_API: getEnv('SELECT_API', process.env.SELECT_API) || 'https://select-api.ridibooks.com',
  STORE_URL: getEnv('STORE_URL', process.env.STORE_URL) || 'https://ridibooks.com',
  STORE_API: getEnv('STORE_API', process.env.STORE_API) || 'https://ridibooks.com',
  LIBRARY_URL: getEnv('LIBRARY_URL', process.env.LIBRARY_URL) || 'https://library.ridibooks.com',
  PAY_URL: getEnv('PAY_URL', process.env.PAY_URL) || 'https://pay.ridibooks.com',
  PAY_API: getEnv('PAY_API', process.env.PAY_API) || 'https://pay-api.ridibooks.com',
  ACCOUNT_API: getEnv('ACCOUNT_API', process.env.ACCOUNT_API) || 'https://account.ridibooks.com',
  SEARCH_API: getEnv('SEARCH_API', process.env.SEARCH_API) || 'https://search-api.ridibooks.com',
  OAUTH2_CLIENT_ID: process.env.OAUTH2_CLIENT_ID || '',
  FREE_PROMOTION_MONTHS: Number(process.env.FREE_PROMOTION_MONTHS) || 1,

  production: process.env.NODE_ENV === 'production',
  platform: {
    isIos: /iphone|ipad|ipod/i.test(window.navigator.userAgent),
    isAndroid: /android/i.test(window.navigator.userAgent),
    isIE: /msie|trident\//i.test(window.navigator.userAgent),
    isFirefox: /firefox\//i.test(window.navigator.userAgent),
    isRidibooks: /ridibooks\/[0-9]+\.?[0-9]*/i.test(window.navigator.userAgent),
    appVersion: '',
  },
};
