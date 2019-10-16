import request from 'app/config/axios';
import { CollectionResponse } from 'app/services/collection/requests';
import { BigBanner } from 'app/services/home';
import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';

export interface ArticleHomeResponse {
  bigBanners: BigBanner[];
  collections: CollectionResponse[];
}

export const requestArticleHome = (): Promise<ArticleHomeResponse> => {
  return request({
    // TODO: API URL은 추후 ARTICLE HOME API로 교체
    url: `/api/pages/home`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ArticleHomeResponse>>(response, { recursive: true }).data);
};
