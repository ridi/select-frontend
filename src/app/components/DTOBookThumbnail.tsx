import React from 'react';

import {
  Book,
  BookThumbnailUrlMap,
} from 'app/services/book';
import { Omit } from 'app/types';
import { withThumbnailQuery } from 'app/utils/withThumbnailQuery';
import {
  BookThumbnail,
  BookThumbnailProps,
} from './BookThumbnail';

export interface DTOBookThumbnailProps extends Omit<BookThumbnailProps, 'bookTitle' | 'imageUrl'> {
  book: Book;
  imageSize?: keyof BookThumbnailUrlMap;
}

export const DTOBookThumbnail: React.SFC<DTOBookThumbnailProps> = (props) => {
  const {
    book,
    imageSize = 'large',
    ...restProps
  } = props;

  return (
    <BookThumbnail
      imageUrl={withThumbnailQuery(book.thumbnail[imageSize]!)}
      bookTitle={book.title.main}
      {...restProps}
    />
  );
};
