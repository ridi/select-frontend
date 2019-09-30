export enum FetchStatusFlag {
  IDLE,
  FETCHING,
  FETCH_ERROR,
}

export enum FetchErrorFlag {
  UNEXPECTED_BOOK_ID,
  UNEXPECTED_PAGE_PARAMS,
  OUT_OF_PAGINATION_SCOPE,
}

export enum ErrorStatus {
  MAINTENANCE = 'maintenance',
}

export enum ContentsType {
  BOOK = 'book_contents',
  ARTICLE = 'article_contents',
}

export enum PageTitleText {
  PREFIX = '리디셀렉트',
  HOME = '',
  INTRO = '신간도 베스트셀러도 월정액으로 제한없이',
  ERROR = '',
  AVAILABLE_BOOKS = '서비스 도서 목록',
  CATEGORY = '카테고리',
  CHARTS = '인기 도서',
  GUIDE = '이용 방법',
  MANAGE_SUBSCRIPTION = '구독 관리',
  MY_SELECT = '마이 셀렉트',
  MY_SELECT_HISTORY = '도서 이용 내역',
  NEW_RELEASE = '최신 업데이트',
  ORDER_HISTORY = '결제 내역',
  SETTING = '셀렉트 관리',
  NOT_AVAILABLE_BOOK = '',
  CLOSING_RESERVED_BOOKS = '종료 예정 도서',
  // 셀렉트 2.0 - 아티클
  ARTICLE_HOME = '',
  ARTICLE_FOLLOWING = '',
  ARTICLE_CHANNEL = '',
  ARTICLE_STORED = '',
}

export enum RoutePaths {
  ROOT = '/',
  HOME = '/home',
  NEW_RELEASE = '/new-releases',
  CHARTS = '/charts',
  COLLECTION = '/selection/:collectionId',
  CATEGORY = '/categories',
  MY_SELECT = '/my-select',
  BOOK_DETAIL = '/book/:bookId',
  SETTING = '/settings',
  MANAGE_SUBSCRIPTION = '/manage-subscription',
  ORDER_HISTORY = '/order-history',
  MY_SELECT_HISTORY = '/my-select-history',
  SEARCH_RESULT = '/search',
  GUIDE = '/guide',
  AVAILABLE_BOOKS = '/books',
  INTRO = '/intro',
  NOT_AVAILABLE_BOOK = '/not-available-book',
  CLOSING_RESERVED_BOOKS = '/closing-reserved-book',
  /* 셀렉트 2.0 아티클 */
  ARTICLE_HOME = '/article/home',
  ARTICLE_FOLLOWING = '/article/follow',
  ARTICLE_CHANNEL = '/article/channel',
  ARTICLE_STORED = '/article/store',
}
