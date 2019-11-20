import * as classNames from 'classnames';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { Article } from '@ridi/ridi-prosemirror-editor';
import { Button, Icon } from '@ridi/rsg';

import { ArticleChannelInfoHeader } from 'app/components/ArticleChannels/ArticleChannelInfoHeader';
import { ArticleEmpty } from 'app/components/ArticleEmpty';
import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/article';
import { Actions as ArticleFavoriteActions } from 'app/services/articleFavorite';
import { RidiSelectState } from 'app/store';
import { ArticleRequestIncludableData } from 'app/types';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import toast from 'app/utils/toast';

type RouteProps = RouteComponentProps<{ channelName: string; contentIndex: string }>;

type OwnProps = RouteProps & {};

const ShareSVG = (props: { className?: string; }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className={props.className}>
    <path d="M0 0h24v24H0z" fill="none" />
    // tslint:disable-next-line:max-line-length
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

export  const ArticleContent: React.FunctionComponent<OwnProps> = (props) => {
  const { channelName, contentIndex } = props.match.params;
  const contentKey = `@${channelName}/${Number(contentIndex)}`;
  const { articleState } = useSelector((state: RidiSelectState) => ({ articleState: state.articlesById[contentKey] }));
  const dispatch = useDispatch();
  const checkIsFetched = () => {
    return (
      articleState &&
      articleState.contentFetchStatus !== FetchStatusFlag.FETCHING &&
      articleState.contentFetchStatus === FetchStatusFlag.IDLE &&
      articleState.content
    );
  };
  const copyUrl = () => {
    const domForCopyUrl = document.createElement('textarea');
    domForCopyUrl.className = 'a11y';
    domForCopyUrl.value = location.href;
    document.body.appendChild(domForCopyUrl);
    domForCopyUrl.select();
    document.execCommand('copy');
    document.body.removeChild(domForCopyUrl);
    toast.success('아티클 링크가 복사되었습니다.');
  };

  React.useEffect(() => {
    if (checkIsFetched()) {
      return;
    }
    dispatch(Actions.loadArticleRequest({
      channelName,
      contentIndex: Number(contentIndex),
      requestQueries: {
        includes: [
          ArticleRequestIncludableData.CONTENT,
          ArticleRequestIncludableData.AUTHORS,
          ArticleRequestIncludableData.IS_FAVORITE,
          ArticleRequestIncludableData.FAVORITES_COUNT,
        ],
      },
    }));
  }, []);

  return articleState && articleState.article ? (
    <main className="SceneWrapper PageArticleContent">
      <h1 className="ArticleContent_Title">{articleState.article.title}</h1>
      {articleState.article.channelId ? (
        <ArticleChannelInfoHeader
          channelId={articleState.article.channelId}
          contentKey={contentKey}
        />
      ) : null}
      {checkIsFetched() && articleState ? (
        <>
          {articleState.content ? (
            <Article
              json={articleState.content.json}
              classes={['RidiselectArticle']}
              style={{
                background: 'white',
              }}
            />
          ) : null}
          <ul className="ArticleContent_ButtonsWrapper">
            <li className="ArticleContent_ButtonElement">
              <Button
                color="gray"
                size="medium"
                outline={true}
                className={classNames(
                  'ArticleContent_Button',
                  'ArticleContent_LikeButton',
                  articleState.article.isFavorite && 'ArticleContent_LikeButton-active',
                )}
                onClick={() => dispatch(ArticleFavoriteActions.favoriteArticleActionRequest({
                  articleId: articleState.article!.id,
                  method: articleState.article!.isFavorite ? 'DELETE' : 'POST',
                }))}
              >
                <Icon
                  name="heart_1"
                  className="ArticleContent_LikeButton_Icon"
                />
                {typeof articleState.article.favoritesCount === 'number' ? thousandsSeperator(articleState.article.favoritesCount) : ''}
              </Button>
            </li>
            <li className="ArticleContent_ButtonElement">
              <Button
                color="gray"
                size="medium"
                outline={true}
                className="ArticleContent_Button ArticleContent_ShareButton"
                onClick={copyUrl}
              >
                <ShareSVG className="ArticleContent_ShareButton_Icon" />
                링크 복사하기
              </Button>
            </li>
          </ul>
        </>
      ) : <ArticleEmpty
        iconName="document"
        description="컨텐츠 내용이 비어있습니다."
      />}
    </main>
  ) : null;
};
