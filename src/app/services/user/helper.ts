import request from 'app/config/axios';
import env from 'app/config/env';
import { requestAccountsMe } from 'app/services/user/requests';
import { DateDTO } from 'app/types';
import axios, { AxiosError } from 'axios';

interface RidiSelectTicketDTO {
  hasAvailableTicket: boolean;
  hasSubscribedBefore: boolean;
  availableUntil?: DateDTO;
  fetchTicketError: AxiosError|null;
}

interface RidiSelectAccountDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
}

export interface UserDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
  availableUntil?: DateDTO;
  hasAvailableTicket: boolean;
  hasSubscribedBefore: boolean;
}

const NOT_LOGGED_IN_ACCOUNT_INFO: RidiSelectAccountDTO = {
  isLoggedIn: false,
  uId: '',
  email: '',
};

const fetchTicketInfo = async (): Promise<RidiSelectTicketDTO> => 
  // TODO: hasSubscribedBefore 키 네임이 더이상 구독 여부가 아니라 반대로 현재 무료 프로모션 가능여부인지 값으로 변경되어 수정 필요
  request({
    url: `${env.STORE_API}/api/select/users/me/tickets/available`,
    withCredentials: true,
  }).then((response) => ({
    hasAvailableTicket: true,
    hasSubscribedBefore: true,
    availableUntil: response.data.available_until,
    fetchTicketError: null,
  })).catch((e) => ({
    hasAvailableTicket: false,
    hasSubscribedBefore: (
      (e.response && e.response.data) ? !e.response.data.is_free_promotion_available : true
    ),
    fetchTicketError: e,
  }))
;

const fetchAccountInfo = async (): Promise<RidiSelectAccountDTO> => requestAccountsMe().then((response) => ({
  isLoggedIn: true,
  uId: response.data.result.id,
  email: response.data.result.email,
})).catch((e) => NOT_LOGGED_IN_ACCOUNT_INFO);

export const fetchUserInfo = async (): Promise<UserDTO> => {
  const fetchedTicketInfo = await fetchTicketInfo();
  const { fetchTicketError, ...ticketInfo } = fetchedTicketInfo;

  // 401 응답이 아닌 경우에만 계정 정보 fetch
  return (fetchTicketError === null || (fetchTicketError.response && fetchTicketError.response.status !== 401)) ? {
    ...ticketInfo,
    ...await fetchAccountInfo(),
  } : {
    ...ticketInfo,
    ...NOT_LOGGED_IN_ACCOUNT_INFO,
  };
};
