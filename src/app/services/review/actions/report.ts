import { Action } from 'app/services/review/types';

export const POST_REVIEW_REPORT_SUCCESS = 'POST_REVIEW_REPORT_SUCCESS';

export type ActionPostReviewReportSuccess = Action<
  typeof POST_REVIEW_REPORT_SUCCESS,
  {
    bookId: number;
    reviewId: number;
  }
>;

export type ReviewReportActionTypes = ActionPostReviewReportSuccess;

export const postReviewReportSuccess = (
  bookId: number,
  reviewId: number,
): ActionPostReviewReportSuccess => ({
  type: POST_REVIEW_REPORT_SUCCESS,
  payload: { bookId, reviewId },
});
