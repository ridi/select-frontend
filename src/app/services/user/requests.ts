import { camelize } from '@ridi/object-case-converter';

import request from 'app/config/axios';
import env from 'app/config/env';
import { UserRidiSelectBookResponse } from 'app/services/mySelect/requests';
import { SubscriptionState } from 'app/services/user';
import { DateDTO } from 'app/types';
import axios, { AxiosResponse } from 'axios';

export interface Ticket {
  id: number;
  purchaseDate: DateDTO;
  startDate: DateDTO;
  endDate: DateDTO;
  cancelDate: DateDTO;
  isCanceled: boolean;
  isCancellable: boolean;
  isFreePromotion: boolean;
  paymentMethod: string;
  price: number;
  title: string;
  currency: string;
  formattedPrice: string;
  voucherCode?: string;
  voucherExpireDate?: DateDTO;
  ticketIdsToBeCanceledWith: number[];
}

// export interface SubscriptionResponse extends SubscriptionState {
//   subscription: SubscriptionState;
// }

export type SubscriptionResponse = SubscriptionState;

export interface PurchasesResponse {
  totalCount: number;
  size: number;
  tickets: Ticket[];
}

export interface MySelectHistoryResponse {
  totalCount: number;
  totalPage: number;
  size: 0;
  userRidiSelectBooks: UserRidiSelectBookResponse[];
}

export interface CancelPurchaseResponse {
  code: string;
  message: string;
}

export interface AccountsMeResponse {
  result: {
    id: string,
    idx: number,
    email: string,
    is_verified_adult: boolean,
  };
}

export interface PayMeResponse {
  has_pin: boolean;
  payment_methods: {
    cards: Card[];
  };
  user_id: string;
}

export interface Card {
  color: string;
  iin: string;
  issuer_name: string;
  logo_image_url: string;
  payment_method_id: string;
  subscriptions: string[];
}

export const requestSubscription = (): Promise<AxiosResponse<SubscriptionResponse>> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/subscription`,
    method: 'GET',
  }).then((response: AxiosResponse<SubscriptionResponse>) =>
    camelize<AxiosResponse<SubscriptionResponse>>(response.data, { recursive: true }));

export const requestTicketInfo = (): Promise<AxiosResponse<{ availableUntil: DateDTO }>> =>
  request({
    url: `${env.STORE_API}/users/me/tickets/available`,
    method: 'GET',
  }).then((response: AxiosResponse<{ availableUntil: DateDTO }>) =>
    camelize<AxiosResponse<{ availableUntil: DateDTO }>>(response.data, { recursive: true }));

export const requestPurchases = (page: number): Promise<AxiosResponse<PurchasesResponse>> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/purchases`,
    params: { page },
    method: 'GET',
  }).then((response: AxiosResponse<PurchasesResponse>) =>
    camelize<AxiosResponse<PurchasesResponse>>(response.data, { recursive: true }));

export const requestCancelPurchase = (ticketId: number): Promise<AxiosResponse<CancelPurchaseResponse>> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/purchases/${ticketId}`,
    method: 'DELETE',
  });

export const reqeustMySelectHistory = (page: number): Promise<AxiosResponse<MySelectHistoryResponse>> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/books/history`,
    method: 'GET',
    params: { page },
  }).then((response) =>
    camelize<AxiosResponse<MySelectHistoryResponse>>(response.data, { recursive: true }));

export const reqeustDeleteMySelectHistory = (mySelectBookIds: number[]): Promise<AxiosResponse<any>> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/books/history`,
    method: 'DELETE',
    data: {
      user_select_book_ids: mySelectBookIds,
    },
  });

export const requestUnsubscribe = (subscriptionId: number): Promise<AxiosResponse<any>> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/subscription/${subscriptionId}`,
    method: 'DELETE',
  });

export const requestCancelUnsubscription = (subscriptionId: number): Promise<AxiosResponse<any>> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/subscription/${subscriptionId}`,
    method: 'PUT',
  });

export const requestAccountsMe = (): Promise<AxiosResponse<AccountsMeResponse>> =>
  axios({
    url: `${env.ACCOUNT_API}/accounts/me`,
    method: 'GET',
    timeout: 3000,
    withCredentials: true,
  });

export const requestPayInfo = (): Promise<AxiosResponse<PayMeResponse>> =>
  axios({
    url: `${env.PAY_API}/me`,
    method: 'GET',
    withCredentials: true,
  });
