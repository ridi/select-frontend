import { EmptyArticleFavorite } from 'app/components/article/ArticleFavorite/EmptyArticleFavorite';
import * as classNames from 'classnames';
import * as React from 'react';

export const ArticleFavorite: React.FunctionComponent = () => {
  return (
    <main
      className={classNames(
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
      <EmptyArticleFavorite />
    </main>
  );
};
