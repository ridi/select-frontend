import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import InlineHorizontalBookList from 'app/components/InlineHorizontalBookList';
import { Expander } from 'app/components/BookDetail/Expander';
import { Book } from 'app/services/book';
import { getIsMobile } from 'app/services/commonUI/selectors';

interface ExpandableBookListProps {
  className: string;
  listTitle: string;
  uiPartTitleForTracking: string;
  pageTitleForTracking: string;
  books?: Book[];
}

export const ExpandableBookList: React.FunctionComponent<ExpandableBookListProps> = props => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { className, listTitle, uiPartTitleForTracking, books, pageTitleForTracking } = props;
  const isMobile = useSelector(getIsMobile);

  return books && books.length > 0 ? (
    <section
      className={classNames(
        'ExpandableBookList',
        isExpanded && 'ExpandableBookList-expanded',
        className,
      )}
    >
      <h2 className="ExpandableBookList_Title">{listTitle}</h2>
      <InlineHorizontalBookList
        books={isExpanded || isMobile ? books : books.slice(0, 6)}
        serviceTitleForTracking="select-book"
        uiPartTitleForTracking={uiPartTitleForTracking}
        disableInlineOnPC={isExpanded}
        renderAuthor={false}
        lazyloadThumbnail={false}
        bookThumbnailSize={isMobile ? 110 : 120}
        pageTitleForTracking={pageTitleForTracking}
      />
      {books.length > 6 && !isMobile && !isExpanded && (
        <div className="ExpandableBookList_ExpandButton_Wrapper">
          <Expander
            onClick={() => setIsExpanded(!isExpanded)}
            text={isExpanded ? '접기' : '펼쳐 보기'}
            isExpanded={isExpanded}
          />
        </div>
      )}
    </section>
  ) : null;
};
