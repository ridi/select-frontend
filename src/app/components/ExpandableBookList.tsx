import classNames from 'classnames';
import React from 'react';
import MediaQuery from 'react-responsive';

import { ConnectedInlineHorizontalBookList } from 'app/components';
import { Expander } from 'app/components/BookDetail/Expander';
import { MAX_WIDTH } from 'app/constants';
import { Book } from 'app/services/book';

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

  return books && books.length > 0 ? (
    <section
      className={classNames(
        'ExpandableBookList',
        isExpanded && 'ExpandableBookList-expanded',
        className,
      )}
    >
      <h2 className="ExpandableBookList_Title">{listTitle}</h2>
      <MediaQuery maxWidth={MAX_WIDTH}>
        {isMobile => (
          <>
            <ConnectedInlineHorizontalBookList
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
          </>
        )}
      </MediaQuery>
    </section>
  ) : null;
};
