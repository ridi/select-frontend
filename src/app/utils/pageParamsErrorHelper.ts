import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { updateQueryStringParam } from 'app/utils/request';
import toast from 'app/utils/toast';
import { AxiosError, AxiosRequestConfig } from 'axios';

export function paginationErrorCallback(error: AxiosError & FetchErrorFlag, paramsName: string = 'page', paramsValue?: number) {
  if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
    toast.failureMessage('없는 페이지입니다. 첫번째 페이지로 이동합니다.');
    history.replace(`?${updateQueryStringParam(paramsName, 1)}`);
  } else if (paramsValue === 1) {
    toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
  } else if (!paramsValue) {
    toast.failureMessage();
  } else {
    handleWrongPaginationValue(error.response!.config, paramsName);
  }
}

export function handleWrongPaginationValue(config: AxiosRequestConfig, paramsName: string = 'page') {
  const { params = {} } = config;
  if (
    params[paramsName] && (Number(params[paramsName]) > 1 || Number(params[paramsName]) < 1)
  ) {
    history.replace(`?${updateQueryStringParam(paramsName, 1)}`);
  }
}
