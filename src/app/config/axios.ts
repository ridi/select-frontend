import { store } from 'app/store';
import axios, { AxiosError } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';

import env from 'app/config/env';
import { ErrorStatus } from 'app/constants';
import { Actions as ServiceStatusActions } from 'app/services/serviceStatus';
import createRefreshTokenInstance from 'app/utils/refreshToken';

const instance = axios.create({
  baseURL: env.SELECT_API,
  timeout: env.production ? 3500 : 60000,
  withCredentials: true,
});

const refreshTokenInstance = createRefreshTokenInstance({
  ...instance.defaults,
  baseURL: env.ACCOUNT_API,
});

function isNotMaintenance({ response }: AxiosError) {
  return response
    ? response.status !== 503 || (response.data && response.data.status !== ErrorStatus.MAINTENANCE)
    : false;
}

axiosRetry(instance, {
  retries: 3,
  retryDelay: (retryNumber = 0) => 1000 * 3 ** retryNumber + Math.floor(1000 * Math.random()),
  retryCondition(error: AxiosError) {
    return isNetworkOrIdempotentRequestError(error) && isNotMaintenance(error);
  },
});

instance.interceptors.response.use(undefined, (error: AxiosError) => {
  if (error.response) {
    const { status, data, config } = error.response;
    if (status === 401) {
      return refreshTokenInstance.post('/ridi/token/').then(() => instance.request(config));
    }
    if (Math.floor(status / 100) === 5 && data.status === ErrorStatus.MAINTENANCE) {
      // TODO: 서비스 이용이 불가능한 엔드포인트만 에러페이지로 렌더링되도록 변경
      store.dispatch(
        ServiceStatusActions.setState({
          status,
          data: { status: ErrorStatus.MAINTENANCE },
        }),
      );
    }
  }
  return Promise.reject(error);
});

export default instance;
