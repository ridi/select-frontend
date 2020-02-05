import { AxiosResponse } from 'axios';
import * as qs from 'qs';

import { camelize } from '@ridi/object-case-converter';

import request from 'app/config/axios';
import env from 'app/config/env';
import { Book } from 'app/services/book';
import { CollectionId } from 'app/services/collection';
import { CollectionType } from 'app/services/home';

export interface CollectionResponse {
  collectionId: number;
  totalCount: number;
  type: CollectionType;
  title: string;
  books: Book[];
}

export const requestCollection = (
  collectionId: CollectionId,
  page: number,
): Promise<CollectionResponse> => {
  const url = `/api/pages/collections/${collectionId}`;
  const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  if (collectionId === 'spotlight') {
    return request({
      url: '/api/pages/collections/spotlight',
      method: 'GET',
    }).then(
      response => camelize<AxiosResponse<CollectionResponse>>(response, { recursive: true }).data,
    );
  }
  let params = {
    page,
  };
  if (collectionId === 'popular' && queryString.test_group && queryString.test_group.length > 0) {
    params = Object.assign(params, { test_group: queryString.test_group });
  }
  return request({
    url,
    method: 'GET',
    params,
  }).then(
    response => camelize<AxiosResponse<CollectionResponse>>(response, { recursive: true }).data,
  );
};
