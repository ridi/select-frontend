import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { ArticleChannel } from 'app/services/articleChannel';
import { ArticleRequestIncludableData } from 'app/types';
import { AxiosResponse } from 'axios';

export interface ArticleChannelListResponse {
  totalCount: number;
  results: ArticleChannel[];
}

export const requestArticleChannelList = (includeData?: ArticleRequestIncludableData[]): Promise<ArticleChannelListResponse> => (
  request({
    url: `/article/channels${includeData && `/?include=${includeData.join('|')}`}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannelListResponse>>(response, { recursive : true }).data));
