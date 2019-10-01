import * as React from 'react';
import { Link } from 'react-router-dom';

export const ArticleList = () => {
  return (
    <div className="ArticleList_Wrapper">
      <ul className="ArticleList">
        <li className="Article">
          <Link to={``}>
            <img src="" />
            <div className="ArticleMeta">
              <span className="ArticleTitle">타이틀</span>
              <span className="ArticleChannel">채널</span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};
