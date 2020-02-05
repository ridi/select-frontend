import { AxiosError } from 'axios';
import { Dispatch } from 'react-redux';
import { call, take } from 'redux-saga/effects';

import {
  ActionDeleteRatingFailure,
  ActionDeleteRatingRequest,
  ActionPostRatingFailure,
  ActionPostRatingRequest,
  DELETE_RATING_FAILURE,
  DELETE_RATING_REQUEST,
  deleteRatingFailure,
  deleteRatingSuccess,
  POST_RATING_FAILURE,
  POST_RATING_REQUEST,
  postRatingFailure,
  postRatingSuccess,
} from 'app/services/review/actions';
import { requestDeleteRating, requestPostRating } from 'app/services/review/requests';
import { RidiSelectState } from 'app/store';
import toast from 'app/utils/toast';

export function postRating(dispatch: Dispatch<RidiSelectState>, bookId: number, rating: number) {
  requestPostRating(bookId, rating)
    .then(response => {
      if (response.status === 200) {
        dispatch(postRatingSuccess(bookId, response.data.my.review, response.data.reviewSummary));
      } else {
        dispatch(postRatingFailure(bookId));
      }
    })
    .catch(error => {
      dispatch(postRatingFailure(bookId, error));
    });
}

export function* watchPostRating(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionPostRatingRequest = yield take(POST_RATING_REQUEST);
    yield call(postRating, dispatch, payload.bookId, payload.rating);
  }
}

export function deleteRating(dispatch: Dispatch<RidiSelectState>, bookId: number) {
  requestDeleteRating(bookId)
    .then(response => {
      if (response.status === 200) {
        dispatch(deleteRatingSuccess(bookId, response.data.reviewSummary));
      } else {
        dispatch(deleteRatingFailure(bookId));
      }
    })
    .catch(e => {
      dispatch(deleteRatingFailure(bookId));
    });
}

export function* watchDeleteRating(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const { payload }: ActionDeleteRatingRequest = yield take(DELETE_RATING_REQUEST);
    yield call(deleteRating, dispatch, payload.bookId);
  }
}

export function* watchRatingFailure(dispatch: Dispatch<RidiSelectState>) {
  while (true) {
    const {
      payload: { error },
    }: ActionPostRatingFailure | ActionDeleteRatingFailure = yield take([
      POST_RATING_FAILURE,
      DELETE_RATING_FAILURE,
    ]);

    const { response } = error || ({ response: {} } as AxiosError);

    if (!response) {
      return;
    }

    if (response.status === 429) {
      toast.failureMessage(response.data ? response.data.message : undefined);
      return;
    }

    toast.failureMessage();
  }
}
