import { ArticleThumbnail, ArticleThumbnailImageSize } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { ArticleResponse } from 'app/services/article/requests';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking, mixedMiscTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { articleChannelToPath } from 'app/utils/toPath';
import { getArticleKeyFromData } from 'app/utils/utils';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThumbnailShape } from './ArticleThumbnail/types';

const CHART_GROUPING_COUNT = 5;

interface ArticleSectionChartListProps {
  serviceTitleForTracking?: string;
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  miscTracking?: string;
  articleList?: ArticleResponse[];
}

export const ArticleSectionChartList: React.FunctionComponent<ArticleSectionChartListProps> = props => {
  const {
    articleList,
    serviceTitleForTracking,
    pageTitleForTracking,
    uiPartTitleForTracking,
    miscTracking,
  } = props;
  const { articleChannelById } = useSelector((state: RidiSelectState) => ({
    articleChannelById: state.articleChannelById,
  }));
  const section =
    !!serviceTitleForTracking && !!pageTitleForTracking
      ? getSectionStringForTracking(
          serviceTitleForTracking,
          pageTitleForTracking,
          uiPartTitleForTracking,
        )
      : undefined;
  const dispatch = useDispatch();
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

  const trackingClick = (index: number, id: number | string, misc?: string) => {
    if (!section) {
      return;
    }
    const trackingParams: DefaultTrackingParams = { section, index, id };

    if (misc) {
      let miscParam = misc;
      if (miscTracking && misc) {
        miscParam = mixedMiscTracking(miscTracking, misc);
      }
      trackingParams.misc = miscParam;
    }

    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  return (
    <div className="ArticleChartList_Wrapper">
      {articleList &&
        articleList &&
        groupChartActicles(articleList, CHART_GROUPING_COUNT).map((groupedArticles, groupIdx) => (
          <ol className="ArticleChartGroup" start={groupIdx * 5 + 1} key={groupIdx}>
            {groupedArticles.map((article, idxInGroup) => {
              const index = groupIdx * CHART_GROUPING_COUNT + idxInGroup;
              const articleUrl = `/article/${getArticleKeyFromData(article)}`;
              const channelMeta =
                articleChannelById &&
                articleChannelById[article.channelName] &&
                articleChannelById[article.channelName].channelMeta;
              return (
                <li key={idxInGroup} className="ArticleChartList_Article">
                  <ConnectedTrackImpression
                    section={section}
                    index={index}
                    id={article.id}
                    misc={miscTracking}
                  >
                    <span className="ArticleChartList_Rank">{index + 1}</span>
                    <ArticleThumbnail
                      linkUrl={articleUrl}
                      imageUrl={article.thumbnailUrl}
                      articleTitle={article.title}
                      thumbnailShape={ThumbnailShape.SQUARE}
                      imageSize={ArticleThumbnailImageSize.HEIGHT_200}
                      onLinkClick={() =>
                        trackingClick(
                          index,
                          article.id,
                          JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` }),
                        )
                      }
                    />
                    <div className="ArticleChartList_Meta">
                      <Link
                        className="ArticleChartList_Meta_Link"
                        to={articleUrl}
                        onClick={() =>
                          trackingClick(
                            index,
                            article.id,
                            JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` }),
                          )
                        }
                      >
                        <span className="ArticleChartList_Meta_Title">{article.title}</span>
                      </Link>
                      {channelMeta ? (
                        <Link
                          className="ArticleChartList_Channel_Link"
                          to={articleChannelToPath({ channelName: channelMeta.name })}
                          onClick={() => trackingClick(index, `ch:${channelMeta.id}`)}
                        >
                          <span className="ArticleChartList_Meta_Channel">
                            {channelMeta.displayName}
                          </span>
                        </Link>
                      ) : null}
                    </div>
                  </ConnectedTrackImpression>
                </li>
              );
            })}
          </ol>
        ))}
    </div>
  );
};
