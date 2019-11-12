import * as React from 'react';
import { Link } from 'react-router-dom';

import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ArticleResponse } from 'app/services/article/requests';
import { ThumbnailShape } from './ArticleThumbnail/types';

const CHART_GROUPING_COUNT = 5;

interface ArticleSectionChartListProps {
  articleList?: ArticleResponse[];
}

export const ArticleSectionChartList: React.FunctionComponent<ArticleSectionChartListProps> = (props) => {
  const { articleList } = props;

  const groupChartActicles = (articles: ArticleResponse[], groupingUnitCount: number) => {
    const groupedArticles: ArticleResponse[][] = [];
    articles.slice(0, 10).map((article, idx) => {
      if (idx % groupingUnitCount === 0) {
        groupedArticles.push([article]);
      } else {
        groupedArticles[groupedArticles.length - 1].push(article);
      }
    });

    return groupedArticles;
  };

  return (
    <div className="ArticleChartList_Wrapper">
      { articleList && articleList &&
        groupChartActicles(articleList, CHART_GROUPING_COUNT)
        .map( (groupedArticles, groupIdx) => (
          <ol className="ArticleChartGroup" start={groupIdx * 5 + 1} key={groupIdx}>
            { groupedArticles.map((article, idxInGroup) => {
                const index = groupIdx * CHART_GROUPING_COUNT + idxInGroup;
                return (
                  <li
                    key={idxInGroup}
                    className="ArticleChartList_Article"
                  >
                    <span className="ArticleChartList_Rank">{index + 1}</span>
                    <ArticleThumbnail
                      linkUrl={article.url}
                      imageUrl={article.thumbnailUrl}
                      articleTitle={article.title}
                      thumbnailShape={ThumbnailShape.SQUARE}
                    />
                    <Link
                      className="ArticleChartList_Meta"
                      to={article.url}
                    >
                      <span className="ArticleChartList_Meta_Title">{article.title}</span>
                      {article.channel ? (
                        <span className="ArticleChartList_Meta_Channel">{article.channel.name}</span>
                      ) : null}
                    </Link>
                  </li>
                );
              },
            )}
          </ol>
        ),
      )}
    </div>
  );
};
