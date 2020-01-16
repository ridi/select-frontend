export const getTitleByPath = (path: string): string => {
  switch (path) {
    case '/': {
      return '리디셀렉트 - 베스트셀러부터 프리미엄 아티클까지';
    }
    case '/books': {
      return '서비스 도서 목록 - 리디셀렉트';
    }
    case '/article/channels': {
      return '아티클 전체 채널 목록 - 리디셀렉트';
    }
    case '/guide': {
      return '이용 방법 - 리디셀렉트';
    }
  }

  return null;
};
