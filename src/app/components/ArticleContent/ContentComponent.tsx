import React from 'react';
import { useSelector } from 'react-redux';

import { Article } from '@ridi/ridi-prosemirror-editor';

import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { FetchStatusFlag } from 'app/constants';
import { ArticleContentPlaceholder } from 'app/placeholder/ArticleContentPlaceholder';
import { RidiSelectState } from 'app/store';

export const ArticleContentComponent: React.FunctionComponent<{ contentKey: string }> = props => {
  const articleState = useSelector(
    (state: RidiSelectState) => state.articlesById[props.contentKey],
  );

  if (!articleState || articleState.contentFetchStatus === FetchStatusFlag.FETCHING) {
    return <ArticleContentPlaceholder />;
  }

  return articleState.content ? (
    <Article
      json={articleState.content.json}
      classes={['RidiselectArticle']}
      style={{
        background: 'white',
      }}
    />
  ) : (
    <ArticleEmpty iconName="document" description="컨텐츠 내용이 비어있습니다." />
  );
};
