import classNames from 'classnames';
import React from 'react';

import { BookDetailSectionPlaceholder } from 'app/components/BookDetail/BookDetailSectionPlaceholder';
import { Expander } from 'app/components/BookDetail/Expander';
import { TextTruncate } from 'app/components/BookDetail/TextTruncate';

interface BookDetailPanelWrapperProps {
  className?: string;
  renderCondition?: boolean;
}

export const BookDetailPanelWrapper: React.FunctionComponent<BookDetailPanelWrapperProps> = (props) => {
  const {
    className,
    renderCondition = true,
    children,
  } = props;

  if (!children) {
    return null;
  }

  return renderCondition ? (
    <section
      className={classNames(
        'PageBookDetail_Panel',
        className,
      )}
    >
      {children}
    </section>
  ) : (
    <>
      {children}
    </>
  );
};

interface BookDetailPanelProps {
  title: string;
  imageUrl?: string;
  isMobile?: boolean;
  useTruncate?: boolean;
  useSkeleton?: boolean;
}

export const BookDetailPanel: React.FunctionComponent<BookDetailPanelProps> = (props) => {
  const {
    title,
    children,
    isMobile = false,
    imageUrl,
    useSkeleton = false,
    useTruncate = true,
  } = props;

  return children ? (
    <BookDetailPanelWrapper>
      <h2 className="PageBookDetail_PanelTitle">{title}</h2>
      <div className="PageBookDetail_PanelContent">
        {useTruncate ? (
          <TextTruncate
            lines={9}
            text={`${imageUrl ? `<img src="${imageUrl}" /><br /><br />` : ''}${children}`}
            lineHeight={isMobile ? 23 : 25}
            renderExpander={(({ expand, isExpanded, isTruncated }) => !isTruncated || isExpanded ? null : (
              <div className="BookDetail_ContentTruncWrapper">
                <Expander
                  onClick={expand}
                  text="계속 읽기"
                  isExpanded={false}
                />
              </div>
            ))}
          />
        ) : children}
      </div>
    </BookDetailPanelWrapper>
  ) : (useSkeleton ? <BookDetailSectionPlaceholder /> : null);
};
