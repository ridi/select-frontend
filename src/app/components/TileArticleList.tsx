import { Icon } from '@ridi/rsg';
import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ArticleResponse } from 'app/services/article/requests';
import { Actions } from 'app/services/articleFavorite';
import { RidiSelectState } from 'app/store';
import { buildDateDistanceFormat } from 'app/utils/formatDate';
import { Method } from 'axios';
import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface Props {
  articles: ArticleResponse[]; // TODO: Article 데이터 구조 잡아서 interface로 만들어서 수정 필요.
  pageType?: string;
}

export const TileArticleList: React.FunctionComponent<Props> = (props) => {
  const { articles, pageType } = props;
  const { articleChannelById } = useSelector((state: RidiSelectState) => state);
  const dispatch = useDispatch();

  const favoriteArticleAction = (articleId: number, isFavorite: boolean | undefined) => {
    let method: Method = 'POST';
    if (isFavorite) {
      method = 'DELETE';
    }
    dispatch(Actions.favoriteArticleActionRequest({ articleId, method }));
  };
  return(
    <ul className="TileArticleList">
      {
        articles.map((article, idx) => {
          const channelMeta = articleChannelById[article.channelId].channelMeta!;
          return (
            <li className="TileArticleList_Item" key={idx}>
              <ArticleThumbnail
                linkUrl={article.url}
                imageUrl={article.thumbnailUrl}
                articleTitle={article.title}
              />
              <div className="TileArticleList_ItemInfo">
                <div className="TileArticleList_ChannelThumbnail">
                  <img src={channelMeta.thumbnailUrl} className="TileArticleList_Thumbnail" />
                </div>
                <Link
                  to={article.url}
                  className="TileArticleList_ItemLink"
                >
                  <div className="TileArticleList_MetaData">
                    <p className="TileArticleList_Title">{article.title}</p>
                    <span className="TileArticleList_ChannelName">{channelMeta.displayName}</span>
                    <span className="TileArticleList_Date"> · {buildDateDistanceFormat(article.regDate)} 전</span>
                  </div>
                </Link>
                {
                  pageType === 'favorite' && (
                    <div className="TileArticleList_Favorite">
                      <button
                        className="TileArticleList_Favorite_Button"
                        onClick={() => favoriteArticleAction(article.id, article.isFavorite)}
                      >
                        <Icon
                          name="heart_1"
                          className={classNames(
                            'TileArticleList_Favorite_Icon',
                            article.isFavorite && 'TileArticleList_Favorite-active',
                          )}
                        />
                      </button>
                    </div>
                  )
                }
              </div>
            </li>
          ); })
      }
    </ul>
  );
};
