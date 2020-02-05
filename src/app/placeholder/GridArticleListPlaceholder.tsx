import classNames from 'classnames';
import React from 'react';
import { GridArticlePlaceholder } from './GridArticlePlaceholder';

interface GridArticleListPlaceholderProps {
  gridSize?: string;
}

export const GridArticleListPlaceholder: React.FunctionComponent<GridArticleListPlaceholderProps> = props => (
  <ul
    className={classNames(
      'GridArticleList',
      props.gridSize === 'large' && 'GridArticleList-fullWidthAvailable GridArticleList-large',
    )}
  >
    <GridArticlePlaceholder {...props} />
    <GridArticlePlaceholder {...props} />
    <GridArticlePlaceholder {...props} />
    <GridArticlePlaceholder {...props} />
  </ul>
);
