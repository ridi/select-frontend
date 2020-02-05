import { CommentsActionTypes } from './comments';
import { ReviewLikeActionTypes } from './like';
import { RatingActionTypes } from './rating';
import { ReviewReportActionTypes } from './report';
import { ReviewsActionTypes } from './reviews';

export type ReviewActionTypes =
  | CommentsActionTypes
  | ReviewLikeActionTypes
  | RatingActionTypes
  | ReviewReportActionTypes
  | ReviewsActionTypes;

export * from './comments';
export * from './like';
export * from './rating';
export * from './report';
export * from './reviews';
