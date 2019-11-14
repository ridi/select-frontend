import { Method } from 'axios';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { Icon } from '@ridi/rsg';

import { RidiSelectState } from 'app/store';
import { Actions } from 'app/services/articleFavorite';
import { buildDateDistanceFormat } from 'app/utils/formatDate';
import { ArticleResponse } from 'app/services/article/requests';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { getArticleKeyFromData } from 'app/utils/utils';

interface Props {
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  filterForTracking?: string;
  articles: ArticleResponse[];
  renderAuthor?: boolean;
  renderChannelMeta?: boolean;
  renderRegDate?: boolean;
  renderFavoriteButton?: boolean;
  isFullWidthAvailable?: boolean;

}
export const GridArticleList: React.FunctionComponent<Props> = (props) => {
  const dispatch = useDispatch();
  const {
    pageTitleForTracking,
    uiPartTitleForTracking,
    filterForTracking,
    articles,
    renderAuthor = true,
    renderChannelMeta = false,
    renderRegDate = false,
    renderFavoriteButton = false,
    isFullWidthAvailable = false,
  } = props;

  const section = !!pageTitleForTracking
    ? getSectionStringForTracking(pageTitleForTracking, uiPartTitleForTracking, filterForTracking)
    : undefined;
  const { articleChannelById } = useSelector((state: RidiSelectState) => ({ articleChannelById: state.articleChannelById }));

  const favoriteArticleAction = (articleId: number, isFavorite: boolean | undefined) => {
    let method: Method = 'POST';
    if (isFavorite) {
      method = 'DELETE';
    }
    dispatch(Actions.favoriteArticleActionRequest({ articleId, method }));
  };

  return (
    <ul
      className={classNames(
        'GridArticleList',
        isFullWidthAvailable && 'GridArticleList-fullWidthAvailable',
      )}
    >
      {articles.map((article, idx) => {
        const articleUrl = `/article/${getArticleKeyFromData(article)}`;
        const channelMeta = articleChannelById &&
          articleChannelById[article.channelId] &&
          articleChannelById[article.channelId].channelMeta;
        return (
          <li className="GridArticleItem" key={idx}>
            <ConnectedTrackImpression
              section={section}
              index={idx}
              id={article.id}
            >
              <ArticleThumbnail
                linkUrl={articleUrl}
                imageUrl={article.thumbnailUrl}
                articleTitle={article.title}
              />
              <div className="GridArticleItem_Meta">
                {renderChannelMeta ? (
                  <div className="GridArticleItem_ChannelThumbnail">
                    <img src={channelMeta ? channelMeta.thumbnailUrl : ''} className="GridArticleItem_ChannelThumbnailImage" />
                  </div>
                ) : null}
                <Link
                  to={articleUrl}
                  className="GridArticleItem_Link"
                >
                  <p className="GridArticleItem_Title">
                    {article.title}
                  </p>
                  {renderChannelMeta ? (
                    <p className="GridArticleItem_ChannelName">
                      {channelMeta ? channelMeta.displayName : ''}
                    </p>
                  ) : null}
                  {renderAuthor && article.author ? (
                    <span className="GridArticleItem_Author">
                      {article.author.name}
                    </span>
                  ) : null}
                  {renderRegDate && article.regDate ? (
                    <span className="GridArticleItem_RegDate"> · {buildDateDistanceFormat(article.regDate)} 전</span>
                  ) : null}
                </Link>
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
