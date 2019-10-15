
/** MockUp */
export interface ArticleList {
  title: string;
  channel: string;
  articleId: number;
  channelId: number;
  thumbUrl: string;
}
export interface ArticleChartList {
  title: string;
  channel: string;
  thumbUrl: string;
  rank: number;
  articleId: number;
  channelId: number;
}

export const ArticleListMockUp: ArticleList[] = [
  {
    title: `디지털 시대, '만남'의 의미가 재정의 되고 있습니다`,
    channel: `아웃스탠딩`,
    articleId: 12345678,
    channelId: 12345678,
    thumbUrl: '',
  },
  {
    title: `"리더지만 아무것도 몰라요" 초보 리더를 위한 추천 도서`,
    channel: `디에디트`,
    articleId: 12345678,
    channelId: 12345678,
    thumbUrl: '',
  },
  {
    title: `'역덕' 이코노미스트 홍춘옥 작가 인터뷰`,
    channel: `리디셀렉트`,
    articleId: 12345678,
    channelId: 12345678,
    thumbUrl: '',
  },
  {
    title: `손정의에 대한 우려의 목소리가 나오는 5가지 이유`,
    channel: `이코노미스트`,
    articleId: 12345678,
    channelId: 12345678,
    thumbUrl: '',
  },
];
export const ArticleChartsMockUp: ArticleChartList[] = [
  {
    title: `요즘 쇼핑채널들은 어떻게 고객을 끌어오나?`,
    channel: `아웃스탠딩`,
    thumbUrl: '',
    rank: 1,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `130년 된 글로벌 스킨케어 브랜드가 혁신하는 법! (feat. K뷰…`,
    channel: `이코노미스트`,
    thumbUrl: '',
    rank: 2,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `한국의 디즈니는 어디서 나올까`,
    channel: `아웃스탠딩`,
    thumbUrl: '',
    rank: 3,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `인공지능 기술은 이미 실생활에서 인간을 돕고 있습니다`,
    channel: `Quartz`,
    thumbUrl: '',
    rank: 4,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `인도 방갈로르가 ‘넥스트 실리콘밸리’인 이유 5가지`,
    channel: `AXIOS`,
    thumbUrl: '',
    rank: 5,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `워런 버핏이 선택한 ‘전용기 공유 회사’ 넷제츠 이야기`,
    channel: `리디셀렉트`,
    thumbUrl: '',
    rank: 6,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `중소기업을 타겟팅한 해외 핀테크 유니콘 7곳`,
    channel: `이코노미스트`,
    thumbUrl: '',
    rank: 7,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `디지털 시대, ‘만남’의 의미가 재정의 되고 있습니다`,
    channel: `아웃스탠딩`,
    thumbUrl: '',
    rank: 8,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `‘역덕’ 이코노미스트 홍춘옥 작가 인터뷰 `,
    channel: `리디셀렉트`,
    thumbUrl: '',
    rank: 9,
    articleId: 12345678,
    channelId: 12345678,
  },
  {
    title: `손정의에 대한 우려의 목소리가 나오는 5가지 이유`,
    channel: `이코노미스트`,
    thumbUrl: '',
    rank: 10,
    articleId: 12345678,
    channelId: 12345678,
  },
];

export interface FollowingChannelType {
  channelId: number;
  channelName: string;
  channelThumbnail: string;
}

export const FollowingChannelMockUp: FollowingChannelType[] = [
  {
    channelId: 12345678,
    channelName: `아웃스탠딩`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `임정욱`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `비즈니스 인사이드`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `Pinch`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `겨울서점`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `AXIOS`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `아웃스탠딩`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `임정욱`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `비즈니스 인사이드`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `Pinch`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `겨울서점`,
    channelThumbnail: ``,
  },
  {
    channelId: 12345678,
    channelName: `AXIOS`,
    channelThumbnail: ``,
  },
];
