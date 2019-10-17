import { ArticleResponse } from 'app/services/article/request';

/** MockUp */

export const ArticleListMockUp: ArticleResponse[] = [];
for (let articleCnt = 1; articleCnt <= 16; articleCnt += 1) {
  ArticleListMockUp.push({
    id: articleCnt,
    title: `디지털 시대, '만남'의 의미가 재정의 되고 있습니다`,
    authorId: 11,
    channelId: 12345678,
    thumbnailUrl: require(`images/mockImages/articleThumbnail/rectangle_${articleCnt}.jpg`),
    regDate: '2019-10-15T07:20:22+09:00',
    lastModified: '2019-10-15T07:20:22+09:00',
    author: {
      id: 11,
      name: '윤성원',
      regDate: '2019-10-15T07:20:22+09:00',
      lastModified: '2019-10-15T07:20:22+09:00',
      channelId: 8,
    },
  });
}

export const ArticleChartsMockUp: ArticleResponse[] = [];
for (let cnt = 1; cnt <= 10; cnt += 1) {
  ArticleChartsMockUp.push({
    id: cnt,
    title: `"리더지만 아무것도 몰라요" 초보 리더를 위한 추천 도서`,
    authorId: 11,
    channelId: 12345678,
    thumbnailUrl: require(`images/mockImages/articleSmallThumbnail/square_${cnt}.jpg`),
    regDate: '2019-10-15T07:20:22+09:00',
    lastModified: '2019-10-15T07:20:22+09:00',
    author: {
      id: 11,
      name: '윤성원',
      regDate: '2019-10-15T07:20:22+09:00',
      lastModified: '2019-10-15T07:20:22+09:00',
      channelId: 8,
    },
    channel: {
      id: 21,
      name: '이코노미스트',
      description: '다양하고 유익한 경제정보',
      regDate: '2019-10-15T06:55:07+09:00',
      lastModified: '2019-10-15T06:55:07+09:00',
      thumbnailUrl: 'https://s3.ap-northeast-2.amazonaws.com/select-img.ridi.io/channels/economist.jpg',
    },
  });
}

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

/* tslint:disable */
export const testMockJson = JSON.parse('{"type":"doc","content":[{"type":"title","content":[{"type":"text","text":"메리 미커가 말하는 2019년 인터넷 비즈니스 트렌드"}]},{"type":"paragraph","content":[{"type":"text","text":"인터넷 비즈니스 트렌드와 관련해 방대한 양의 시사점을 던져주는 ‘메리 미커 보고서’가 최근 발표되었습니다."}]},{"type":"paragraph","content":[{"type":"text","text":"(참조 – Mary Meeker Internet Trends 2019) 흔히들 ‘모두가 소셜 미디어에 공유하지만,"}]},{"type":"paragraph","content":[{"type":"text","text":"대부분은 읽지 않는다’고 말하지만 그동안 아웃스탠딩에선 독자분들을 위해 이를 매년 정리해서 공유해왔는데요"}]},{"type":"paragraph","content":[{"type":"text","text":"(참조 – "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://outstanding.kr/marymeeker20160602/"}}],"text":"2016년 메리미커 보고서"},{"type":"text","text":") (참조 – "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://outstanding.kr/marymeeker20160602/"}}],"text":"2017년 메리미커 보고서"},{"type":"text","text":") (참조 – "},{"type":"text","marks":[{"type":"link","attrs":{"href":"https://outstanding.kr/marymeeker20160602/"}}],"text":"2018년 메리미커 보고서"},{"type":"text","text":")"}]},{"type":"paragraph","content":[{"type":"text","text":"올해도 보고서 내용 중에서 관심을 가질만한 사항들을 한 번 정리해보고자 합니다. ^^"}]},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","text":"올해도 보고서 내용 중에서 관심을 가질만한 사항들을 한 번 정리해보고자 합니다. ^^"}]},{"type":"heading","attrs":{"level":1},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"1. 인터넷 시장은 성숙기에 접어들고 있다."}]},{"type":"paragraph","content":[{"type":"text","text":"늘 그렇듯, 메리 미커 보고서는 ‘전 세계 인터넷 이용 현황’부터 업데이트를 하는데요."}]},{"type":"paragraph","content":[{"type":"text","text":"올해 이 부분과 관련해 주목할만한 점은,"}]}]}');