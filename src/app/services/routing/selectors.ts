import * as qs from 'qs';
import { createSelector } from 'reselect';

import { RidiSelectState } from 'app/store';

export const selectSearch = (state: RidiSelectState) => state.router.location!.search || '';

export const getPageQuery = createSelector(
  [selectSearch],
  (search: string): number => {
    const parsedQuery = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    return parsedQuery.page ? Number(parsedQuery.page) : 1;
  },
);
