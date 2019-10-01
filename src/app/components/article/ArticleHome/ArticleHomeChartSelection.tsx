import * as React from 'react';
import MediaQuery from 'react-responsive';
import { ArticleSectionHeader } from './ArticleHomeSection';

export const ArticleHomeChartSelection = (props) => {
  const { title } = props;

  return (
    <div className="ArticleHomeSection ArticleHomeSection-horizontal-pad">
      <ArticleSectionHeader title={title} />
      <MediaQuery maxWidth={840}>
        {(isMobile) => isMobile ? '' : ''}
      </MediaQuery>
    </div>

  );

};
