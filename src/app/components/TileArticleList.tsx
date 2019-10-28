import { ArticleThumbnail } from 'app/components/ArticleThumbnail';
import { ArticleResponse } from 'app/services/article/requests';
import { RidiSelectState } from 'app/store';
import { buildDateDistanceFormat } from 'app/utils/formatDate';
import { articleContentToPath } from 'app/utils/toPath';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

interface Props {
  articles: ArticleResponse[]; // TODO: Article 데이터 구조 잡아서 interface로 만들어서 수정 필요.
}

export const TileArticleList: React.FunctionComponent<Props> = (props) => {
  const { articles } = props;
  const { articleChannelById } = useSelector((state: RidiSelectState) => state);

  return(
    <ul className="TileArticleList">
      {
        articles.map((article, idx) => (
          <li className="TileArticleList_Item" key={idx}>
            <ArticleThumbnail
              linkUrl={articleContentToPath({ contentId: String(article.id) })}
              imageUrl={article.thumbnailUrl}
              articleTitle={article.title}
            />
            <Link
              to={articleContentToPath({ contentId: String(article.id) })}
              className="TileArticleList_ItemLink"
            >
              <div className="TileArticleList_ItemInfo">
                <div className="TileArticleList_ChannelThumbnail">
                  <img src={articleChannelById[article.channelId].channelMeta!.thumbnailUrl} className="TileArticleList_Thumbnail" />
                </div>
                <div className="TileArticleList_MetaData">
                  <p className="TileArticleList_Title">{article.title}</p>
                  <span className="TileArticleList_ChannelName">{articleChannelById[article.channelId].channelMeta!.name}</span>
                  <span className="TileArticleList_Date"> · {buildDateDistanceFormat(article.regDate)} 전</span>
                </div>
              </div>
            </Link>
          </li>
        ))
      }
    </ul>
  );
};
