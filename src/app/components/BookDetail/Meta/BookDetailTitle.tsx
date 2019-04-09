import * as React from 'react';

// Book Services
import { BookTitle } from 'app/services/book';

interface Props {
  title?: BookTitle;
}

export const BookDetailTitle = (props: Props) => {
  const { title } = props;

  return (
    <h1 className="PageBookDetail_BookTitle">{title ? title.main : ''}</h1>
  );
};
