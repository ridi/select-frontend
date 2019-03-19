import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as qs from 'qs';

// import env from 'app/config/env';
import history from 'app/config/history';
import toast, { TOAST_DEFAULT_ERROR_MESSAGE } from 'app/utils/toast';

// const axiosRetry = require('axios-retry'); // https://github.com/softonic/axios-retry/issues/53

export function updateQueryStringParam(key: string, value: string | number) {
  return qs.stringify(
    Object.assign(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      { [key]: value },
    ),
  );
}

// function requestWithDefaultHandling(config: RequestConfig): AxiosPromise {
//   const instance = axios.create();

//   // Retry on a network error or a 5xx error on an idempotent request https://github.com/softonic/axios-retry
//   // You can disable retry by request adding {'axios-retry': { retries: 0 }} to axios config
//   axiosRetry(instance, {
//     retries: 2,
//     retryCondition: axiosRetry.isSafeRequestError,
//   });

//   // Redirect to login page in case of 401
//   instance.interceptors.response.use((response) => {
//     fixWrongPaginationScope(response);
//     return response;
//   }, (error) => {
//     if (error && error.response && error.response.status === 404) {
//       fixWrongPaginationScope(error.response);
//     } else if (error && error.response && error.response.status === 401) {
//       return axios
//         .post(`${process.env.ACCOUNT_API}/ridi/token/`, null, { withCredentials: true })
//         .then(() => axios(error.config)) // 원래 요청 재시도
//         .catch(e => Promise.reject(e));
//     }
//     return Promise.reject(error);
//   });

//   instance.defaults.timeout = env.production ? 10000 : 30000;

//   return instance.request(config);
// }

// export interface RequestConfig extends AxiosRequestConfig {
//   'axios-retry'?: {
//     retries: number;
//   }
// }

// export default function request(config: RequestConfig): AxiosPromise {
//   config.withCredentials = true;
//   return requestWithDefaultHandling(config);
// }
