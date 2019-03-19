import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { updateQueryStringParam } from 'app/utils/request';
import toast from 'app/utils/toast';
import { AxiosError } from 'axios';

export function paginationErrorCallback(error: AxiosError | FetchErrorFlag, page?: number) {
  if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
    toast.failureMessage('없는 페이지입니다. 첫번째 페이지로 이동합니다.');
    history.replace(`?${updateQueryStringParam('page', 1)}`);
  } else if (page === 1) {
    toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
  } else if (!page) {
    toast.failureMessage();
  }
}
