import Raven from 'raven-js';
import env from 'app/config/env';

const RAVEN_OPTIONS = {
  release: process.env.CI_COMMIT_SHA || 'latest',
  sampleRate: 0.1,
  ignoreErrors: [
    // Random plugins/extensions
    'top.GLOBALS',
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'http://loading.retry.widdit.com/',
    'atomicFindClose',
    // Facebook borked
    'fb_xd_fragment',
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',
    // CORS
    'Blocked a frame with origin "https://ridibooks.com" from accessing a frame',
    // See https://github.com/SamsungInternet/support/issues/56
    'document.getElementsByClassName.ToString is not a function',
    // NAVER App (See https://developers.naver.com/forum/posts/21372)
    "Cannot call method 'checkDomStatus' of undefined",
    "Cannot read property 'checkDomStatus' of undefined",
    // NAVER App
    "Cannot read property 'childNodes' of null",
    "Can't find variable: NaverDetectLang",
    // See https://stackoverflow.com/questions/49077748/androidinterface-is-not-defined-what-gives
    'androidInterface is not defined',
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=590375
    "TypeError: undefined is not an object (evaluating '__gCrWeb.autofill.extractForms')",
    // EZWEL
    'net.sourceforge.htmlunit.corejs.javascript.Undefined',
    '"regeneratorRuntime" is not defined',
    // Almost all occur in Google Chrome
    'Unexpected token else',
    // Triggered from an unknown linux user
    "Failed to execute 'postMessage' on 'Window': function (s){return eval(s);} could not be cloned",
    // IE, Edge only
    /^undefined$/,
    'Target container is not a DOM element.',
    // Chrome only
    "Cannot read property 'processEvent' of undefined",
    'Unexpected identifier',
    "Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules",
    // Facebook crawler. see https://app.asana.com/0/325622807541174/823860092252432
    'ReferenceError: _isMatchingDomain is not defined',
    // quit while calling Tracking uri
    'TypeError: Failed to fetch at _promiseRejectionHandler',
    /^https:\/\/s3\.ap-northeast-2\.amazonaws\.com\/beacon-select\/beacon_select\.gif\?event=/,
  ],
  whitelistUrls: [/https?:\/\/(.+\.)?ridibooks\.com/, '<anonymous>'],
};

if (env.SENTRY_DSN_FRONTEND && env.production) {
  Raven.config(env.SENTRY_DSN_FRONTEND, RAVEN_OPTIONS).install();
}
