import { AxiosResponse } from 'axios';
import * as qs from 'qs';

import request from 'app/config/axios';
import { CollectionResponse } from 'app/services/collection/requests';
import { BigBanner } from 'app/services/home';

import { camelize } from '@ridi/object-case-converter';

export interface HomeResponse {
  bigBanners: BigBanner[];
  banners: BigBanner[];
  collections: CollectionResponse[];
}

export const requestHome = (): Promise<HomeResponse> => {
  const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  return request({
    url: `/api/pages/home`,
    params: queryString.test_group && queryString.test_group.length > 0 ? { test_group: queryString.test_group } : {},
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<HomeResponse>>(response, { recursive: true }).data);
};

export const requestBanner = (spot: string): Promise<BigBanner[]> => (
  request({
    url: `/api/banners/?spot=${spot}`,
    method: 'GET',
    withCredentials: false,
  }).then((response) => camelize<AxiosResponse<BigBanner[]>>(response, { recursive: true }).data)
);
