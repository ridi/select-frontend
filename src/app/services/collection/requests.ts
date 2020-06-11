import { camelize } from '@ridi/object-case-converter';
import { AxiosResponse } from 'axios';
import * as qs from 'qs';

import env from 'app/config/env';
import request from 'app/config/axios';
import { Book } from 'app/services/book';
import { COUNT_PER_PAGE } from 'app/constants';
import { CollectionType, CollectionId, ReservedCollectionIds } from 'app/services/collection';

export interface CollectionResponse {
  collectionId: number;
  totalCount?: number;
  type: CollectionType;
  title: string;
  books: Book[];
}

export interface PopularBooksResponse {
  books: Book[];
  totalCount: number;
  totalPage: number;
  size: number;
  page: number;
}

export const requestCollection = (
  collectionId: CollectionId,
  page: number,
): Promise<CollectionResponse> => {
  const url = `/api/pages/collections/${collectionId}`;
  const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  if (collectionId === ReservedCollectionIds.SPOTLIGHT) {
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
  if (
    collectionId === ReservedCollectionIds.POPULAR &&
    queryString.test_group &&
    queryString.test_group.length > 0
  ) {
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

export const requestPopularBooks = ({
  userGroup,
  page,
  countPerPage,
}: {
  userGroup?: number;
  page?: number;
  countPerPage?: number;
}): Promise<PopularBooksResponse> => {
  const parameters = qs.stringify({
    user_group: userGroup,
    page,
    size: countPerPage || COUNT_PER_PAGE,
  });
  return request({
    url: `${env.BESTSELLER_API}/select/popular/books?${parameters}`,
    method: 'GET',
    withCredentials: true,
  }).then(
    response => camelize<AxiosResponse<PopularBooksResponse>>(response, { recursive: true }).data,
  );
};
