import { createAction, createReducer } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { MySelectBook , userRidiSelectBookToMySelectBook } from 'app/services/mySelect';

import { UserDTO } from 'app/services/user/helper';
import { MySelectHistoryResponse, PurchasesResponse, SubscriptionResponse, Ticket } from 'app/services/user/requests';
import { DateDTO, ItemListByPage, Paginated } from 'app/types';
import { AxiosError, Method } from 'axios';

export const Actions = {
  fetchUserInfo: createAction<{
    isFetching: boolean,
  }>('fetchUserInfo'),

  initializeUser: createAction<{
    userDTO: UserDTO,
  }>('initializeUser'),

  loadSubscriptionRequest: createAction('loadSubscriptionRequest'),

  loadSubscriptionSuccess: createAction<{
    response: SubscriptionResponse,
  }>('loadSubscriptionSuccess'),

  loadSubscriptionFailure: createAction<{
    isFetched: boolean,
  }>('loadSubscriptionFailure'),

  clearPurchases: createAction('clearPurchases'),

  loadPurchasesRequest: createAction<{
    page: number,
  }>('loadPurchasesRequest'),

  loadPurchasesSuccess: createAction<{
    page: number,
    response: PurchasesResponse,
  }>('loadPurchasesSuccess'),

  loadPurchasesFailure: createAction<{
    page: number,
  }>('loadPurchasesFailure'),

  cancelPurchaseRequest: createAction<{
    purchaseId: number,
  }>('cancelPurchaseRequest'),

  cancelPurchaseSuccess: createAction<{
    purchaseId: number,
  }>('cancelPurchaseSuccess'),

  cancelPurchaseFailure: createAction<{
    purchaseId: number,
  }>('cancelPurchaseFailure'),

  loadMySelectHistoryRequest: createAction<{
    page: number,
  }>('loadMySelectHistoryRequest'),

  loadMySelectHistorySuccess: createAction<{
    page: number,
    response: MySelectHistoryResponse,
  }>('loadMySelectHistorySuccess'),

  loadMySelectHistoryFailure: createAction<{
    page: number,
    error: AxiosError,
  }>('loadMySelectHistoryFailure'),

  clearMySelectHistory: createAction('clearMySelectHistory'),

  deleteMySelectHistoryRequest: createAction<{
    mySelectBookIds: number[],
    page: number,
  }>('deleteMySelectHistoryRequest'),

  deleteMySelectHistorySuccess: createAction<{
    page: number,
    response: MySelectHistoryResponse,
  }>('deleteMySelectHistorySuccess'),

  deleteMySelectHistoryFailure: createAction('deleteMySelectHistoryFailure'),
  resetMySelectHistoryFetchedStatus: createAction('resetMySelectHistoryFetchedStatus'),

  unsubscribeRequest: createAction('unsubscribeRequest'),
  unsubscribeSuccess: createAction('unsubscribeSuccess'),
  unsubscribeFailure: createAction('unsubscribeFailure'),

  cancelUnsubscriptionRequest: createAction('cancelUnsubscriptionRequest'),
  cancelUnsubscriptionSuccess: createAction('cancelUnsubscriptionSuccess'),
  cancelUnsubscriptionFailure: createAction('cancelUnsubscriptionFailure'),

  loadAccountsMeRequest: createAction('loadAccountsMeRequest'),
  loadAccountsMeSuccess: createAction<{
    uId: string,
    email: string,
  }>('loadAccountsMeSuccess'),
  loadAccountsMeFailure: createAction('loadAccountsMeFailure'),

  cashReceiptIssueRequest: createAction<{
    ticketId: number,
    method: Method,
    issuePurpose?: string,
    issueNumber?: string,
  }>('CashReceiptIssueRequest'),
  cashReceiptIssueSuccess: createAction<{
    ticketId: number,
    method: Method,
    cashReceiptUrl: string | null,
  }>('CashReceiptIssueRequest'),
  cashReceiptIssueFailure: createAction('CashReceiptIssueRequest'),
};

export enum CashReceiptIssueType {
  INCOME_DEDUCTION = 'INCOME_DEDUCTION',
  EXPENSE_EVIDENCE = 'EXPENSE_EVIDENCE',
}

// TODO: 서버에서 내려주는 방식이 string 으로 내려주고 있어서 확인 후 수정 필요.
// 일단 string으로 받도록 interface에 지정.
export enum PaymentMethodType {
  EVENT = 0,
  CARD = 1,
}

export enum PaymentStatus { // 결제 취소 기능 필요 여부를 논의 중
  CANCELED = 'canceled',
  CONFIRMED = 'confirmed',
  CANCELABLE = 'cancelable',
}

export enum SubscriptionStatus {
  unsubscribed = 0,
  normal = 1,
  /**
   * 사실상 아래 네 가지 상태가 존재하는데 어떻게 처리할지 백엔드와 논의 필요
   * 1. 한 번도 구독한 적이 없는 상태
   * 2. 구독 중인 상태
   * 3. 구독은 해지했으나 이용 가능한 상태(기존 구독 만료일 전까지)
   * 4. 구독이 완전히 해지된 상태 (취소가 가능하다면 취소 상태 포함)
   */
}

export interface MySelectHistroyState extends Paginated<MySelectBook> {
  deletionFetchingStatus: FetchStatusFlag;
}

export interface SubscriptionState {
  subscriptionId: number;
  ticketStartDate: DateDTO;
  subscriptionEndDate: DateDTO;
  nextBillDate: DateDTO;
  isOptout: boolean;
  isOptoutCancellable: boolean;
  optoutDate: DateDTO; // Will it be empty?
  optoutReason: string | null;
  optoutReasonKor: string | null;
  paymentMethod: string;
  isUsingRidipay: boolean;
  currency: string;
  monthlyPayPrice: number;
  newMonthlyPayPrice: number;
  cardBrand: string;
  formattedMonthlyPayPrice: string;
  formattedNewMonthlyPayPrice: string;
  maskedCardNo: string;
  cardSubscription: string[];
  pgType: string;
  isSubscribedWithOldPrice: boolean;
}

export interface PurchaseHistory extends Paginated<Ticket> {
  isCancelFetching: boolean;
  isCashReceiptIssueFetching: boolean;
}

export interface UserState {
  isFetching: boolean;
  isLoggedIn: boolean;
  isAccountMeRetried: boolean;
  uId: string;
  email: string;
  availableUntil?: DateDTO;
  ticketFetchStatus: FetchStatusFlag;
  hasAvailableTicket: boolean;
  hasSubscribedBefore: boolean;
  subscriptionFetchStatus: FetchStatusFlag;
  unsubscriptionFetchStatus: FetchStatusFlag;
  unsubscriptionCancellationFetchStatus: FetchStatusFlag;
  subscription?: SubscriptionState | null;
  mySelectHistory: MySelectHistroyState;
  purchaseHistory: PurchaseHistory;
}

export const INITIAL_STATE: UserState = {
  isFetching: true,
  isLoggedIn: false,
  isAccountMeRetried: false,
  uId: '',
  email: '',
  hasAvailableTicket: false,
  ticketFetchStatus: FetchStatusFlag.IDLE,
  hasSubscribedBefore: false,
  subscriptionFetchStatus: FetchStatusFlag.IDLE,
  unsubscriptionFetchStatus: FetchStatusFlag.IDLE,
  unsubscriptionCancellationFetchStatus: FetchStatusFlag.IDLE,
  mySelectHistory: {
    itemListByPage: {},
    deletionFetchingStatus: FetchStatusFlag.IDLE,
  },
  purchaseHistory: {
    itemListByPage: {},
    isCancelFetching: false,
    isCashReceiptIssueFetching: false,
  },
};

export const userReducer = createReducer<UserState>({}, INITIAL_STATE);

userReducer.on(Actions.fetchUserInfo, (state = INITIAL_STATE, payload) => ({
  ...state,
  ...payload,
}));

userReducer.on(Actions.initializeUser, (state = INITIAL_STATE, payload) => ({
  ...state,
  ...payload.userDTO,
}));

userReducer.on(Actions.loadSubscriptionRequest, (state = INITIAL_STATE) => ({
  ...state,
  subscriptionFetchStatus: FetchStatusFlag.FETCHING,
}));

userReducer.on(Actions.loadSubscriptionSuccess, (state = INITIAL_STATE, payload) => ({
  ...state,
  subscriptionFetchStatus: FetchStatusFlag.IDLE,
  subscription: {
    ...state.subscription,
    ...payload.response,
  },
}));

userReducer.on(Actions.loadSubscriptionFailure, (state = INITIAL_STATE, payload) => {
  const { isFetched } = payload;

  return {
    ...state,
    subscriptionFetchStatus: isFetched ? FetchStatusFlag.IDLE : FetchStatusFlag.FETCH_ERROR,
  };
});

userReducer.on(Actions.loadAccountsMeRequest, (state = INITIAL_STATE, payload) => ({
  ...state,
  isFetching: true,
}));

userReducer.on(Actions.loadAccountsMeSuccess, (state = INITIAL_STATE, payload) => ({
  ...state,
  isFetching: false,
  isAccountMeRetried: true,
  isLoggedIn: true,
  uId: payload.uId,
  email: payload.email,
}));

userReducer.on(Actions.loadAccountsMeFailure, (state = INITIAL_STATE, payload) => ({
  ...state,
  isFetching: false,
  isLoggedIn: false,
  isAccountMeRetried: true,
}));

userReducer.on(Actions.loadMySelectHistoryRequest, (state = INITIAL_STATE, payload) => ({
  ...state,
  mySelectHistory: {
    ...state.mySelectHistory,
    itemListByPage: {
      ...state.mySelectHistory.itemListByPage,
      [payload.page]: {
        ...state.mySelectHistory.itemListByPage[payload.page],
        fetchStatus: FetchStatusFlag.FETCHING,
      },
    },
  },
}));

userReducer.on(Actions.loadMySelectHistorySuccess, (state = INITIAL_STATE, payload) => {
  const { response: { userRidiSelectBooks, totalCount } } = payload;
  return {
    ...state,
    mySelectHistory: {
      ...state.mySelectHistory,
      itemCount: totalCount,
      itemListByPage: {
        ...state.mySelectHistory.itemListByPage,
        [payload.page]: {
          isFetched: true,
          itemList: userRidiSelectBooks.map(userRidiSelectBookToMySelectBook),
          fetchStatus: FetchStatusFlag.IDLE,
        },
      },
    },
  };
});

userReducer.on(Actions.loadMySelectHistoryFailure, (state = INITIAL_STATE, payload) => ({
  ...state,
  mySelectHistory: {
    ...state.mySelectHistory,
    itemListByPage: {
      ...state.mySelectHistory.itemListByPage,
      [payload.page]: {
        isFetched: false,
        itemList: [],
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
      },
    },
  },
}));

userReducer.on(Actions.clearMySelectHistory, (state = INITIAL_STATE) => ({
  ...state,
  mySelectHistory: {
    ...state.mySelectHistory,
    itemCount: 0,
    pageCount: 0,
    itemListByPage: {},
  },
}));

userReducer.on(Actions.deleteMySelectHistoryRequest, (state = INITIAL_STATE, payload) => ({
  ...state,
  mySelectHistory: {
    ...state.mySelectHistory,
    deletionFetchingStatus: FetchStatusFlag.FETCHING,
    itemListByPage: {
      ...state.mySelectHistory.itemListByPage,
      [payload.page]: {
        ...state.mySelectHistory.itemListByPage[payload.page],
        fetchStatus: FetchStatusFlag.FETCHING,
      },
    },
  },
}));

userReducer.on(Actions.deleteMySelectHistorySuccess, (state = INITIAL_STATE, payload) => {
  const { response: { userRidiSelectBooks, totalCount, totalPage }, page } = payload;
  return {
    ...state,
    mySelectHistory: {
      ...state.mySelectHistory,
      itemCount: totalCount,
      pageCount: totalPage,
      deletionFetchingStatus: FetchStatusFlag.IDLE,
      itemListByPage: {
        ...state.mySelectHistory.itemListByPage,
        [page]: {
          isFetched: true,
          itemList: userRidiSelectBooks.map(userRidiSelectBookToMySelectBook),
          fetchStatus: FetchStatusFlag.IDLE,
        },
      },
    },
  };
});

userReducer.on(Actions.deleteMySelectHistoryFailure, (state = INITIAL_STATE) => ({
  ...state,
  mySelectHistory: {
    ...state.mySelectHistory,
    deletionFetchingStatus: FetchStatusFlag.FETCH_ERROR,
  },
}));

userReducer.on(Actions.resetMySelectHistoryFetchedStatus, (state = INITIAL_STATE) => ({
  ...state,
  mySelectHistory: {
    ...state.mySelectHistory,
    itemListByPage: {},
  },
}));

userReducer.on(Actions.loadPurchasesRequest, (state = INITIAL_STATE, payload) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    itemListByPage: {
      ...state.purchaseHistory.itemListByPage,
      [payload.page]: {
        fetchStatus: FetchStatusFlag.FETCHING,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));

userReducer.on(Actions.loadPurchasesSuccess, (state = INITIAL_STATE, payload) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    itemCount: payload.response.totalCount,
    itemListByPage: {
      ...state.purchaseHistory.itemListByPage,
      [payload.page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: payload.response.tickets,
        isFetched: false,
      },
    },
  },
}));

userReducer.on(Actions.loadPurchasesFailure, (state = INITIAL_STATE, payload) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    itemListByPage: {
      ...state.purchaseHistory.itemListByPage,
      [payload.page]: {
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));

userReducer.on(Actions.clearPurchases, (state = INITIAL_STATE) => ({
  ...state,
  purchaseHistory: {
    itemListByPage: {},
    isCancelFetching: false,
    isCashReceiptIssueFetching: false,
  },
}));

userReducer.on(Actions.cancelPurchaseRequest, (state = INITIAL_STATE) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    isCancelFetching: true,
  },
}));

userReducer.on(Actions.cancelPurchaseSuccess, (state = INITIAL_STATE, payload) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    itemListByPage: Object
      .keys(state.purchaseHistory.itemListByPage)
      .reduce((listByPage, p): ItemListByPage<Ticket> => {
        const page = Number(p);
        return {
          ...listByPage,
          [page]: {
            ...state.purchaseHistory.itemListByPage[page],
            itemList: state.purchaseHistory.itemListByPage[page].itemList.map((item) => ({
              ...item,
              isCancellable: item.id === payload.purchaseId ? false : item.isCancellable,
              isCanceled: item.id === payload.purchaseId ? true : item.isCanceled,
            })),
          },
        };
      }, {}),
    isCancelFetching: false,
  },
}));

userReducer.on(Actions.cancelPurchaseFailure, (state = INITIAL_STATE) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    isCancelFetching: false,
  },
}));

userReducer.on(Actions.unsubscribeRequest, (state = INITIAL_STATE) => ({
  ...state,
  unsubscriptionFetchStatus: FetchStatusFlag.FETCHING,
}));

userReducer.on(Actions.unsubscribeSuccess, (state = INITIAL_STATE) => ({
  ...state,
  unsubscriptionFetchStatus: FetchStatusFlag.IDLE,
}));

userReducer.on(Actions.unsubscribeFailure, (state = INITIAL_STATE) => ({
  ...state,
  unsubscriptionFetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

userReducer.on(Actions.cancelUnsubscriptionRequest, (state = INITIAL_STATE) => ({
  ...state,
  unsubscriptionCancellationFetchStatus: FetchStatusFlag.FETCHING,
}));

userReducer.on(Actions.cancelUnsubscriptionSuccess, (state = INITIAL_STATE) => ({
  ...state,
  unsubscriptionCancellationFetchStatus: FetchStatusFlag.IDLE,
}));

userReducer.on(Actions.cancelUnsubscriptionFailure, (state = INITIAL_STATE) => ({
  ...state,
  unsubscriptionCancellationFetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

userReducer.on(Actions.cashReceiptIssueRequest, (state = INITIAL_STATE) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    isCashReceiptIssueFetching: true,
  },
}));

userReducer.on(Actions.cashReceiptIssueSuccess, (state = INITIAL_STATE, payload) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    itemListByPage: Object
      .keys(state.purchaseHistory.itemListByPage)
      .reduce((listByPage, p): ItemListByPage<Ticket> => {
        const page = Number(p);
        return {
          ...listByPage,
          [page]: {
            ...state.purchaseHistory.itemListByPage[page],
            itemList: state.purchaseHistory.itemListByPage[page].itemList.map((item) => ({
              ...item,
              cashReceiptUrl: item.id === payload.ticketId ?
                payload.cashReceiptUrl :
                item.cashReceiptUrl,
              isCashReceiptIssuable: item.id !== payload.ticketId ?
                item.isCashReceiptIssuable :
                payload.method === 'POST' ?
                  false :
                  true,
            })),
          },
        };
      }, {}),
    isCashReceiptIssueFetching: false,
  },
}));

userReducer.on(Actions.cashReceiptIssueFailure, (state = INITIAL_STATE) => ({
  ...state,
  purchaseHistory: {
    ...state.purchaseHistory,
    isCashReceiptIssueFetching: false,
  },
}));

