import { Button, Group, Icon } from '@ridi/rsg';
import * as React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isMobile: boolean;
  item: {
    el?: React.ReactType;
    getProps?: (page: number) => any;
  };
}

export const Pagination: React.SFC<PaginationProps> = (props) => {
  const { currentPage, totalPages, isMobile, item } = props;
  return (
    <>

    </>
  );
};
