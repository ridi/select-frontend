import * as React from 'react';

import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { ArticleResponse } from 'app/services/article/requests';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { articleContentToPath } from 'app/utils/toPath';
import { Link } from 'react-router-dom';

interface Props {
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  filterForTracking?: string;
  articles: ArticleResponse[]; // TODO: Article 데이터 구조 잡아서 interface로 만들어서 수정 필요.
  lazyloadThumbnail?: boolean;
  renderAuthor?: boolean;

}
export const GridArticleList: React.FunctionComponent<Props> = (props) => {
  const {
    pageTitleForTracking,
    uiPartTitleForTracking,
    filterForTracking,
    articles,
    lazyloadThumbnail = true,
    renderAuthor = true,
  } = props;
  const section = !!pageTitleForTracking ? getSectionStringForTracking(pageTitleForTracking, uiPartTitleForTracking, filterForTracking) : undefined;

  return (
    <ul className="GridArticleList">
      {articles.map((article, idx) => (
        <li className="GridArticleList_Item" key={idx}>
          <ConnectedTrackImpression
            section={section}
            index={idx}
            id={article.id}
          >
            <ArticleThumbnail
              linkUrl={articleContentToPath({ contentId: String(article.id) })}
              imageUrl={article.thumbnailUrl}
              articleTitle={article.title}
            />
            <Link
              to={articleContentToPath({ contentId: String(article.id) })}
              className="GridArticleList_ItemLink"
            >
              <span className="GridArticleList_ItemTitle">
                {article.title}
              </span>
              {renderAuthor && article.author ? (
                <span className="GridArticleList_ItemAuthor">
                  {article.author.name}
                </span>
              ) : null}
            </Link>
          </ConnectedTrackImpression>
        </li>
      ))}
    </ul>
  );
};
