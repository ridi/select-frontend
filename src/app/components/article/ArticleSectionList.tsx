import { ArticleList } from 'app/utils/mockUp';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface ArticleSectionListProps {
  articleList?: ArticleList[];
}

export const ArticleSectionList: React.FunctionComponent<ArticleSectionListProps> = (props) => {
  const { articleList } = props;
  return (
    <div className="ArticleList_Wrapper">
      <ul className="ArticleList">
        { articleList && articleList.map( (data, i) => {
          return (
            <li key={i} className="Article">
              <Link to={``}>
                <img className="Article_Thumbnail" src={data.thumbUrl} />
                <div className="ArticleMeta">
                  <span className="ArticleTitle">{data.title}</span>
                  <span className="ArticleChannel">{data.channel}</span>
                </div>
              </Link>
            </li>
          );
        })
        }
      </ul>
    </div>
  );
};
