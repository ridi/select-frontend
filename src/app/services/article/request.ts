import { DateDTO } from 'app/types';

export interface ArticleResponse {
  id: number;
  name: string;
  thumbnailUrl?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  authorId?: number;
  channelId: number;
}

export interface ArticleListResponse {
  totalCount: number;
  totalPage: number;
  next?: string;
  previous?: string;
  results: ArticleResponse[];
}
