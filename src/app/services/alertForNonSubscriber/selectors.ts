import { RidiSelectState } from 'app/store';
import { getIsIosInApp } from 'app/services/environment/selectors';

export const getHasSubscribedBefore = (state: RidiSelectState) => state.user.hasSubscribedBefore;

export const getAlertVisible = (state: RidiSelectState) => {
  const hasAvailableTicket = state.user.hasAvailableTicket;
  const isUserFetching = state.user.isFetching;
  const isIosInApp = getIsIosInApp(state);

  return !isIosInApp && !isUserFetching && !hasAvailableTicket;
}
