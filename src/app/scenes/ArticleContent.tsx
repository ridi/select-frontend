import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { Article } from '@ridi/ridi-prosemirror-editor';
import { Button, Icon } from '@ridi/rsg';

import { ArticleCannelInfoHeader } from 'app/components/ArticleChannels/ArticleCannelInfoHeader';
import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/article';
import { RidiSelectState } from 'app/store';

type RouteProps = RouteComponentProps<{ contentId: string; }>;
type OwnProps = RouteProps & {};

export  const ArticleContent: React.FunctionComponent<OwnProps> = (props) => {
  const articleId = Number(props.match.params.contentId);
  const articleState = useSelector((state: RidiSelectState) => state.articlesById[articleId]);
  const dispatch = useDispatch();
  const checkIsFetched = () => {
    return (
      articleState &&
      articleState.contentFetchStatus !== FetchStatusFlag.FETCHING &&
      articleState.contentFetchStatus === FetchStatusFlag.IDLE && (
        articleState.content ||
        articleState.teaserContent
      )
    );
  };

  React.useEffect(() => {
    if (checkIsFetched()) {
      return;
    }
    dispatch(Actions.loadArticleRequest({
      articleId,
      includeData: ['content'],
    }));
  }, []);

  return (
    <main className="SceneWrapper PageArticleContent">
      {checkIsFetched() && articleState && articleState.content ? (
        <>
          <h1 className="ArticleContent_Title">{articleState.title}</h1>
          <ArticleCannelInfoHeader />
          <Article
            json={articleState.content.json}
            classes={['RidiselectArticle']}
            style={{
              background: 'white',
            }}
          />
          <ul className="ArticleContent_ButtonsWrapper">
            <li className="ArticleContent_ButtonElement">
              <Button
                color="gray"
                size="medium"
                outline={true}
                className="ArticleContent_Button ArticleContent_LikeButton"
              >
                <Icon
                  name="heart_1"
                  className="ArticleContent_LikeButton_Icon"
                />
                1,020
              </Button>
            </li>
            <li className="ArticleContent_ButtonElement">
              <Button
                color="gray"
                size="medium"
                outline={true}
                className="ArticleContent_Button ArticleContent_ShareButton"
              >
                공유하기
              </Button>
            </li>
          </ul>
        </>
      ) : null}
    </main>
  );
};
