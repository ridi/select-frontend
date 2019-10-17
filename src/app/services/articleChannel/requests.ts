import { camelize } from '@ridi/object-case-converter';
import { AxiosResponse } from 'axios';

import request from 'app/config/axios';
import { ArticleChannel } from 'app/services/articleChannel';

export interface ArticleChannelListResponse {
  totalCount: number;
  results: ArticleChannel[];
}

export const requestArticleChannelList = (): Promise<ArticleChannelListResponse> => (
  request({
    url: `/article/channels/?include=articles`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleChannelListResponse>>(response, { recursive : true }).data));
