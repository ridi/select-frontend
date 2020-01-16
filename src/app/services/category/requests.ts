import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';
import { Book } from 'app/services/book';
import { Category } from 'app/services/category';

export interface CategoryBooksResponse  {
  totalCount: number;
  category: Category;
  books: Book[];
}

export const requestCategoryBooks = (
  categoryId: number,
  page: number,
): Promise<CategoryBooksResponse> => request({
  url: `/api/categories/${categoryId}/books`,
  method: 'GET',
  params: { page },
}).then((response) => camelize<AxiosResponse<CategoryBooksResponse>>(response, { recursive: true }).data);

export const requestCategoryList = (): Promise<Category[]> => (request({
  url: '/api/categories',
  method: 'GET',
}).then((response) => response.data));
