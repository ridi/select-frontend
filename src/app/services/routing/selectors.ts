import * as qs from 'qs';
import { createSelector } from 'reselect';

import { closingReservedTermType } from 'app/services/closingReservedBooks/requests';
import { RidiSelectState } from 'app/store';

export const selectSearch = (state: RidiSelectState) => state.router.location.search || '';

export const getPageQuery = createSelector([selectSearch], (search: string): number => {
  const parsedQuery = qs.parse(search, {
    ignoreQueryPrefix: true,
  });
  return parsedQuery.page ? Number(parsedQuery.page) : 1;
});

export const getClosingReservedBooksTermQuery = createSelector(
  [selectSearch],
  (search: string): closingReservedTermType => {
    const parsedQuery = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    return parsedQuery.termType ? parsedQuery.termType : 'thisMonth';
  },
);
