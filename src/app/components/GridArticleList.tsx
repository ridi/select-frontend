import { Method } from 'axios';
import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';
import { ArticleChannelThumbnail } from 'app/components/ArticleChannels/ArticleChannelThumbnail';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { Actions } from 'app/services/article';
import { ArticleResponse } from 'app/services/article/requests';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking, mixedMiscTracking } from 'app/services/tracking/utils';
import { RidiSelectState } from 'app/store';
import { buildDateDistanceFormat } from 'app/utils/formatDate';
import { articleChannelToPath } from 'app/utils/toPath';
import { getArticleKeyFromData } from 'app/utils/utils';

interface Props {
  serviceTitleForTracking?: string;
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  miscTracking?: string;
  articles: ArticleResponse[];
  renderAuthor?: boolean;
  renderChannelThumbnail?: boolean;
  renderChannelMeta?: boolean;
  renderPublishDate?: boolean;
  renderFavoriteButton?: boolean;
  isFullWidthAvailable?: boolean;
  gridListSizeClassNames?: string;
}
export const GridArticleList: React.FunctionComponent<Props> = props => {
  const dispatch = useDispatch();
  const {
    serviceTitleForTracking,
    pageTitleForTracking,
    uiPartTitleForTracking,
    miscTracking,
    articles,
    renderAuthor = true,
    renderChannelThumbnail = false,
    renderChannelMeta = false,
    renderPublishDate = false,
    renderFavoriteButton = false,
    isFullWidthAvailable = false,
    gridListSizeClassNames,
  } = props;

  const section =
    !!serviceTitleForTracking && !!pageTitleForTracking
      ? getSectionStringForTracking(
          serviceTitleForTracking,
          pageTitleForTracking,
          uiPartTitleForTracking,
        )
      : undefined;
  const { articleChannelById } = useSelector((state: RidiSelectState) => ({
    articleChannelById: state.articleChannelById,
  }));
  const favoriteArticleAction = (articleId: number, isFavorite: boolean | undefined) => {
    let method: Method = 'POST';
    if (isFavorite) {
      method = 'DELETE';
    }
    dispatch(Actions.favoriteArticleActionRequest({ articleId, method }));
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
    <ul
      className={classNames(
        'GridArticleList',
        isFullWidthAvailable && 'GridArticleList-fullWidthAvailable',
        gridListSizeClassNames,
      )}
    >
      {articles.map((article, idx) => {
        const articleUrl = `/article/${getArticleKeyFromData(article)}`;
        const channelMeta =
          articleChannelById &&
          articleChannelById[article.channelName] &&
          articleChannelById[article.channelName].channelMeta;
        return (
          <li className="GridArticleItem" key={idx}>
            <ConnectedTrackImpression
              section={section}
              index={idx}
              id={article.id}
              misc={miscTracking}
            >
              <ArticleThumbnail
                linkUrl={articleUrl}
                imageUrl={article.thumbnailUrl}
                articleTitle={article.title}
                isEnabled={article.isEnabled}
                onLinkClick={() =>
                  trackingClick(
                    idx,
                    article.id,
                    JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` }),
                  )
                }
              />
              <div className="GridArticleItem_Meta">
                {renderChannelThumbnail && channelMeta ? (
                  <ArticleChannelThumbnail
                    imageUrl={channelMeta.thumbnailUrl}
                    linkUrl={articleChannelToPath({ channelName: channelMeta.name })}
                    channelName={channelMeta.displayName}
                    isEnabled={channelMeta.isEnabled}
                    onLinkClick={() => trackingClick(idx, `ch:${channelMeta.id}`)}
                  />
                ) : null}
                <div className="GridArticleItem_Meta_InnerWrapper">
                  {article.isEnabled ? (
                    <>
                      <Link
                        to={articleUrl}
                        className="GridArticleItem_Link"
                        onClick={() =>
                          trackingClick(
                            idx,
                            article.id,
                            JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` }),
                          )
                        }
                      >
                        <p className="GridArticleItem_Title">{article.title}</p>
                      </Link>
                      {renderChannelMeta && channelMeta ? (
                        <Link
                          to={articleChannelToPath({ channelName: channelMeta.name })}
                          onClick={() => trackingClick(idx, `ch:${channelMeta.id}`)}
                        >
                          <p className="GridArticleItem_ChannelName">{channelMeta.displayName}</p>
                        </Link>
                      ) : null}
                      <Link
                        to={articleUrl}
                        className="GridArticleItem_Link"
                        onClick={() =>
                          trackingClick(
                            idx,
                            article.id,
                            JSON.stringify({ sect_ch: `ch:${channelMeta!.id}` }),
                          )
                        }
                      >
                        {renderAuthor && article.author ? (
                          <span className="GridArticleItem_Author">{article.author.name}</span>
                        ) : null}
                        {renderPublishDate && article.publishDate ? (
                          <span className="GridArticleItem_RegDate">
                            {' '}
                            · {buildDateDistanceFormat(article.publishDate)} 전
                          </span>
                        ) : null}
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="GridArticleItem_Title">{article.title}</p>
                      {renderChannelMeta && channelMeta ? (
                        <p className="GridArticleItem_ChannelName">{channelMeta.displayName}</p>
                      ) : null}
                      {renderAuthor && article.author ? (
                        <span className="GridArticleItem_Author">{article.author.name}</span>
                      ) : null}
                      {renderPublishDate && article.publishDate ? (
                        <span className="GridArticleItem_RegDate">
                          {' '}
                          · {buildDateDistanceFormat(article.publishDate)} 전
                        </span>
                      ) : null}
                    </>
                  )}
                </div>
                {renderFavoriteButton ? (
                  <div className="GridArticleItem_ButtonWrapper">
                    <button
                      className="GridArticleItem_FavoriteButton"
                      onClick={() => favoriteArticleAction(article.id, article.isFavorite)}
                    >
                      <Icon
                        name="heart_1"
                        className={classNames(
                          'GridArticleItem_FavoriteButtonIcon',
                          article.isFavorite && 'GridArticleItem_FavoriteButton-active',
                        )}
                      />
                    </button>
                  </div>
                ) : null}
              </div>
            </ConnectedTrackImpression>
          </li>
        );
      })}
    </ul>
  );
};
