import { MAX_WIDTH, MIN_WIDTH } from 'app/constants';
import { RSGTab, ScopedTab, ScopedTabProps } from 'app/services/review/components';
import React from 'react';
import MediaQuery from 'react-responsive';

export type ReviewListTabProps = ScopedTabProps;

export const ReviewListTab: React.SFC<ReviewListTabProps> = (props) => {
  const { tabList, selectedTabName, onClick } = props;

  return (
    <>
      <MediaQuery maxWidth={MAX_WIDTH}>
        <ScopedTab
          tabList={tabList}
          selectedTabName={selectedTabName}
          onClick={onClick}
        />
      </MediaQuery>
      <MediaQuery minWidth={MIN_WIDTH}>
        <RSGTab
          tabList={tabList}
          selectedTabName={selectedTabName}
          onClick={onClick}
        />
      </MediaQuery>
    </>
  );
};
