import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';

import { Book } from 'app/services/book';
import * as qs from 'qs';

export type closingReservedTermType = 'thisMonth' | 'nextMonth';

export interface ClosingReservedBooksResponse {
  totalCount: number;
  size: number;
  books: Book[];
}

export const requestClosingReservedBooks = (
  termType: closingReservedTermType,
  page: number,
): Promise<ClosingReservedBooksResponse> => {
  const url = '/api/books';
  const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  let params = {
    page,
    expire_in: termType === 'thisMonth' ? 'this_month' : 'next_month',
  };
  if (queryString.test_group && queryString.test_group.length > 0) {
    params = Object.assign(params, { test_group: queryString.test_group });
  }
  return request({
    url,
    method: 'GET',
    params,
  }).then(
    response =>
      camelize<AxiosResponse<ClosingReservedBooksResponse>>(response, { recursive: true }).data,
  );
};
