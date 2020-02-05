export enum ReviewInvisibilityType {
  admin = 'admin',
  report = 'report',
}

export enum UserFilterType {
  buyer = 'buyer',
  total = 'total',
}

export enum ReviewSortingCriteria {
  latest = 'latest',
  like = 'like',
  highRating = 'highRating',
  lowRating = 'lowRating',
}

export const sortingCriteriaListMap = {
  [UserFilterType.buyer]: [
    ReviewSortingCriteria.latest,
    ReviewSortingCriteria.like,
    ReviewSortingCriteria.highRating,
    ReviewSortingCriteria.lowRating,
  ],
  [UserFilterType.total]: [ReviewSortingCriteria.latest, ReviewSortingCriteria.like],
};

export const reviewSortingCriteriaMap = {
  latest: '최신순',
  like: '공감순',
  highRating: '별점 높은순',
  lowRating: '별점 낮은순',
};

export const COMMENT_PAGE_SIZE = 10;
export const REVIEW_PAGE_SIZE = 10;
