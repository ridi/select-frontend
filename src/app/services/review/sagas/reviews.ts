import { Dispatch } from 'react-redux';
import { call, put, select, take } from 'redux-saga/effects';

import { TextWithLF } from 'app/types';

import {
  ActionChangeSortBy,
  ActionChangeUserFilterTab,
  ActionDeleteReviewFailure,
  ActionDeleteReviewRequest,
  ActionDeleteReviewSuccess,
  ActionGetReviewsRequest,
  ActionPostReviewFailure,
  ActionPostReviewRequest,
  ActionPostReviewSuccess,
  CHANGE_SORT_BY,
  CHANGE_USER_FILTER_TAB,
  DELETE_REVIEW_FAILURE,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  deleteReviewFailure,
  deleteReviewSuccess,
  endEditingReview,
  GET_REVIEWS_REQUEST,
  getReviewsFailure,
  getReviewsRequest,
  getReviewsSuccess,
  POST_REVIEW_FAILURE,
  POST_REVIEW_REQUEST,
  POST_REVIEW_SUCCESS,
  postReviewFailure,
  postReviewSuccess,
  resetReviews,
} from 'app/services/review/actions';
import {
  requestDeleteReview,
  requestGetReviews,
  requestPostReview,
  RequestReviewsParameters,
} from 'app/services/review/requests';

import { ReviewSortingCriteria, ReviewsState } from 'app/services/review';
import { UserFilterType } from 'app/services/review/constants';
import { RidiSelectState } from 'app/store';
import toast, { TOAST_DEFAULT_ERROR_MESSAGE } from 'app/utils/toast';
import { AxiosError } from 'axios';

export const selectors = {
  reviewsByBookId: (state: RidiSelectState) => state.reviewsByBookId,
};

export function getReviews(
  dispatch: Dispatch<RidiSelectState>,
  bookId: number,
  params: RequestReviewsParameters,
) {
  requestGetReviews(bookId, params)
    .then(response => {
      if (response.status === 200) {
        dispatch(getReviewsSuccess(bookId, params, response.data));
      } else {
        dispatch(getReviewsFailure(bookId, params));
      }
    })
    .catch(() => dispatch(getReviewsFailure(bookId, params)));
}

export function* watchGetReviews(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionGetReviewsRequest = yield take(GET_REVIEWS_REQUEST);
    yield call(getReviews, dispatch, payload.bookId, payload.params);
  }
}

export function postReview(
  dispatch: Dispatch<RidiSelectState>,
  bookId: number,
  content: TextWithLF,
  hasSpoiler: boolean,
) {
  requestPostReview(bookId, content, hasSpoiler)
    .then(response => {
      if (response.status === 200) {
        dispatch(postReviewSuccess(bookId, response.data.my.review, response.data.reviewSummary));
      } else {
        dispatch(postReviewFailure(bookId));
      }
    })
    .catch(error => {
      dispatch(postReviewFailure(bookId, error));
    });
}

export function* watchPostReviewRequest(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionPostReviewRequest = yield take(POST_REVIEW_REQUEST);
    yield call(postReview, dispatch, payload.bookId, payload.content, payload.hasSpoiler);
  }
}

export function* watchPostReviewSuccess(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionPostReviewSuccess = yield take(POST_REVIEW_SUCCESS);
    const reviewsBybookId: ReviewsState = yield select(selectors.reviewsByBookId);
    yield put(endEditingReview(payload.bookId));
    yield put(resetReviews(payload.bookId));
    yield put(
      getReviewsRequest(payload.bookId, {
        userFilterType: payload.review.isBuyer
          ? reviewsBybookId[payload.bookId].userFilterType
          : UserFilterType.total,
        sortBy: ReviewSortingCriteria.latest,
        page: 1,
      }),
    );
  }
}

export function* watchReviewFailure(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const {
      payload: { error },
    }: ActionPostReviewFailure | ActionDeleteReviewFailure = yield take([
      POST_REVIEW_FAILURE,
      DELETE_REVIEW_FAILURE,
    ]);

    const { response } = error || ({ response: {} } as AxiosError);

    if (!response) {
      return;
    }

    if (response.status === 429) {
      toast.failureMessage(response.data ? response.data.message : undefined);
    }
    toast.failureMessage();
  }
}

export function deleteReviewRequest(dispatch: Dispatch<RidiSelectState>, bookId: number) {
  requestDeleteReview(bookId)
    .then(response => {
      if (response.status === 200) {
        dispatch(deleteReviewSuccess(bookId, response.data.my.review, response.data.reviewSummary));
      } else {
        dispatch(deleteReviewFailure(bookId));
      }
    })
    .catch(() => dispatch(deleteReviewFailure(bookId)));
}

export function* watchDeleteReviewRequest(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionDeleteReviewRequest = yield take(DELETE_REVIEW_REQUEST);
    yield call(deleteReviewRequest, dispatch, payload.bookId);
  }
}

export function* watchDeleteReviewSuccess(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionDeleteReviewSuccess = yield take(DELETE_REVIEW_SUCCESS);
    const reviewsBybookId: ReviewsState = yield select(selectors.reviewsByBookId);
    yield put(resetReviews(payload.bookId));
    yield put(
      getReviewsRequest(payload.bookId, {
        userFilterType: reviewsBybookId[payload.bookId].userFilterType,
        sortBy: ReviewSortingCriteria.latest,
        page: 1,
      }),
    );
  }
}

export function* watchChangeUserFilterTab() {
  while (true) {
    const { payload }: ActionChangeUserFilterTab = yield take(CHANGE_USER_FILTER_TAB);
    const reviewsBybookId: ReviewsState = yield select(selectors.reviewsByBookId);
    // if there isn't first page, request fetch
    const currentUserFilterTab =
      reviewsBybookId[payload.bookId].reviewIdsByUserFilterType[payload.userFilterType];
    const currentSortBy = reviewsBybookId[payload.bookId].sortBy;
    const firstPage = currentUserFilterTab[currentSortBy].itemListByPage[1];
    if (!firstPage) {
      yield put(
        getReviewsRequest(payload.bookId, {
          userFilterType: payload.userFilterType,
          sortBy: currentSortBy,
          page: 1,
        }),
      );
    }
  }
}

export function* watchChangeSortBy() {
  while (true) {
    const { payload }: ActionChangeSortBy = yield take(CHANGE_SORT_BY);
    const reviewsBybookId: ReviewsState = yield select(selectors.reviewsByBookId);
    // if there isn't first page, request fetch
    const currentUserFilterType = reviewsBybookId[payload.bookId].userFilterType;
    const currentUserFilterTab =
      reviewsBybookId[payload.bookId].reviewIdsByUserFilterType[currentUserFilterType];
    const firstPage = currentUserFilterTab[payload.sortBy].itemListByPage[1];
    if (!firstPage) {
      yield put(
        getReviewsRequest(payload.bookId, {
          userFilterType: currentUserFilterType,
          sortBy: payload.sortBy,
          page: 1,
        }),
      );
    }
  }
}
