import * as React from 'react';

// Book Services
import { Icon } from '@ridi/rsg';
import { BookAuthor, BookAuthors } from 'app/services/book';
import { stringifyAuthors } from 'app/utils';
import { some } from 'lodash-es';

interface Props {
  authors?: BookAuthors;
}

export const BookDetailAuthor = (props: Props) => {
  const { authors } = props;
  const [ isAuthorsExpanded, setExpandedAuthors ] = React.useState(false);
  if (!authors) {
    return (<span className="PageBookDetail_Authors"></span>);
  }
  const hasMoreAuthors = some(authors, (people: BookAuthor[]) => (people && people.length > 2));
  if (isAuthorsExpanded || !hasMoreAuthors) {
    return <span className="PageBookDetail_Authors">{stringifyAuthors(authors)}</span>;
  }
  return (
    <span className="PageBookDetail_Authors">
      <button
        className="PageBookDetail_ExpandAuthors_Button"
        onClick={() => setExpandedAuthors(true)}
      >
        {stringifyAuthors(authors, 2)}
        <Icon
          name="arrow_1_down"
          className="PageBookDetail_ExpandAuthors_Button_Icon"
        />
      </button>
    </span>
  );
};
