import { ArticleChartList, ArticleList } from 'app/utils/mockUp';
import * as React from 'react';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

const CHART_GROUPING_COUNT = 5;

interface ArticleSectionChartListProps {
  articleList?: ArticleChartList[];
}

export const ArticleSectionChartList: React.FunctionComponent<ArticleSectionChartListProps> = (props) => {
  const { articleList } = props;

  const groupChartActicles = (articles: ArticleChartList[], groupingUnitCount: number) => {
    const sliceArticleList = articles.slice(0, 6);
    const groupedArticles: ArticleChartList[][] = [];
    sliceArticleList.map((article, idx) => {
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
                  <li key={idxInGroup} className="Article">
                    <div className="pass-through">
                      <span className="ArticleHomeSection_ChartRanking">{index + 1}</span>
                      <div className="Article_Thumbnail">
                        <img src={''} />
                      </div>
                      <div className="Article_Meta">
                        <span className="Article_Title">{article.title}</span>
                        <span className="Article_Channel">{article.channel}</span>
                      </div>
                    </div>
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
