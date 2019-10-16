import { ArticleEmpty } from 'app/components/ArticleEmpty';
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
      <ArticleEmpty
        iconName="list_1"
        description="좋아한 아티클이 없습니다."
      />
    </main>
  );
};
