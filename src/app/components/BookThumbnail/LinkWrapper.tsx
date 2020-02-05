import { ThumbnailLinkType } from 'app/components/BookThumbnail/types';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

export interface LinkWrapperProps {
  className?: string;
  linkUrl?: string;
  linkType: ThumbnailLinkType;
  expired: boolean;
  onClick: (event: React.SyntheticEvent<any>) => void;
}

export const LinkWrapper: React.SFC<LinkWrapperProps> = props => {
  const { className, linkUrl, linkType, onClick, children, expired } = props;

  if (!linkUrl || expired) {
    return <>{children}</>;
  }

  switch (linkType) {
    case 'Link':
      return (
        <Link
          to={linkUrl}
          className={classNames(['RSGBookThumbnail_Link', className])}
          onClick={onClick}
        >
          {children}
        </Link>
      );
    case 'a':
      return (
        <a
          href={linkUrl}
          className={classNames(['RSGBookThumbnail_Link', className])}
          onClick={onClick}
        >
          {children}
        </a>
      );
    case 'button':
      return (
        <button className={classNames(['RSGBookThumbnail_Link', className])} onClick={onClick}>
          {children}
        </button>
      );
  }
};
