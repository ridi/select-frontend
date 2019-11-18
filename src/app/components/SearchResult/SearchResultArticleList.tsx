import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { SearchResultArticle } from 'app/services/searchResult';
import { getArticleKeyFromData } from 'app/utils/utils';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ThumbnailShape } from '../ArticleThumbnail/types';

interface Props {
  keyword: string;
  articles: SearchResultArticle[];
}

export const SearchResultArticleList: React.FunctionComponent<Props> = (props) => {
  const { keyword, articles } = props;

  return (
    <ul className="SearchResultArticleList">
      {articles.map((article) => (
        <li className="SearchResultArticleList_Item" key={article.id}>
          <div className="SearchResultArticleList_Link">
            <ArticleThumbnail
              linkUrl={`/article/${getArticleKeyFromData(article)}`}
              imageUrl={article.thumbnailUrl}
              thumbnailShape={ThumbnailShape.SQUARE}
              thumbnailClassName={'SearchResultArticleList_Thumbnail'}
              articleTitle={article.title}
            />
            <Link to={`/article/${getArticleKeyFromData(article)}?q=${keyword}&s=search`} className="SearchResultArticleList_Meta">
              <h3
                className="SearchResultArticleList_Title"
                dangerouslySetInnerHTML={{ __html: article.highlight.title || article.title }}
              />
              <span
                className="SearchResultArticleList_Channel"
                dangerouslySetInnerHTML={{ __html: article.highlight.channelDisplayName || article.channel.displayName }}
              />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};
