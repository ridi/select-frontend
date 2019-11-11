import { FetchStatusFlag } from 'app/constants';
import * as PostRobot from 'post-robot';

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Subtract<T, K> = Omit<T, keyof K>;

export type BookId = number;
export type ArticleId = number;
export type ChannelId = number;
export type DateDTO = string; // ISO8601: 2016-10-27T17:13:40+00:00 || 2016-10-27T17:13:40Z || 20161027T171340Z
export type MaskedUId = string; // 'hck***'

export enum ArticleRequestIncludableData {
  ARTICLE = 'articles',
  AUTHORS = 'authors',
  CHANNEL = 'channel',
  CONTENT = 'content',
  FOLLOWERS_COUNT = 'followers_count',
  IS_FOLLOWING = 'is_following',
  IS_FAVORITE = 'is_favorite',
}

export enum ArticleRequestOrderType {
  POPULAR = 'popular',
  RECENT = 'recent',
}

export enum ArticleRequestType {
  MAIN = 'main',
  RECOMMEND = 'recommend',
}

export interface ArticleRequestQueries {
  includes?: ArticleRequestIncludableData[];
  ordering?: ArticleRequestOrderType;
  type?: ArticleRequestType;
}

/*
 * Text need to be transformed (`/n` to `<br/>`) and includes html tags
 * (Need to be used in `dangerouslySetInnerHTML` prop)
 */
export type TextWithLF = string;

export interface ItemListByPage<P> {
  [pageNumber: number]: {
    fetchStatus: FetchStatusFlag; // 각 페이지별로 API 호출을 해야 하므로 페이지별로 존재
    itemList: P[];
    isFetched: boolean;
  };
}
export interface Paginated<Item> {
  pageCount?: number; // TODO: Do we nee this?
  itemCount?: number;
  itemListByPage: ItemListByPage<Item>;
}

declare global {
  interface Window {
    postRobot: typeof PostRobot;
    isLoginRequired: () => boolean;
    inApp: {
      mySelectBookInserted: (bookIds: string) => void
      mySelectBookDeleted: (bookids: string) => void
      openBrowser: (url: string) => void,
      initialRendered: () => void,
    };
    android: {
      mySelectBookInserted: (bookIds: string) => void
      mySelectBookDeleted: (bookids: string) => void
      openBrowser: (url: string) => void,
    };
  }
}
