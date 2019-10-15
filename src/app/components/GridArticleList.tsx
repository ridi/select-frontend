import * as React from 'react';

import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { stringifyAuthors } from 'app/utils/utils';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

interface Props {
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  filterForTracking?: string;
  articles: any[]; // TODO: Article 데이터 구조 잡아서 interface로 만들어서 수정 필요.
  lazyloadThumbnail?: boolean;
  renderAuthor?: boolean;

}
export const GridArticleList: React.FunctionComponent<Props> = (props) => {
  const {
    pageTitleForTracking,
    uiPartTitleForTracking,
    filterForTracking,
    articles,
    lazyloadThumbnail,
    renderAuthor,
  } = props;
  const section = !!pageTitleForTracking ? getSectionStringForTracking(pageTitleForTracking, uiPartTitleForTracking, filterForTracking) : undefined;

  return (
    <MediaQuery minWidth={600}>
      {(isMobile) => (
        <ul className="GridArticleList">
          {articles.map((article, idx) => (
            <li className="GridArticleList_Item" key={article.id}>
              <ConnectedTrackImpression
                section={section}
                index={idx}
                id={article.id}
              >
                <ArticleThumbnail
                  linkUrl={`/article/${article.id}`}
                  imageUrl=""
                  articleTitle={article.title}
                  lazyloadThumbnail={lazyloadThumbnail}
                />
                <Link
                  to={`/article/${article.id}`}
                  className="GridArticleList_ItemLink"
                >
                  <span className="GridArticleList_ItemTitle">
                    {article.title}
                  </span>
                  {renderAuthor ? (
                    <span className="GridArticleList_ItemAuthor">
                      {stringifyAuthors(article.authors, 2)}
                    </span>
                  ) : null}
                </Link>
              </ConnectedTrackImpression>
            </li>
          ))}
        </ul>
      )}
    </MediaQuery>
  );
};
