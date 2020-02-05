import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import env from 'app/config/env';
import {
  Book,
  BookAuthors,
  BookOwnershipStatus,
  BookReviewSummary,
  BookThumbnailUrlMap,
  BookTitle,
} from 'app/services/book';
import { Category } from 'app/services/category';
import { BookId, DateDTO, Omit, TextWithLF } from 'app/types';

export interface RedirectionRequiredResponse {
  location: string;
  status: number;
}

export interface Publisher {
  name: string;
}

export interface BookFile {
  format: 'epub' | 'pdf' | 'bom';
  size: number;
  pageCount?: number;
  characterCount?: number;
}

export interface BookDetailPublishingDate {
  ridibooksRegisterDate?: string;
  ridibooksPublishingDate?: string;
  paperBookPublishDate?: string;
  ebookPublishDate?: string;
}

export interface NoticeResponse {
  id: number;
  bId: number;
  type: 'oper';
  content: TextWithLF;
  isVisible: boolean;
  beginDatetime: DateDTO;
  endDatetime: DateDTO;
  regDate: DateDTO;
  lastModified: DateDTO;
}

export interface BookDetailResponseV2 {
  id: BookId;
  title: BookTitle;
  thumbnail: BookThumbnailUrlMap;
  authors: BookAuthors;
  reviewSummary: BookReviewSummary;
  seriesBooks: Book[];
  publisherReview: TextWithLF;
  authorIntroduction: TextWithLF;
  introduction: TextWithLF; // former `description`
  introVideoUrl: string;
  introImageUrl: string;
  tableOfContents: TextWithLF;
  notices: NoticeResponse[];
  categories: Category[][];
  publisher: Publisher;
  publishingDate: BookDetailPublishingDate;
  file: BookFile;
  previewAvailable: boolean;
  hasPreview: boolean;
  previewBId: BookId;
  beginDatetime: DateDTO;
  endDatetime: DateDTO;
}

export interface BookDetailResponseV1 extends Omit<BookDetailResponseV2, 'introduction'> {
  description: TextWithLF;
}

export type BookDetailResponse = BookDetailResponseV2 & RedirectionRequiredResponse;

export interface RecommendedBook {
  score: number;
  rcmdId: string;
  bookSummary: Book;
}

export const requestBooks = (bookIds: number[]): Promise<BookDetailResponse> =>
  request({
    url: `/api/books?b_ids=${bookIds.join(',')}`,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<BookDetailResponse>>(response, { recursive: true }).data,
  );

export const requestBookDetail = (bookId: number): Promise<BookDetailResponse> =>
  request({
    url: `/api/books/${bookId}`,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<BookDetailResponse>>(response, { recursive: true }).data,
  );

export const requestBookOwnership = (bookId: number): Promise<BookOwnershipStatus> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/books/${bookId}`,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<BookOwnershipStatus>>(response, { recursive: true }).data,
  );

export const requestBookToBookRecommendation = (bookId: number): Promise<RecommendedBook[]> =>
  request({
    url: `/api/recommendations/books/${bookId}`,
    method: 'GET',
  }).then(response => camelize<RecommendedBook[]>(response.data, { recursive: true }));
