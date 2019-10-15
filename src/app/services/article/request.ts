import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { ChannelResponse } from 'app/services/articleChannel/request';
import { ArticleRequestIncludableData, DateDTO } from 'app/types';
import { AxiosResponse } from 'axios';

export interface AuthorResponse {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  channelId: number;
}

export interface ArticleResponse {
  id: number;
  title: string;
  reg_date: DateDTO;
  lastModified: DateDTO;
  channelId: number;
  thumbnailUrl: string;
  authorId: number;
  author?: AuthorResponse;
  channel?: ChannelResponse;
}

export interface ArticleListResponse {
  totalCount: number;
  totalPage: number;
  next?: string;
  previous?: string;
  results: ArticleResponse[];
}

export const requestArticles = (includeData?: ArticleRequestIncludableData[]): Promise<ArticleListResponse> => {
  let requestUrl = '/article/articles';
  if (includeData) {
    requestUrl = `${requestUrl}/?include=${includeData.join('|')}`;
  }
  return request({
    url: requestUrl,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleListResponse>>(response, { recursive: true }).data);
};
