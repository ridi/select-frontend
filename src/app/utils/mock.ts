import { ArticleResponse } from 'app/services/article/request';

/** MockUp */
export interface ArticleChartList {
  title: string;
  channel: string;
  thumbUrl: string;
  rank: number;
  articleId: number;
  channelId: number;
}

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
