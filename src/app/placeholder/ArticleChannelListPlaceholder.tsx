import React from 'react';
import { ArticleChannelMetaPlaceholder } from './ArticleChannelMetaPlaceholder';

export const ArticleChannelListPlaceholder: React.FunctionComponent = () => (
  <main className="SceneWrapper PageArticleChannels Skeleton_Wrapper">
    <div className="ArticleChannelList_Skeleton_Wrap">
      <ul className="ArticleChannelList_Skeleton">
        <ArticleChannelMetaPlaceholder/>
        <ArticleChannelMetaPlaceholder/>
        <ArticleChannelMetaPlaceholder/>
        <ArticleChannelMetaPlaceholder/>
      </ul>
    </div>
  </main>
);
