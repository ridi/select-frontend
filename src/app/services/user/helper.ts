import request from 'app/config/axios';
import env from 'app/config/env';
import { requestAccountsMe } from 'app/services/user/requests';
import { DateDTO } from 'app/types';
import axios, { AxiosError } from 'axios';

interface RidiSelectTicketDTO {
  hasAvailableTicket: boolean;
  ticketEndDate?: DateDTO;
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
  ticketEndDate?: DateDTO;
  hasAvailableTicket: boolean;
}

const NOT_LOGGED_IN_ACCOUNT_INFO: RidiSelectAccountDTO = {
  isLoggedIn: false,
  uId: '',
  email: '',
};

const fetchTicketInfo = async (): Promise<RidiSelectTicketDTO> => {
  return request({
    url: `${env.STORE_API}/api/select/users/me/ticket`,
    withCredentials: true,
  }).then((response) => ({
    hasAvailableTicket: true,
    ticketEndDate: response.data.ticket_end_date,
    fetchTicketError: null,
  })).catch((e) => ({
    hasAvailableTicket: false,
    fetchTicketError: e,
  }));
};

const fetchAccountInfo = async (): Promise<RidiSelectAccountDTO> => {
  return requestAccountsMe().then((response) => {
    return {
      isLoggedIn: true,
      uId: response.data.result.id,
      email: response.data.result.email,
    };
  }).catch((e) => {
    return NOT_LOGGED_IN_ACCOUNT_INFO;
  });
};

export const fetchUserInfo = async (): Promise<UserDTO> => {
  const fetchedTicketInfo = await fetchTicketInfo();
  const { fetchTicketError, hasAvailableTicket, ticketEndDate } = fetchedTicketInfo;

  // 401 응답이 아닌 경우에만 계정 정보 fetch
  return (fetchTicketError === null || (fetchTicketError.response && fetchTicketError.response.status !== 401)) ? {
    hasAvailableTicket,
    ticketEndDate,
    ...await fetchAccountInfo(),
  } : {
    hasAvailableTicket,
    ticketEndDate,
    ...NOT_LOGGED_IN_ACCOUNT_INFO,
  };
};
