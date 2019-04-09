import * as React from 'react';

// Book Services
import { Publisher } from 'app/services/book/requests';

interface Props {
  publisher?: Publisher;
}

export const BookDetailPublisher = (props: Props) => {
  const { publisher } = props;

  return (
    <>
    {publisher && (
      <span className="PageBookDetail_Publisher">{` · ${publisher.name} 출판`}</span>
    )}
    </>
  );
};
