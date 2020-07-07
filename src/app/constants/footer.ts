import { RoutePaths } from 'app/constants';
import {
  ANDROID_APPSTORE_URL,
  getPlatformDetail,
  IOS_APPSTORE_URL,
} from 'app/utils/downloadUserBook';
import TwitterIcon from 'svgs/Twitter.svg';
import FaceBookIcon from 'svgs/FaceBook.svg';
import InstaIcon from 'svgs/Insta.svg';

export interface LinkItem {
  label: string;
  to?: string;
  href?: string;
  isBold?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGElement>>;
  section?: string;
}

const DownloadUrl = (() => {
  const WEB_URL = 'https://ridibooks.com/support/app/download';
  let _downloadUrl = WEB_URL;
  const platformDetail = getPlatformDetail();
  if (platformDetail.isAndroid) {
    _downloadUrl = ANDROID_APPSTORE_URL;
  } else if (platformDetail.isIos) {
    _downloadUrl = IOS_APPSTORE_URL;
  }
  return _downloadUrl;
})();

export const FooterLinks: {
  [linkKey: string]: LinkItem;
} = {
  DOWNLOAD: {
    label: '뷰어 다운로드',
    href: DownloadUrl,
    section: 'select.footer.viewer-download',
  },
  GUIDE: {
    label: '이용 방법',
    to: RoutePaths.GUIDE,
    section: 'select.footer.how-to-use',
  },
  VOUCHER: {
    label: '이용권 등록',
    to: RoutePaths.VOUCHER,
    section: 'select.footer.voucher',
  },
  FAQ: {
    label: 'FAQ',
    href: 'https://help.ridibooks.com/hc/ko/categories/360000139267',
    section: 'select.footer.faq',
  },
  NEWS_LETTER: {
    label: '뉴스레터 구독',
    href:
      'https://page.stibee.com/subscriptions/59319?utm_source=operation&utm_medium=banner&utm_campaign=inhouse&utm_content=letter',
    section: 'select.footer.news-letter',
  },
  INSTA: {
    label: '인스타그램',
    href: 'https://www.instagram.com/ridiselect/',
    icon: InstaIcon,
    section: 'select.footer.social-media.instagram',
  },
  TWITTER: {
    label: '트위터',
    href: 'https://twitter.com/ridiselect',
    icon: TwitterIcon,
    section: 'select.footer.social-media.twitter',
  },
  FACEBOOK: {
    label: '페이스북',
    href: 'https://facebook.com/ridiselect ',
    icon: FaceBookIcon,
    section: 'select.footer.social-media.facebook',
  },
  CLOSING: {
    label: '종료 예정 도서',
    to: RoutePaths.CLOSING_RESERVED_BOOKS,
  },
  TERM: {
    label: '이용약관',
    href: 'https://policy.ridi.com/legal/terms',
  },
  PRIVACY: {
    label: '개인 정보 처리 방침',
    href: 'https://policy.ridi.com/legal/privacy',
    isBold: true,
  },
  YOUTH: {
    label: '청소년 보호 정책',
    href: 'https://policy.ridi.com/legal/youth',
  },
};

export const CorpInfo = {
  ADDRESS: '서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)',
  NAME: '리디 (주)',
  CEO: '대표 배기식',
  REGISTRATION: '사업자등록번호 120-87-27435',
  MAIL_ORDER: '통신판매업신고 제 2009-서울강남 35-02139호',
};
