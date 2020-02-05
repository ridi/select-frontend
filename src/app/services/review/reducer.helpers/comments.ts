import { findIndex, findKey, flow, keyBy, mapValues, range } from 'lodash-es';
import Immutable from 'object-path-immutable';

import { FetchStatusFlag } from 'app/constants';
import { TextWithLF } from 'app/types';

import { Comment, CommentsById, ReviewsState } from '../reducer.state';
import { ResponseComment } from '../requests';

export function responseCommentToStateComment(responseComment: ResponseComment): Comment {
  return {
    ...responseComment,
    fetchStatus: FetchStatusFlag.IDLE,
  };
}

export function commentListToCommentsById(commentList: ResponseComment[]): CommentsById {
  return flow(
    (list: ResponseComment[]) => keyBy(list, 'id'),
    dic => mapValues(dic, responseCommentToStateComment),
  )(commentList);
}

export function responseCommentsToCommentIdListByPage(
  responseCommentList: ResponseComment[],
  size: number,
  itemCount: number,
) {
  const totalPageCount = Math.ceil(itemCount / size);
  const reversedList = responseCommentList.reverse();
  return range(1, totalPageCount + 1).reduce(
    (result, value: number) => ({
      ...result,
      [value]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: reversedList
          .slice(size * (value - 1), size * value)
          .map(review => review.id)
          .reverse(),
      },
    }),
    {},
  );
}

export function setCommentFetchStatus(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
  commentId: number,
  fetchStatus: FetchStatusFlag,
) {
  return Immutable(state)
    .set(
      [`${bookId}`, 'reviewsById', `${reviewId}`, 'commentsById', `${commentId}`, 'fetchStatus'],
      fetchStatus,
    )
    .value();
}

export function changeCurrentCommentPage(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
  page: number,
) {
  return Immutable(state)
    .set([`${bookId}`, 'reviewsById', `${reviewId}`, 'commentIdsByPage', 'currentPage'], page)
    .value();
}

export function postMyComment(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
  responseComment: ResponseComment,
) {
  return Immutable(state)
    .set(
      [`${bookId}`, 'reviewsById', `${reviewId}`, 'fetchStatus', 'myComment'],
      FetchStatusFlag.IDLE,
    )
    .update(
      [`${bookId}`, 'reviewsById', `${reviewId}`, 'commentIdsByPage', 'itemCount'],
      count => count + 1,
    )
    .push(
      [
        `${bookId}`,
        'reviewsById',
        `${reviewId}`,
        'commentIdsByPage',
        'itemListByPage',
        '1',
        'itemList',
      ],
      responseComment.id,
    )
    .set(
      [`${bookId}`, 'reviewsById', `${reviewId}`, 'commentsById', `${responseComment.id}`],
      responseCommentToStateComment(responseComment),
    )
    .value();
}

export function deleteComment(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
  commentId: number,
) {
  const commentPage = Number(
    findKey(state[bookId].reviewsById[reviewId].commentIdsByPage.itemListByPage, page =>
      page.itemList.some(comment => comment === commentId),
    ),
  );
  if (!commentPage) {
    return Immutable(state)
      .set(
        [`${bookId}`, 'reviewsById', `${reviewId}`, 'commentsById', `${commentId}`, 'fetchStatus'],
        FetchStatusFlag.IDLE,
      )
      .value();
  }

  const commentIndexFromPage = findIndex(
    state[bookId].reviewsById[reviewId].commentIdsByPage.itemListByPage[commentPage].itemList,
    (id: number) => id === commentId,
  );
  return Immutable(state)
    .set(
      [`${bookId}`, 'reviewsById', `${reviewId}`, 'commentsById', `${commentId}`, 'fetchStatus'],
      FetchStatusFlag.IDLE,
    )
    .del([
      `${bookId}`,
      'reviewsById',
      `${reviewId}`,
      'commentIdsByPage',
      'itemListByPage',
      `${commentPage}`,
      'itemList',
      `${commentIndexFromPage}`,
    ])
    .update(
      [`${bookId}`, 'reviewsById', `${reviewId}`, 'commentIdsByPage', 'itemCount'],
      count => count - 1,
    )
    .value();
}

export function updateCommentFormContent(
  state: ReviewsState,
  bookId: number,
  reviewId: number,
  content: TextWithLF,
) {
  return Immutable(state)
    .set([`${bookId}`, 'reviewsById', `${reviewId}`, 'commentInput'], content)
    .value();
}
